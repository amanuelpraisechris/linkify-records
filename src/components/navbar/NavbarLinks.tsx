
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Building2, Search, Zap, FileText, BarChart3, ShieldCheck, History } from 'lucide-react';

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
      path: '/database',
      label: 'Database',
      icon: <Database className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/data-management',
      label: 'Clinic Records',
      icon: <Building2 className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/record-entry',
      label: 'Search',
      icon: <Search className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/batch-matching',
      label: 'Batch Match',
      icon: <Zap className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/data-quality',
      label: 'Data Quality',
      icon: <ShieldCheck className="w-4 h-4 mr-1.5" />
    },
    {
      path: '/search-sessions',
      label: 'Sessions',
      icon: <History className="w-4 h-4 mr-1.5" />
    }
  ];

  // Admin-only navigation items
  const adminNavItems = isAdmin ? [
    {
      path: '/audit-logs',
      label: 'Audit Logs',
      icon: <FileText className="w-4 h-4 mr-1.5" />
    }
  ] : [];

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
      {adminNavItems.map(item => (
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
