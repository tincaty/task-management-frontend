import { useState, useEffect } from "react";
import {
  LogOut,
  AlertCircle,
  FileText,
  User,
  Mail,
  Shield,
  Activity,
  Database,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Briefcase,
  ListTodo,
  CheckSquare,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

interface Task {
  _id: string;
  assign_to: string;
  name: string;
  description: string;
  comment?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
}

interface RecentTask {
  _id: string;
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  assign_to: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchLoginUser();
    fetchAllTasks();
    fetchAllUsers();
  }, []);

  const fetchLoginUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(`${API_BASE}/get/login/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tasks and calculate statistics
  const fetchAllTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch all tasks with pagination (get all pages)
      const response = await axios.get(`${API_BASE}/get/task?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const tasksData = Array.isArray(response.data.data) ? response.data.data : [];
        setTasks(tasksData);
        
        // Calculate statistics from tasks
        calculateTaskStats(tasksData);
        
        // Set recent tasks (first 5)
        setRecentTasks(tasksData.slice(0, 5));
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 403) {
        console.log("Access denied to view tasks");
      }
    }
  };

  // Calculate task statistics based on status
  const calculateTaskStats = (tasksData: Task[]) => {
    const total = tasksData.length;
    
    // Count tasks by status
    const completed = tasksData.filter(task => task.status === "COMPLETED").length;
    const inProgress = tasksData.filter(task => task.status === "IN_PROGRESS").length;
    const todo = tasksData.filter(task => task.status === "TODO").length;
    
    // Calculate overdue tasks (tasks that are not completed and created more than 7 days ago)
    const now = new Date();
    const overdue = tasksData.filter(task => {
      if (task.status === "COMPLETED") return false;
      const createdDate = new Date(task.createdAt);
      const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 7;
    }).length;

    setTaskStats({
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      todoTasks: todo,
      overdueTasks: overdue,
    });
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE}/get/all/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Handle nested data structure
        let usersData = response.data.data;
        if (usersData && typeof usersData === 'object' && !Array.isArray(usersData) && usersData.data) {
          usersData = usersData.data;
        }
        setAllUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString("en-TZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return { color: "gray", icon: ListTodo };
      case "IN_PROGRESS":
        return { color: "blue", icon: Activity };
      case "COMPLETED":
        return { color: "green", icon: CheckCircle };
      default:
        return { color: "gray", icon: ListTodo };
    }
  };

  // Get user name by ID
  const getUserName = (id: string) => {
    if (!Array.isArray(allUsers)) return "Unknown User";
    const user = allUsers.find((u) => u._id === id);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading task management dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header with Task Management Theme */}
      <div className="border-b border-blue-500/20 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-50 animate-pulse"></div>
                <CheckSquare className="relative w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Task Management System
                </h1>
                <p className="text-xs text-gray-400">
                  Project & Task Monitoring Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white mt-1">{taskStats.totalTasks}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Briefcase className="w-3 h-3" />
              <span>All tasks</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">To Do</p>
                <p className="text-2xl font-bold text-gray-400 mt-1">{taskStats.todoTasks}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-500/10">
                <ListTodo className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Pending tasks</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{taskStats.inProgressTasks}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Active tasks</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{taskStats.completedTasks}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <CheckSquare className="w-3 h-3" />
              <span>Done tasks</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{taskStats.overdueTasks}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Past deadlines</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-30"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                <h2 className="text-center text-xl font-bold text-white mt-4">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-center text-gray-400 text-sm mt-1">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Email Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm text-white font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Phone Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm text-white font-medium">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Role Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">User Role</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : user.role === "MANAGER"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Session Status</p>
                    <p className="text-sm text-green-400 font-medium">Active</p>
                  </div>
                </div>

                {/* Team Members */}
                {allUsers.length > 0 && (
                  <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Team Members ({allUsers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {allUsers.slice(0, 5).map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-700/50 border border-gray-600"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {member.first_name.charAt(0)}
                              {member.last_name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-300">
                            {member.first_name}
                          </span>
                        </div>
                      ))}
                      {allUsers.length > 5 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{allUsers.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Tasks Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Recent Tasks
                  </h3>
                  <p className="text-sm text-gray-400">
                    Latest task activity - {recentTasks.length} entries
                  </p>
                </div>
              </div>

              {/* Dynamic Task Entries */}
              <div className="space-y-3">
                {recentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks available</p>
                  </div>
                ) : (
                  recentTasks.map((task) => {
                    const statusInfo = getStatusColor(task.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div
                        key={task._id}
                        className="flex items-start justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              task.status === "COMPLETED"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-500"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white">
                                {task.name}
                              </span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300`}
                              >
                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                {task.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                Created: {formatDate(task.createdAt)}
                              </span>
                              <span className="text-xs text-gray-400">
                                Assigned to: {getUserName(task.assign_to)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {task.status === "COMPLETED" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : task.status === "IN_PROGRESS" ? (
                          <Activity className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <ListTodo className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400">
                      Task monitoring active
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Total tasks: {taskStats.totalTasks}
                    </span>
                    <span className="text-xs text-gray-500">
                      Completed: {taskStats.completedTasks}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}