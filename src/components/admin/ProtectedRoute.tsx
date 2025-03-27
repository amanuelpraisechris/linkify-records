
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAdmin, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For admin-only routes: Silently redirect to login page without error
  if (adminOnly) {
    if (!isAdmin) {
      // Pass the current location as state to redirect back after login
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    // Render children if admin
    return <>{children}</>;
  }

  // For regular protected routes: Check user authentication
  if (!user) {
    // Pass the current location as state to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
