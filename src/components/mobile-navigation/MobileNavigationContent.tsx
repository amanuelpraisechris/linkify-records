
import { MobileNavigationHeader } from './index';
import { MobileNavigationLinks } from './index';
import { MobileNavigationAdminLinks } from './index';
import { MobileNavigationFooter } from './index';
import { SheetContent } from '@/components/ui/sheet';

interface MobileNavigationContentProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileNavigationContent = ({ 
  isAdmin, 
  isLoggedIn, 
  onClose 
}: MobileNavigationContentProps) => {
  return (
    <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
      <div className="flex flex-col h-full">
        <MobileNavigationHeader onClose={onClose} />
        
        <div className="flex-1 overflow-auto py-2">
          <MobileNavigationLinks isLoggedIn={isLoggedIn} onClose={onClose} />
          <MobileNavigationAdminLinks isAdmin={isAdmin} onClose={onClose} />
        </div>
        
        <MobileNavigationFooter isLoggedIn={isLoggedIn} onClose={onClose} />
      </div>
    </SheetContent>
  );
};

export default MobileNavigationContent;
