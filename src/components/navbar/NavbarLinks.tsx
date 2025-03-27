
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Search } from 'lucide-react';

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
    </div>
  );
};

export default NavbarLinks;
