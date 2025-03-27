
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth'; // Updated import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const NavbarRoleSwitch = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleAdminAccess = () => {
    if (isAdmin) {
      // Already in admin mode, navigate to admin dashboard
      navigate('/admin-dashboard');
    } else {
      // Switch to admin mode by navigating to login
      navigate('/admin-login');
    }
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      // Switch to user mode
      localStorage.removeItem('adminAuth');
      toast({
        title: "User mode activated",
        description: "You are now browsing as a regular user",
      });
      navigate('/');
    } else {
      // Redirect to admin login
      navigate('/admin-login');
    }
  };

  // Always show the toggle when on admin login page
  const isAdminLoginPage = location.pathname === '/admin-login';
  
  if (!user && !isAdminLoginPage) {
    return null; // Don't show role switcher if user is not logged in and not on admin login
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {isAdmin ? (
            <Shield className="h-4 w-4 text-purple-500" />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'User'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2 text-sm font-medium">
          {isAdmin ? 'Admin Actions' : 'Switch Role'}
        </div>
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/matching-configuration')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Matching Configuration</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={toggleAdminMode}>
          {isAdmin ? (
            <>
              <User className="mr-2 h-4 w-4" />
              <span>Switch to User Mode</span>
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              <span>Switch to Admin Mode</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarRoleSwitch;
