
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RecordDataProvider } from "@/contexts/record-data/RecordDataContext";
import { MatchingConfigProvider } from "@/contexts/MatchingConfigContext";
import { Navbar } from "@/components/navbar";
import Index from "./pages/Index";
import DataManagement from "./pages/DataManagement";
import RecordEntry from "./pages/RecordEntry";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Reports from "./pages/Reports";

// Create a new QueryClient with default error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <MatchingConfigProvider>
          <RecordDataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <Routes>
                {/* Public Routes - Accessible without login */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                
                {/* Protected Routes - Require login */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/data-management" 
                  element={
                    <ProtectedRoute>
                      <DataManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/record-entry" 
                  element={
                    <ProtectedRoute>
                      <RecordEntry />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes - Require admin login */}
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirect old matching-configuration path to admin dashboard */}
                <Route 
                  path="/matching-configuration" 
                  element={<Navigate to="/admin-dashboard" replace />} 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RecordDataProvider>
        </MatchingConfigProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
