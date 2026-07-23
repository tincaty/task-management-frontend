import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { bg } from "@/assets/images";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  FolderKanban,
  BarChart3,
  Shield,
  UserPlus,
  MessageSquare,
  LayoutDashboard,
  Briefcase,
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
    completedTasks: 0,
  });



  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">
      {/* Background Image - Full Page */}
      <div className="fixed inset-0 z-0">
        <img
          src={bg}
          alt="Task Management System"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Simple Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-blue-400" />
              <span className="text-white font-bold text-xl">TaskFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-blue-400 hover:bg-white/10"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
              Manage Projects & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Tasks Efficiently
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Streamline your workflow with our comprehensive task management
              system. Track projects, collaborate with teams, and boost
              productivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all"
                >
                  <UserPlus className="mr-2 w-5 h-5" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-black font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all"
                >
                  Register <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics - Floating Cards */}
        <section className="container mx-auto px-4 -mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {loading ? "..." : stats.totalProjects}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Total Projects
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {loading ? "..." : stats.completedTasks}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Completed Tasks
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {loading ? "..." : stats.activeTasks}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Active Tasks
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {loading ? "..." : stats.teamMembers}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Team Members
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
