
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

interface NavbarAdminButtonProps {
  isAdmin: boolean;
}

export const NavbarAdminButton = ({ isAdmin }: NavbarAdminButtonProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      // Always navigate to admin login
      navigate('/admin-login');
    }
  };

  return (
    <Button 
      variant={isAdmin ? "default" : "ghost"} 
      size="sm" 
      className={`flex items-center ${isAdmin ? 'text-primary-foreground bg-primary' : ''}`}
      onClick={handleAdminClick}
    >
      <Lock className="w-4 h-4 mr-1.5" />
      <span className="hidden sm:inline">Admin</span>
    </Button>
  );
};

export default NavbarAdminButton;
