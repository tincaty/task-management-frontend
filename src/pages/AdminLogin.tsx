import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  Lock,
  User,
  Activity,
  Shield,
  AlertCircle,
  Database,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Send login request to your backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/user/login`,
        {
          email: email.trim().toLowerCase(),
          password,
        },
      );

      // Check if login was successful
      if (res.data.success) {
        setSuccess(true);

        // Store token in localStorage
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userRole", res.data.data.role);

        // Call login context with user data
        login(res.data.data);

        // Small delay before redirect for success animation
        setTimeout(() => {
          // Role-based redirect
          if (res.data.data.role === "ADMIN") {
            navigate("/user/admin");
          } else if (res.data.data.role === "MANAGER") {
            navigate("/user/manager");
          } else if (res.data.data.role === "EMPLOYEE") {
            navigate("/user/employee");
          }
        }, 1500);
      } else {
        setError(res.data.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        // Server responded with error
        if (err.response.data?.message) {
          setError(err.response.data.message);
        } else if (err.response.status === 400) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 401) {
          setError(
            "Invalid credentials. Please check your email and password.",
          );
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Please check your internet connection.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/src/assets/bg.png')`,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-9/90 via-slate-900/85 to-slate-950/90" />

      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-indigo-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-600/5 via-blue-600/5 to-indigo-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float-slow">
        <Briefcase className="w-12 h-12 text-cyan-500" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float-slow delay-1000">
        <Shield className="w-12 h-12 text-blue-500" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-10 animate-float-slow delay-2000">
        <Sparkles className="w-8 h-8 text-indigo-500" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-cyan-600/10 hover:shadow-indigo-600/20 transition-all duration-500 p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 group border border-slate-700/30 hover:border-slate-600/50"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <Database className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Secure access to your task management system
          </p>

          {/* Role Selection Indicator */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30"></div>
                <span className="text-slate-300">Admin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"></div>
                <span className="text-slate-300">Manager</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
                <span className="text-slate-300">Employee</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">
              Login with your registered credentials
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-400 animate-in slide-in-from-top duration-300">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Login successful!</p>
              <p className="text-sm text-emerald-400/70 mt-0.5">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 to-rose-600/5 text-rose-400 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Login Error</p>
              <p className="text-sm text-rose-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="email"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 focus:border-cyan-500/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                required
                autoComplete="email"
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 focus:border-cyan-500/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                required
                autoComplete="current-password"
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || success}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
              disabled={loading || success}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Access Granted!
              </span>
            ) : (
              "Access Task System"
            )}
          </button>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Task Management System
          </p>
          <p className="text-center text-xs text-slate-600 mt-1">
            Real-time Tracking • Secure Access • Audit Trail
          </p>
        </div>
      </div>
    </div>
  );
}
