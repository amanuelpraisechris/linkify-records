
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAdmin, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For admin-only routes
  if (adminOnly && !isAdmin) {
    toast({
      title: "Authentication Required",
      description: "Please login with an admin account to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // For regular protected routes
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please login to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
