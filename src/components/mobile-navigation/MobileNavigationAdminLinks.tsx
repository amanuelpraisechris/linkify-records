
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MobileNavigationAdminLinksProps {
  isAdmin: boolean;
  onClose: () => void;
}

const MobileNavigationAdminLinks = ({ isAdmin, onClose }: MobileNavigationAdminLinksProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const adminNavItems = [
    { 
      path: '/admin-dashboard',
      label: 'Admin Dashboard',
      icon: <Lock className="w-5 h-5 mr-3" />
    },
    { 
      path: '/matching-configuration',
      label: 'Matching Configuration',
      icon: <Settings className="w-5 h-5 mr-3" />
    }
  ];

  const handleAdminClick = () => {
    onClose();
    // Always navigate to admin login if not admin
    navigate('/admin-login');
  };

  if (isAdmin) {
    return (
      <>
        <div className="mt-6 mb-2 px-3">
          <Badge variant="outline" className="w-full justify-center py-1 bg-secondary/50">
            Admin
          </Badge>
        </div>
        
        {adminNavItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
              location.pathname === item.path 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:bg-secondary/80'
            }`}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-3 py-3 mt-2"
      onClick={handleAdminClick}
    >
      <Lock className="w-5 h-5 mr-3" />
      Admin Login
    </Button>
  );
};

export default MobileNavigationAdminLinks;
