
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    // Check authentication status
    const authenticated = !!user;
    setIsAuthenticated(authenticated);
    
    // Check if user is admin
    const adminAuth = localStorage.getItem('adminAuth') === 'true';
    const isProfileAdmin = profile?.role === 'admin';
    setIsAdmin(adminAuth || isProfileAdmin);
  }, [user, profile]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin access if adminOnly is true
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
