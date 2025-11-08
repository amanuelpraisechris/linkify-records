
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth"; 
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
import MatchingConfigAdmin from "./components/admin/MatchingConfigAdmin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Reports from "./pages/Reports";
import BatchMatching from "./pages/BatchMatching";
import AuditLogs from "./pages/AuditLogs";
import EnhancedAnalytics from "./pages/EnhancedAnalytics";
import DataQuality from "./pages/DataQuality";
import SetupWizard from "./pages/SetupWizard";
import { GOLD_STANDARD_CONFIG } from "./utils/matchingConfigDefaults";
import React from 'react'; // Explicitly import React

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <MatchingConfigProvider initialConfig={GOLD_STANDARD_CONFIG}>
              <RecordDataProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <div className="flex-1">
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
                        <Route
                          path="/batch-matching"
                          element={
                            <ProtectedRoute>
                              <BatchMatching />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/analytics"
                          element={
                            <ProtectedRoute>
                              <EnhancedAnalytics />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/data-quality"
                          element={
                            <ProtectedRoute>
                              <DataQuality />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/setup"
                          element={<SetupWizard />}
                        />

                        {/* Admin Routes - Require admin login */}
                        <Route
                          path="/audit-logs"
                          element={
                            <ProtectedRoute adminOnly={true}>
                              <AuditLogs />
                            </ProtectedRoute>
                          }
                        />
                        <Route 
                          path="/admin-dashboard" 
                          element={
                            <ProtectedRoute adminOnly={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Add dedicated route for matching configuration */}
                        <Route 
                          path="/matching-configuration" 
                          element={
                            <ProtectedRoute adminOnly={true}>
                              <MatchingConfigAdmin />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </div>
                </BrowserRouter>
              </RecordDataProvider>
            </MatchingConfigProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
