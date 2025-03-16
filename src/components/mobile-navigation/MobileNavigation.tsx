
import { useState } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { MobileNavigationTrigger } from './index';
import { MobileNavigationContent } from './index';

interface MobileNavigationProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const MobileNavigation = ({ isAdmin, isLoggedIn }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <MobileNavigationTrigger />
      <MobileNavigationContent 
        isAdmin={isAdmin} 
        isLoggedIn={isLoggedIn} 
        onClose={handleClose} 
      />
    </Sheet>
  );
};

export default MobileNavigation;
