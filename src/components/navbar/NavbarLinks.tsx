
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Search, Lock, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavbarLinksProps {
  isAdmin: boolean;
}

export const NavbarLinks = ({ isAdmin }: NavbarLinksProps) => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> 
    },
    { 
      path: '/data-management',
      label: 'Records',
      icon: <Database className="w-4 h-4 mr-1.5" />
    },
    { 
      path: '/record-entry',
      label: 'Search',
      icon: <Search className="w-4 h-4 mr-1.5" />
    }
  ];

  const adminNavItems = [
    { 
      path: '/admin-dashboard',
      label: 'Admin',
      icon: <Lock className="w-4 h-4 mr-1.5" />
    },
    { 
      path: '/matching-configuration',
      label: 'Matching Config',
      icon: <Settings className="w-4 h-4 mr-1.5" />
    }
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all flex items-center ${
            location.pathname === item.path 
              ? 'bg-primary/10 text-primary' 
              : 'text-foreground'
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      
      {isAdmin && adminNavItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all flex items-center ${
            location.pathname === item.path 
              ? 'bg-primary/10 text-primary' 
              : 'text-foreground'
          }`}
        >
          {item.icon}
          {item.label}
          {item.path === '/admin-dashboard' && (
            <Badge className="ml-2 bg-purple-500 text-white text-xs">Admin</Badge>
          )}
        </Link>
      ))}
    </div>
  );
};

export default NavbarLinks;
