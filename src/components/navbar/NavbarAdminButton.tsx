
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarAdminButtonProps {
  isAdmin: boolean;
}

export const NavbarAdminButton = ({ isAdmin }: NavbarAdminButtonProps) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
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
      <Lock className="w-5 h-5 mr-1" />
      <span className="hidden sm:inline">Admin</span>
    </Button>
  );
};

export default NavbarAdminButton;
