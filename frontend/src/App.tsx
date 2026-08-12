import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ImportStudents from "@/pages/ImportStudents";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import RailwayConcessionDashboard from "./pages/RailwayConcessionDashboard";
import NewConcessionApplication from "./pages/NewConcessionApplication";
import StudentProfile from "./pages/StudentProfile";
import StaffDashboard from "./pages/StaffDashboard";
import StaffRailwayManagement from "./pages/StaffRailwayManagement";
import ApplicationProcessing from "./pages/ApplicationProcessing";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import StaffForgotPassword from "./pages/StaffForgotPassword";
import StaffChatPage from "@/pages/StaffChatPage";
import AdminDashboard from "@/pages/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";
import AdminStudents from "@/pages/AdminStudents";
import AddStudent from "@/pages/AddStudent";
import AdminStaff from "@/pages/AdminStaff";
import AddStaff from "@/pages/AddStaff";
import ImportStaff from "@/pages/ImportStaff";
import AdminApplications from "./pages/AdminApplications";

const queryClient = new QueryClient();
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Index />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="/student/railway"
          element={<RailwayConcessionDashboard />}
        />
        <Route path="/staff/chat" element={<StaffChatPage />} />
        <Route
          path="/student/railway/apply"
          element={<NewConcessionApplication />}
        />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/railway" element={<StaffRailwayManagement />} />
        <Route
          path="/staff/railway/process/:id"
          element={<ApplicationProcessing />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/staff/forgot-password"
          element={<StaffForgotPassword />}
        />
        <Route
          path="/admin/students"
          element={
            <RequireAdmin>
              <AdminStudents />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/students/add"
          element={
            <RequireAdmin>
              <AddStudent />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/students/import"
          element={
            <RequireAdmin>
              <ImportStudents />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <RequireAdmin>
              <AdminStaff />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<NotFound />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/staff/add"
          element={
            <RequireAdmin>
              <AddStaff />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/staff/import"
          element={
            <RequireAdmin>
              <ImportStaff />
            </RequireAdmin>
          }
        />

        <Route path="/admin/applications" element={<AdminApplications />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
