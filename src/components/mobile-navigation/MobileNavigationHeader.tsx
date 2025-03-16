
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Link2 } from 'lucide-react';

interface MobileNavigationHeaderProps {
  onClose: () => void;
}

const MobileNavigationHeader = ({ onClose }: MobileNavigationHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
        <Link2 className="w-5 h-5 text-primary" />
        <span className="font-bold text-lg">LinkRec</span>
      </Link>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileNavigationHeader;
