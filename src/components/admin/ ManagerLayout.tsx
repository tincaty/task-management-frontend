import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  User,
  Users,
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  Clock,
  Settings,
  Bell,
  Briefcase,
  BarChart3,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types based on the schema
interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_image: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

export default function ManagerLayout() {
  const [userData, setUserData] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Navigation links for Manager
  const links = [
    {
      label: "Dashboard",
      path: "/user/manager",
      icon: LayoutDashboard,
      description: "Overview & Team Tasks",
    },
    {
      label: "Team Tasks",
      path: "/user/manager/task",
      icon: CheckSquare,
      description: "Manage team tasks",
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/get/login/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowUserMenu(false);
    window.location.href = "/login";
  };

  // Protect routes - redirect to login if not authenticated
  const token = localStorage.getItem("token");
  if (!token && !loading) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has manager role
  const userRole = userData?.role;
  if (userRole !== "MANAGER" && !loading) {
    return <Navigate to="/" replace />;
  }

  const getInitials = () => {
    if (userData) {
      return (
        `${userData.first_name?.charAt(0) || ""}${userData.last_name?.charAt(0) || ""}`.toUpperCase() ||
        "U"
      );
    }
    return "U";
  };

  const getFullName = () => {
    if (userData) {
      return (
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
        "Manager"
      );
    }
    return "Manager";
  };

  const getUserEmail = () => {
    if (userData) {
      return userData.email || "manager@example.com";
    }
    return "manager@example.com";
  };

  const getUserRole = () => {
    const role = userData?.role || "MANAGER";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const currentPage =
    links.find((l) => l.path === location.pathname)?.label || "Dashboard";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 text-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static shadow-2xl border-r border-gray-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight text-white">
                Task Manager
              </h2>
              <p className="text-sm text-gray-400">Manager Panel</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-5 py-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md">
                {userData?.profile_image ? (
                  <img
                    src={userData.profile_image}
                    alt={getFullName()}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-white truncate">
                {getFullName()}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[140px]">
                {getUserEmail()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-orange-400" />
                <p className="text-xs text-orange-400 font-medium">
                  {getUserRole()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {links.map((l) => {
            const active = location.pathname === l.path;
            return (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                <l.icon
                  className={`w-5 h-5 ${active ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{l.label}</div>
                  <div
                    className={`text-xs truncate ${active ? "text-orange-200" : "text-gray-500"}`}
                  >
                    {l.description}
                  </div>
                </div>
                {active && (
                  <div className="w-1.5 h-8 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Status Section */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/20">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">
                System Status: Online
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-600 transition-all duration-300 text-sm font-medium text-red-400 hover:text-white border border-red-500/20 hover:border-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm shadow-lg px-4 md:px-6 py-4 flex items-center gap-4 border-b border-gray-700">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-700 transition text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Page Title */}
          <div className="flex-1">
            <h2 className="font-bold text-xl text-white">{currentPage}</h2>
            <p className="text-sm text-gray-400">
              {links.find((l) => l.label === currentPage)?.description ||
                "Manage your team and tasks"}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-700/50">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm font-medium text-gray-300">
                {getUserRole()}
              </span>
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl hover:bg-gray-700 transition relative text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {getInitials()}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                    {/* User Info in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {getInitials()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {getFullName()}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {getUserEmail()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-xs">
                          <Shield className="w-3 h-3" />
                          {getUserRole()}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/user/manager/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>

                    <Link
                      to="/user/manager/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      System Settings
                    </Link>

                    <div className="border-t border-gray-700 my-1"></div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white hidden md:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ userData, refreshUser: fetchUserData }} />
        </main>
      </div>
    </div>
  );
}
