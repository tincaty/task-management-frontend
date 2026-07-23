import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";

// Schema for user registration matching backend requirements
const applicationSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required").max(100),
    lastName: z.string().trim().min(2, "Last name is required").max(100),
    DateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    phone: z.string().trim().min(5, "Phone number is required").max(30),
    email: z.string().trim().email("Valid email required").max(255),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    courseName: z.string().min(1, "Please select a course"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  selectedCourse?: string;
}

// Available courses - update these to match your actual programs
const availableCourses = [
  { value: "Computer Science", label: "B.Tech Computer Science" },
  { value: "Business Administration", label: "MBA Business Administration" },
  { value: "Product Design", label: "B.Des Product Design" },
  { value: "Engineering", label: "B.Tech Engineering" },
  { value: "Healthcare Sciences", label: "Healthcare Sciences" },
  { value: "Data Science", label: "M.Sc Data Science" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Digital Marketing", label: "Digital Marketing" },
];

const ApplicationForm = ({ selectedCourse }: ApplicationFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      courseName: selectedCourse || "",
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // Remove confirmPassword before sending to API (backend doesn't need it)
      const { confirmPassword, ...submitData } = data;

      // Format the data to match backend expectations
      const apiData = {
        firstName: submitData.firstName,
        lastName: submitData.lastName,
        DateOfBirth: submitData.DateOfBirth,
        gender:
          submitData.gender.charAt(0).toUpperCase() +
          submitData.gender.slice(1), // Capitalize first letter to match enum
        phone: submitData.phone,
        email: submitData.email,
        password: submitData.password,
        courseName: [submitData.courseName], // Backend expects an array
      };

      // Make API call to your backend create user endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE}/create/user`,
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSubmitted(true);
        toast({
          title: "Account Created Successfully!",
          description:
            response.data.message ||
            "Your account has been created. Our admissions team will contact you within 24 hours.",
        });
        reset();
      } else {
        throw new Error(response.data.message || "Failed to create account");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to create account. Please try again.";

      if (error.response) {
        // Server responded with error
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage =
            "Invalid information provided. Please check your details.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Application Received!
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for applying to Tumaini Jipya Admission System. Your account
          has been created successfully. Our admissions team will review your
          application and contact you within 24 hours with next steps.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {selectedCourse && (
        <input
          type="hidden"
          value={selectedCourse}
          {...register("courseName")}
        />
      )}

      {selectedCourse && (
        <div className="rounded-md bg-blue-50 p-3 text-sm border border-blue-200">
          <span className="text-gray-600">Selected Program:</span>{" "}
          <strong className="text-blue-700">
            {availableCourses.find((c) => c.value === selectedCourse)?.label ||
              selectedCourse}
          </strong>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="Your first name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Your last name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="DateOfBirth">Date of Birth *</Label>
          <Input id="DateOfBirth" type="date" {...register("DateOfBirth")} />
          {errors.DateOfBirth && (
            <p className="text-red-500 text-xs">{errors.DateOfBirth.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <select
            id="gender"
            {...register("gender")}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs">{errors.gender.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+255 123 456 789"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Course Selection */}
        <div className="space-y-2">
          <Label htmlFor="courseName">Select Program *</Label>
          <select
            id="courseName"
            {...register("courseName")}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!selectedCourse}
          >
            <option value="">Select a program</option>
            {availableCourses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
          {errors.courseName && (
            <p className="text-red-500 text-xs">{errors.courseName.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register("password")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
        size="lg"
        disabled={isSubmitting}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting
          ? "Creating Account..."
          : "Create Account & Submit Application"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this application, you agree to our terms and conditions
        and privacy policy. Your information is secure and will only be used for
        admission purposes.
      </p>
    </form>
  );
};

export default ApplicationForm;
