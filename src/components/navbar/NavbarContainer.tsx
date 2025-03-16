
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

interface NavbarContainerProps {
  children: React.ReactNode;
}

export const NavbarContainer = ({ children }: NavbarContainerProps) => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {children[0]}
            
            <Link to="/" className="flex items-center space-x-2 transition-all hover:opacity-80">
              <Link2 className="w-8 h-8 text-primary" />
              <span className="font-semibold text-xl tracking-tight">LinkRec</span>
            </Link>
          </div>
          
          {children[1]}
          
          <div className="flex items-center space-x-4">
            {children[2]}
            {children[3]}
            {children[4]}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarContainer;
