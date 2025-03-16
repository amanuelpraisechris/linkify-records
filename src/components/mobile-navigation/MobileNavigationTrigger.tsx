
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SheetTrigger } from '@/components/ui/sheet';

const MobileNavigationTrigger = () => {
  return (
    <SheetTrigger asChild className="md:hidden">
      <Button variant="ghost" size="icon" className="mr-2">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
  );
};

export default MobileNavigationTrigger;
