
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Link2, Search, User, Lock, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Check if user is admin
    const checkAdmin = () => {
      const adminAuth = localStorage.getItem('adminAuth') === 'true';
      setIsAdmin(adminAuth);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check admin status initially and when location changes
    checkAdmin();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, location]);

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
            {!isAdmin ? (
              <Link
                to="/admin-login"
                className="p-2 rounded-full text-foreground hover:bg-secondary transition-all-medium"
                aria-label="Admin login"
              >
                <Lock className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-full text-primary hover:bg-secondary transition-all-medium flex items-center"
                aria-label="Admin dashboard"
              >
                <Lock className="w-5 h-5" />
                <span className="ml-1 text-xs font-medium hidden sm:inline">Admin</span>
              </Link>
            )}
            <button
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-all-medium"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
