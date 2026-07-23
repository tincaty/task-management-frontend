import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Shield,
  Sparkles,
  Camera,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import logo from "@/assets/bg.png";

// Types based on your backend schema
interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profile_image?: File | null;
  role?: string;
}

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  profile_image?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function RegisterComponent() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  // Enhanced validation based on your backend requirements
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // First Name validation
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    } else if (formData.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
      isValid = false;
    }

    // Last Name validation
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    } else if (formData.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation - international format support
    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must include uppercase, lowercase, and numbers";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Profile image validation (optional but validate if provided)
    if (formData.profile_image) {
      const file = formData.profile_image;
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        errors.profile_image =
          "Please upload a valid image (JPEG, PNG, GIF, or WebP)";
        isValid = false;
      } else if (file.size > maxSize) {
        errors.profile_image = "Image size must be less than 5MB";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear general error
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setValidationErrors((prev) => ({
          ...prev,
          profile_image:
            "Please upload a valid image (JPEG, PNG, GIF, or WebP)",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          profile_image: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, profile_image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setValidationErrors((prev) => ({ ...prev, profile_image: undefined }));
      if (error) setError("");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profile_image: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Create FormData for multipart/form-data upload
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append("first_name", formData.first_name.trim());
      formDataToSend.append("last_name", formData.last_name.trim());
      formDataToSend.append("email", formData.email.trim().toLowerCase());
      formDataToSend.append("phone", formData.phone.replace(/\s/g, ""));
      formDataToSend.append("password", formData.password);

      // Append profile image if exists
      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image);
      }

      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_BASE}/create/user`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          profile_image: null,
        });
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Navigate to login after success
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          if (data.message?.includes("already exists")) {
            setError("User already exists. Please login instead.");
          } else if (data.message?.includes("required")) {
            setError("Please fill in all required fields");
          } else {
            setError(data.message || "Registration failed. Please try again.");
          }
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setError(
          "Network error. Please check your internet connection and try again.",
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
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float-slow">
        <Briefcase className="w-12 h-12 text-blue-500" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float-slow delay-1000">
        <Shield className="w-12 h-12 text-purple-500" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-10 animate-float-slow delay-2000">
        <Sparkles className="w-8 h-8 text-indigo-500" />
      </div>

      {/* Main Registration Card */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-blue-600/10 hover:shadow-indigo-600/20 transition-all duration-500 p-6 sm:p-8 md:p-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 group border border-slate-700/30 hover:border-slate-600/50"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8 mt-2">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src={logo}
                alt="Task Management System"
                className="h-14 w-auto object-contain transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Join the Task Management System and boost your productivity
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-400 animate-in slide-in-from-top duration-300">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Account created successfully!</p>
              <p className="text-sm text-emerald-400/70 mt-0.5">
                You'll be redirected to login shortly...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 to-rose-600/5 text-rose-400 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Error</p>
              <p className="text-sm text-rose-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div
                className={`w-28 h-28 rounded-full border-2 border-dashed ${
                  validationErrors.profile_image
                    ? "border-rose-500/50"
                    : "border-slate-600/50 hover:border-blue-500/50"
                } flex items-center justify-center overflow-hidden bg-slate-800/50 transition-all duration-300 cursor-pointer group`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto mb-1 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                      Add Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Remove Image Button */}
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 p-1 bg-rose-500 hover:bg-rose-600 rounded-full shadow-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                name="profile_image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                disabled={loading || success}
                className="hidden"
              />
            </div>

            {validationErrors.profile_image && (
              <p className="text-xs text-rose-400 text-center">
                {validationErrors.profile_image}
              </p>
            )}
            <p className="text-xs text-slate-500 text-center">
              Upload a profile photo (JPEG, PNG, GIF, WebP • Max 5MB)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                First Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="first_name"
                  placeholder="thomas"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border ${
                    validationErrors.first_name
                      ? "border-rose-500/50 ring-2 ring-rose-500/20"
                      : "border-slate-700/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                />
              </div>
              {validationErrors.first_name && (
                <p className="text-xs text-rose-400 pl-1">
                  {validationErrors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Last Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Mihayo"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border ${
                    validationErrors.last_name
                      ? "border-rose-500/50 ring-2 ring-rose-500/20"
                      : "border-slate-700/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                />
              </div>
              {validationErrors.last_name && (
                <p className="text-xs text-rose-400 pl-1">
                  {validationErrors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
                className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border ${
                  validationErrors.email
                    ? "border-rose-500/50 ring-2 ring-rose-500/20"
                    : "border-slate-700/50 focus:border-blue-500/50"
                } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-rose-400 pl-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="tel"
                name="phone"
                placeholder="+255 712 345 678"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading || success}
                className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 border ${
                  validationErrors.phone
                    ? "border-rose-500/50 ring-2 ring-rose-500/20"
                    : "border-slate-700/50 focus:border-blue-500/50"
                } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
              />
            </div>
            {validationErrors.phone ? (
              <p className="text-xs text-rose-400 pl-1">
                {validationErrors.phone}
              </p>
            ) : (
              <p className="text-xs text-slate-500 pl-1">
                Include country code (e.g., +255 for Tanzania)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-800/50 border ${
                    validationErrors.password
                      ? "border-rose-500/50 ring-2 ring-rose-500/20"
                      : "border-slate-700/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
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
              {validationErrors.password ? (
                <p className="text-xs text-rose-400 pl-1">
                  {validationErrors.password}
                </p>
              ) : (
                <p className="text-xs text-slate-500 pl-1">
                  Must include uppercase, lowercase, and numbers
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-800/50 border ${
                    validationErrors.confirmPassword
                      ? "border-rose-500/50 ring-2 ring-rose-500/20"
                      : "border-slate-700/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading || success}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs text-rose-400 pl-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Account created!
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
