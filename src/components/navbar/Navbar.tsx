
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavbarContainer from './NavbarContainer';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarAdminButton from './NavbarAdminButton';
import NavbarNewRecordButton from './NavbarNewRecordButton';
import NavbarRoleSwitch from './NavbarRoleSwitch';
import { MobileNavigation } from '@/components/mobile-navigation';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    const checkAdmin = () => {
      const adminAuth = localStorage.getItem('adminAuth') === 'true';
      const isProfileAdmin = profile?.role === 'admin';
      setIsAdmin(adminAuth || isProfileAdmin);
    };
    
    checkAdmin();
  }, [location, profile]);

  return (
    <NavbarContainer>
      <MobileNavigation isAdmin={isAdmin} isLoggedIn={!!user} />
      <NavbarLinks isAdmin={isAdmin} />
      <div className="flex items-center gap-2">
        {user && <NavbarNewRecordButton />}
        {user && <NavbarRoleSwitch />}
        <NavbarAdminButton isAdmin={isAdmin} />
        <NavbarUserMenu />
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
