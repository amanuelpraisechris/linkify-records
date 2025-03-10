
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Link2, Search, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDemo = () => {
    toast({
      title: "Demo Feature",
      description: "This feature would be implemented in a full version.",
      duration: 3000,
    });
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
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-all-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={handleDemo}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-all-medium flex items-center"
            >
              <Database className="w-4 h-4 mr-1.5" />
              Records
            </button>
            <button
              onClick={handleDemo}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-all-medium flex items-center"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Search
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDemo}
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
