import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
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

const queryClient = new QueryClient();

/* 🔹 This component handles animated routes */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/railway" element={<RailwayConcessionDashboard />} />
        <Route path="/student/railway/apply" element={<NewConcessionApplication />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/railway" element={<StaffRailwayManagement />} />
        <Route path="/staff/railway/process/:id" element={<ApplicationProcessing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/staff/forgot-password" element={<StaffForgotPassword />} />
        <Route path="*" element={<NotFound />} />
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
