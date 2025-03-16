
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

  // For admin-only routes: Check admin access
  if (adminOnly) {
    // Check localStorage for admin auth
    const adminAuth = localStorage.getItem('adminAuth') === 'true';
    // Check if user has admin role in profile
    const isProfileAdmin = profile?.role === 'admin';
    
    if (!adminAuth && !isProfileAdmin) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    // Render children if admin
    return <>{children}</>;
  }

  // For regular protected routes: Check user authentication
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
