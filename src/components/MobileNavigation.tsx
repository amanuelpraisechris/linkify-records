
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutDashboard, Database, Search, Lock, Settings, LogIn, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const MobileNavigation = ({ isAdmin, isLoggedIn }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
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

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    navigate('/auth');
  };

  const handleAdminClick = () => {
    setOpen(false);
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/admin-login');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <span className="font-bold text-lg">LinkRec</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            <nav className="flex flex-col space-y-1 px-2">
              {isLoggedIn && navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground hover:bg-secondary/80'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              {isAdmin && (
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
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
              
              {!isAdmin && (
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-3 mt-2"
                  onClick={handleAdminClick}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Admin Login
                </Button>
              )}
            </nav>
          </div>
          
          {!isLoggedIn ? (
            <div className="p-4 border-t">
              <Link 
                to="/auth"
                className="flex items-center justify-center w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </div>
          ) : (
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
