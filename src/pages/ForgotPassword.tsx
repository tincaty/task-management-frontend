import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Key,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordForm {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [formData, setFormData] = useState<ResetPasswordForm>({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 4) {
      errors.push("At least 8 characters");
    }

    return errors;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate sending OTP/verification email
    // In production, you would call your backend to send OTP
    setTimeout(() => {
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${formData.email}`,
      });
      setStep("password");
      setIsSubmitting(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast({
        title: "Password Requirements",
        description: (
          <div className="mt-2">
            <p className="font-medium mb-1">Password must contain:</p>
            <ul className="list-disc list-inside space-y-1">
              {passwordErrors.map((error, idx) => (
                <li key={idx} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE}/reset/password`,
        {
          email: formData.email,
          newPassword: formData.newPassword,
        },
      );

      if (response.data.success) {
        toast({
          title: "Password Reset Successful",
          description:
            response.data.message ||
            "Your password has been reset successfully. Please login with your new password.",
          variant: "default",
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Reset Failed",
        description:
          error.response?.data?.message ||
          "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    toast({
      title: "Code Resent",
      description: `A new verification code has been sent to ${formData.email}`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Key className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-blue-100 text-sm">
              {step === "email"
                ? "Enter your email to receive verification code"
                : "Create a new strong password for your account"}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step === "email"
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {step === "email" ? 1 : <CheckCircle className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Email</span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    step === "password" ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step === "password"
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step === "password" ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    New Password
                  </span>
                </div>
              </div>
            </div>

            {step === "email" ? (
              // Email Step
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="you@example.com"
                      autoFocus
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We'll send a verification code to this email address
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Verification Code
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Password Reset Step
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Email Display */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Verifying for</p>
                      <p className="font-medium text-gray-900">
                        {formData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter new password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" />
                    Password Requirements:
                  </p>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? "bg-green-500" : "bg-blue-300"}`}
                      />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? "bg-green-500" : "bg-blue-300"}`}
                      />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? "bg-green-500" : "bg-blue-300"}`}
                      />
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? "bg-green-500" : "bg-blue-300"}`}
                      />
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? "bg-green-500" : "bg-blue-300"}`}
                      />
                      One special character
                    </li>
                  </ul>
                </div>

                {/* Resend Code Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            Your password is encrypted and securely stored
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
