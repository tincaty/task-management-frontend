import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Tag,
  FileText,
  Users,
  Shield,
  Activity,
  ListTodo,
  CheckSquare,
  Eye,
  Save,
  RotateCcw,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

// Types based on the backend schema
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

interface TaskFormData {
  assign_to: string;
  name: string;
  description: string;
  comment?: string;
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
}

export default function TaskManagement() {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states
  const [formData, setFormData] = useState<TaskFormData>({
    assign_to: "",
    name: "",
    description: "",
    comment: "",
  });

  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_BASE;

  // Fetch tasks with pagination and filters
  const fetchTasks = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_BASE}/get/task?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setTasks(Array.isArray(response.data.data) ? response.data.data : []);
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
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to view tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for assignment
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE}/get/all/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Ensure users is always an array
        const usersData = response.data.data.data;
        setUsers(Array.isArray(usersData) ? usersData : []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE}/get/login/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUserRole(response.data.data.role || "EMPLOYEE");
        setUserId(response.data.data._id || "");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserRole("EMPLOYEE");
    }
  };

  // Create task
  const createTask = async () => {
    if (!formData.assign_to || !formData.name || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await axios.post(`${API_BASE}/create/task`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        await fetchTasks(pagination.currentPage);
        setIsCreateModalOpen(false);
        resetForm();
        alert("Task created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      alert(error.response?.data?.message || "Failed to create task");
    }
  };

  // Update task
  const updateTask = async () => {
    if (!selectedTask) return;
    if (!formData.name || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const updateData: any = {
        name: formData.name,
        description: formData.description,
      };
      if (formData.comment !== undefined) {
        updateData.comment = formData.comment;
      }
      if (formData.status) {
        updateData.status = formData.status;
      }

      const response = await axios.patch(
        `${API_BASE}/update/task/${selectedTask._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        await fetchTasks(pagination.currentPage);
        setIsEditModalOpen(false);
        resetForm();
        alert("Task updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating task:", error);
      alert(error.response?.data?.message || "Failed to update task");
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (!selectedTask) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await axios.delete(
        `${API_BASE}/delete/task/${selectedTask._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        await fetchTasks(pagination.currentPage);
        setIsDeleteModalOpen(false);
        alert("Task deleted successfully!");
      }
    } catch (error: any) {
      console.error("Error deleting task:", error);
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      assign_to: "",
      name: "",
      description: "",
      comment: "",
    });
    setSelectedTask(null);
  };

  // Handle edit form population
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      assign_to: task.assign_to,
      name: task.name,
      description: task.description,
      comment: task.comment || "",
      status: task.status,
    });
    setIsEditModalOpen(true);
  };

  // Handle view task
  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  // Handle delete confirmation
  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Get user name by ID
  const getUserName = (id: string) => {
    if (!Array.isArray(users)) return "Unknown User";
    const user = users.find((u) => u._id === id);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "TODO":
        return {
          color: "gray",
          icon: ListTodo,
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
        };
      case "IN_PROGRESS":
        return {
          color: "blue",
          icon: Activity,
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
        };
      case "COMPLETED":
        return {
          color: "green",
          icon: CheckCircle,
          bg: "bg-green-500/10",
          text: "text-green-400",
          border: "border-green-500/30",
        };
      default:
        return {
          color: "gray",
          icon: ListTodo,
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
        };
    }
  };

  // Can user edit/delete task
  const canEditTask = () => {
    return userRole === "ADMIN" || userRole === "MANAGER";
  };

  const canDeleteTask = () => {
    return userRole === "ADMIN";
  };

  // Initial load
  useEffect(() => {
    fetchTasks(1, 10);
    fetchUsers();
    fetchCurrentUser();
  }, []);

  // Filter tasks based on search and status
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesSearch =
          task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Task Management
                </h1>
                <p className="text-sm text-gray-400">
                  Manage and track all tasks efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchTasks(pagination.currentPage)}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-all duration-200"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              {userRole === "ADMIN" && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Task</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
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
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Activity className="w-6 h-6 animate-spin text-blue-400" />
                        <span className="text-gray-400">Loading tasks...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400">No tasks found</p>
                        {userRole === "ADMIN" && (
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-2 text-blue-400 hover:text-blue-300"
                          >
                            Create your first task
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const statusInfo = getStatusInfo(task.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-700/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-white">
                              {task.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300 line-clamp-2 max-w-xs">
                            {task.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-xs text-white font-medium">
                                {getUserName(task.assign_to).charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-300">
                              {getUserName(task.assign_to)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {task.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {format(new Date(task.createdAt), "MMM d, yyyy")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(task)}
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all duration-200"
                              title="View Task"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canEditTask() && (
                              <button
                                onClick={() => handleEdit(task)}
                                className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-all duration-200"
                                title="Edit Task"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteTask() && (
                              <button
                                onClick={() => handleDelete(task)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
          {pagination.totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalRecords,
                )}{" "}
                of {pagination.totalRecords} tasks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    fetchTasks(pagination.currentPage - 1, pagination.limit)
                  }
                  disabled={!pagination.hasPreviousPage}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 px-3">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    fetchTasks(pagination.currentPage + 1, pagination.limit)
                  }
                  disabled={!pagination.hasNextPage}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Create New Task
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assign To *
                </label>
                <select
                  value={formData.assign_to}
                  onChange={(e) =>
                    setFormData({ ...formData, assign_to: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a user</option>
                  {Array.isArray(users) &&
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Comment
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={2}
                  placeholder="Add a comment (optional)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Edit className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Edit Task</h2>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || "TODO"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "TODO"
                        | "IN_PROGRESS"
                        | "COMPLETED",
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Comment
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={2}
                  placeholder="Add a comment (optional)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedTask.status).bg} ${getStatusInfo(selectedTask.status).text} border ${getStatusInfo(selectedTask.status).border}`}
                  >
                    {React.createElement(
                      getStatusInfo(selectedTask.status).icon,
                      { className: "w-3 h-3" },
                    )}
                    {selectedTask.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </p>
                <p className="text-white">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Assigned To
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-sm text-white font-medium">
                        {getUserName(selectedTask.assign_to).charAt(0)}
                      </span>
                    </div>
                    <span className="text-white">
                      {getUserName(selectedTask.assign_to)}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="text-white">
                    {format(
                      new Date(selectedTask.createdAt),
                      "MMMM d, yyyy 'at' h:mm a",
                    )}
                  </p>
                </div>
              </div>

              {selectedTask.comment && (
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Comment
                  </p>
                  <p className="text-white">{selectedTask.comment}</p>
                </div>
              )}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Task</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the task{" "}
              <strong className="text-white">"{selectedTask.name}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
