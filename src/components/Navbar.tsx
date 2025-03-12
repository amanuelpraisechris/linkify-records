
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, Link2, Search, User, Lock, Users, Settings, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Check if user is admin
    const checkAdmin = () => {
      // Check both admin auth from localStorage and profile role from Supabase
      const adminAuth = localStorage.getItem('adminAuth') === 'true';
      const isProfileAdmin = profile?.role === 'admin';
      setIsAdmin(adminAuth || isProfileAdmin);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check admin status initially and when location changes
    checkAdmin();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, location, profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all-medium ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-subtle'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 transition-all-medium hover:opacity-80">
              <Link2 className="w-8 h-8 text-primary" />
              <span className="font-semibold text-xl tracking-tight">LinkRec</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all-medium ${
                location.pathname === '/' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/data-management"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all-medium flex items-center ${
                location.pathname === '/data-management' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground'
              }`}
            >
              <Database className="w-4 h-4 mr-1.5" />
              Records
            </Link>
            <Link
              to="/record-entry"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all-medium flex items-center ${
                location.pathname === '/record-entry' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground'
              }`}
            >
              <Search className="w-4 h-4 mr-1.5" />
              Search
            </Link>
            
            {isAdmin && (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all-medium flex items-center ${
                    location.pathname === '/admin-dashboard' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground'
                  }`}
                >
                  <Lock className="w-4 h-4 mr-1.5" />
                  Admin
                  <Badge className="ml-2 bg-purple-500 text-white text-xs">Admin</Badge>
                </Link>
                <Link
                  to="/matching-configuration"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all-medium flex items-center ${
                    location.pathname === '/matching-configuration' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1.5" />
                  Matching Config
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAdmin && !user ? (
              <Link to="/admin-login">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Lock className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            ) : !isAdmin && user ? (
              <Link to="/admin-login">
                <Button variant="ghost" size="sm">
                  <Lock className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Lock className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}

            {!user ? (
              <Link to="/auth">
                <Button variant="secondary" size="sm" className="flex items-center">
                  <LogIn className="w-5 h-5 mr-1" />
                  <span>Login</span>
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-0 w-9 h-9">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      {user?.email && (
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
