
import { Link } from 'react-router-dom';
import { FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NavbarNewRecordButton = () => {
  return (
    <Link to="/record-entry" className="hidden sm:flex">
      <Button variant="outline" size="sm" className="flex items-center">
        <FilePlus2 className="w-4 h-4 mr-1.5" />
        <span>New Record</span>
      </Button>
    </Link>
  );
};

export default NavbarNewRecordButton;
