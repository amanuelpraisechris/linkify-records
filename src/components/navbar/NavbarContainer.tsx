import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

interface NavbarContainerProps {
  children: React.ReactNode;
}

export const NavbarContainer = ({ children }: NavbarContainerProps) => {
  const parts = children as React.ReactNode[];
  return (
    <nav className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center min-w-0">
            {parts[0]}
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Link2 className="w-4 h-4" />
              </span>
              <span className="font-display font-semibold text-lg tracking-tight">LinkRec</span>
            </Link>
          </div>
          {parts[1]}
          <div className="flex items-center gap-2">{parts[2]}</div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarContainer;
