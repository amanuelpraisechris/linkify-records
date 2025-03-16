
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Search } from 'lucide-react';

interface MobileNavigationLinksProps {
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileNavigationLinks = ({ isLoggedIn, onClose }: MobileNavigationLinksProps) => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5 mr-3" /> 
    },
    { 
      path: '/data-management',
      label: 'Records',
      icon: <Database className="w-5 h-5 mr-3" />
    },
    { 
      path: '/record-entry',
      label: 'Search',
      icon: <Search className="w-5 h-5 mr-3" />
    }
  ];

  if (!isLoggedIn) return null;

  return (
    <nav className="flex flex-col space-y-1 px-2">
      {navItems.map(item => (
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
    </nav>
  );
};

export default MobileNavigationLinks;
