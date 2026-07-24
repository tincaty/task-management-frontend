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
  UserCog,
  BarChart3,
  TrendingDown,
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
  completionRate: number;
}

interface RecentTask {
  _id: string;
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  assign_to: string;
}

interface TeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  taskCount: number;
  completedTasks: number;
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
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

      const response = await axios.get(
        `${API_BASE}/get/task?page=1&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        const tasksData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAllTasks(tasksData);

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
    const completed = tasksData.filter(
      (task) => task.status === "COMPLETED",
    ).length;
    const inProgress = tasksData.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;
    const todo = tasksData.filter((task) => task.status === "TODO").length;

    // Calculate overdue tasks (tasks that are not completed and created more than 7 days ago)
    const now = new Date();
    const overdue = tasksData.filter((task) => {
      if (task.status === "COMPLETED") return false;
      const createdDate = new Date(task.createdAt);
      const diffDays =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 7;
    }).length;

    // Calculate completion rate
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    setTaskStats({
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      todoTasks: todo,
      overdueTasks: overdue,
      completionRate: completionRate,
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
        let usersData = response.data.data;
        if (
          usersData &&
          typeof usersData === "object" &&
          !Array.isArray(usersData) &&
          usersData.data
        ) {
          usersData = usersData.data;
        }
        const users = Array.isArray(usersData) ? usersData : [];
        setAllUsers(users);

        // Calculate team member statistics
        calculateTeamStats(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Calculate team member statistics
  const calculateTeamStats = (users: User[]) => {
    const teamStats = users
      .filter((u) => u.role === "EMPLOYEE")
      .map((member) => {
        const memberTasks = allTasks.filter(
          (task) => task.assign_to === member._id,
        );
        const completed = memberTasks.filter(
          (task) => task.status === "COMPLETED",
        ).length;

        return {
          _id: member._id,
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          profile_image: member.profile_image,
          taskCount: memberTasks.length,
          completedTasks: completed,
        };
      })
      .sort((a, b) => b.taskCount - a.taskCount);

    setTeamMembers(teamStats);
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
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

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

  const getUserName = (id: string) => {
    if (!Array.isArray(allUsers)) return "Unknown User";
    const user = allUsers.find((u) => u._id === id);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-blue-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-30 animate-pulse"></div>
                <UserCog className="relative w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Manager Dashboard
                </h1>
                <p className="text-xs text-gray-500">
                  Team & Task Management Overview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {taskStats.totalTasks}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Briefcase className="w-3 h-3" />
              <span>All team tasks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">To Do</p>
                <p className="text-2xl font-bold text-gray-700 mt-1">
                  {taskStats.todoTasks}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100">
                <ListTodo className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Pending tasks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {taskStats.inProgressTasks}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Active tasks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {taskStats.completedTasks}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <CheckSquare className="w-3 h-3" />
              <span>Done tasks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {taskStats.overdueTasks}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Past deadlines</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {taskStats.completionRate}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>Overall progress</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
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
                <h2 className="text-center text-xl font-bold text-gray-900 mt-4">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-center text-gray-600 text-sm mt-1">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Team Size</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {teamMembers.length} members
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Session Status</p>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks & Team Members */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Tasks
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest team activity - {recentTasks.length} entries
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks available</p>
                  </div>
                ) : (
                  recentTasks.map((task) => {
                    const statusInfo = getStatusColor(task.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div
                        key={task._id}
                        className="flex items-start justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              task.status === "COMPLETED"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-gray-900">
                                {task.name}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                {task.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                Created: {formatDate(task.createdAt)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Assigned to: {getUserName(task.assign_to)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {task.status === "COMPLETED" ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : task.status === "IN_PROGRESS" ? (
                          <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ListTodo className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Team Members Overview */}
            {teamMembers.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Team Members
                    </h3>
                    <p className="text-sm text-gray-500">
                      {teamMembers.length} members in your team
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          {member.profile_image ? (
                            <img
                              src={member.profile_image}
                              alt={`${member.first_name} ${member.last_name}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {member.first_name.charAt(0)}
                              {member.last_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {member.taskCount} tasks
                        </p>
                        <p className="text-xs text-green-600">
                          {member.completedTasks} completed
                        </p>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{teamMembers.length - 5} more team members
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
