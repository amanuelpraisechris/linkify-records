
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationFooterProps {
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileNavigationFooter = ({ isLoggedIn, onClose }: MobileNavigationFooterProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/auth');
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4 border-t">
        <Link 
          to="/auth"
          className="flex items-center justify-center w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          onClick={onClose}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border-t">
      <Button 
        variant="outline"
        className="flex items-center justify-center w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default MobileNavigationFooter;
