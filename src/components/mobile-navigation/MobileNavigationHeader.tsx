import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

interface MobileNavigationHeaderProps {
  onClose: () => void;
}

// The sheet supplies its own close button, so only the brand lives here.
const MobileNavigationHeader = ({ onClose }: MobileNavigationHeaderProps) => (
  <div className="flex items-center h-16 px-5 border-b">
    <Link to="/" className="flex items-center gap-2" onClick={onClose}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Link2 className="w-4 h-4" />
      </span>
      <span className="font-display font-semibold text-lg">LinkRec</span>
    </Link>
  </div>
);

export default MobileNavigationHeader;
