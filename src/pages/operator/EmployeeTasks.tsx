import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Activity,
  ListTodo,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Loader2,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Types based on the task schema
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

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_image: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

interface PaginationData {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
}

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0,
  });
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_BASE}/get/assign/task?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        const tasksData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setTasks(tasksData);
        setPagination(
          response.data.pagination || {
            currentPage: 1,
            limit: 10,
            totalRecords: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
        calculateTaskStats(tasksData);
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to view tasks");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTaskStats = (tasksData: Task[]) => {
    const total = tasksData.length;
    const completed = tasksData.filter(
      (task) => task.status === "COMPLETED",
    ).length;
    const inProgress = tasksData.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;
    const todo = tasksData.filter((task) => task.status === "TODO").length;

    const now = new Date();
    const overdue = tasksData.filter((task) => {
      if (task.status === "COMPLETED") return false;
      const createdDate = new Date(task.createdAt);
      const diffDays =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
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

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
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

      return new Date(dateString).toLocaleDateString("en-TZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "TODO":
        return {
          label: "To Do",
          color: "gray",
          icon: ListTodo,
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          dot: "bg-gray-500",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          color: "blue",
          icon: Activity,
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
          dot: "bg-blue-500 animate-pulse",
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "green",
          icon: CheckCircle,
          bg: "bg-green-500/10",
          text: "text-green-400",
          border: "border-green-500/30",
          dot: "bg-green-500",
        };
      default:
        return {
          label: "Unknown",
          color: "gray",
          icon: ListTodo,
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          dot: "bg-gray-500",
        };
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedTasks = () => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof Task];
      let bVal: any = b[sortField as keyof Task];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredAndSortedTasks = getSortedTasks();
  const paginatedTasks = filteredAndSortedTasks.slice(
    (pagination.currentPage - 1) * pagination.limit,
    pagination.currentPage * pagination.limit,
  );

  const totalPages = Math.ceil(
    filteredAndSortedTasks.length / pagination.limit,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                <p className="text-sm text-gray-400">
                  View and manage tasks assigned to you
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchMyTasks(pagination.currentPage)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-all duration-200"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-2xl font-bold text-white">
              {taskStats.totalTasks}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
            <p className="text-xs text-gray-400">To Do</p>
            <p className="text-2xl font-bold text-gray-400">
              {taskStats.todoTasks}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
            <p className="text-xs text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-blue-400">
              {taskStats.inProgressTasks}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
            <p className="text-xs text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {taskStats.completedTasks}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
            <p className="text-xs text-gray-400">Overdue</p>
            <p className="text-2xl font-bold text-red-400">
              {taskStats.overdueTasks}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Task Name
                      {sortField === "name" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortField === "status" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      {sortField === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400">
                          No tasks assigned to you
                        </p>
                        <p className="text-xs text-gray-500">
                          Your manager will assign tasks to you soon
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task) => {
                    const statusInfo = getStatusInfo(task.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-700/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${statusInfo.dot}`}
                            ></div>
                            <span className="text-sm font-medium text-white">
                              {task.name}
                            </span>
                          </div>
                          {task.comment && (
                            <div className="flex items-center gap-1 mt-1">
                              <MessageSquare className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-400 line-clamp-1">
                                {task.comment}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300 line-clamp-2 max-w-xs">
                            {task.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-400">
                              {formatDate(task.createdAt)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(task.createdAt).toLocaleTimeString(
                                "en-TZ",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all duration-200"
                              title="View Task Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  filteredAndSortedTasks.length,
                )}{" "}
                of {filteredAndSortedTasks.length} tasks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchMyTasks(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 px-3">
                  Page {pagination.currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchMyTasks(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Task Modal */}
      {isViewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Task Details</h2>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedTask(null);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Task Name
                  </p>
                  <p className="text-white font-medium">{selectedTask.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  {(() => {
                    const statusInfo = getStatusInfo(selectedTask.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </p>
                <p className="text-white">{selectedTask.description}</p>
              </div>

              {selectedTask.comment && (
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Comment
                  </p>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                    <p className="text-white">{selectedTask.comment}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Created At
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white">
                      {new Date(selectedTask.createdAt).toLocaleDateString(
                        "en-TZ",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(selectedTask.createdAt).toLocaleTimeString(
                      "en-TZ",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Last Updated
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-white">
                      {new Date(selectedTask.updatedAt).toLocaleDateString(
                        "en-TZ",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(selectedTask.updatedAt).toLocaleTimeString(
                      "en-TZ",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
