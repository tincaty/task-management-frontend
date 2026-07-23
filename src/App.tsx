import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AdminProvider } from "@/contexts/AdminContext";

import { ScrollToTop } from "./components/ScrollToTop";
import PublicLayout from "../src/components/layouts/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import ManagerDashboard from "./pages/reporter/ManagerDashboard";

import ForgotPassword from "./pages/ForgotPassword";

import RegisterComponent from "./pages/RegisterComponent";
import Index from "./pages/Index";

import NotFound from "./pages/NotFound";
import TaskManagement from "./pages/admin/TaskManagement";
import EmployeeDashboard from "./pages/operator/EmployeeDashboard";
import EmployeeLayout from "./components/admin/EmployeeLayout";
import EmployeeTasks from "./pages/operator/EmployeeTasks";
import ManagerLayout from "./components/admin/ ManagerLayout";
import ManagerTasks from "./pages/reporter/ManagerTasks";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AdminProvider>
          <BrowserRouter>
            <ScrollToTop />

            <Routes>
              {/* PUBLIC WEBSITE */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="login" element={<AdminLogin />} />
                <Route path="register" element={<RegisterComponent />} />
              </Route>

              <Route path="/user/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="task" element={<TaskManagement />} />

                {/**<Route path="comment" element={<AdminCommentIncidentViewer />} /> **/}
              </Route>

              <Route path="/user/manager" element={<ManagerLayout />}>
                <Route index element={<ManagerDashboard />} />
                <Route path="task" element={<ManagerTasks />} />
              </Route>
              <Route path="/user/employee" element={<EmployeeLayout />}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="task" element={<EmployeeTasks />} />
              </Route>
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
