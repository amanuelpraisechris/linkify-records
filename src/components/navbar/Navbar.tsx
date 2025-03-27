
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; // Updated import path
import NavbarContainer from './NavbarContainer';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
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

  // Don't hide navbar on admin-login page
  const isAdminLoginPage = location.pathname === '/admin-login';
  
  return (
    <NavbarContainer>
      <MobileNavigation isAdmin={isAdmin} isLoggedIn={!!user} />
      <NavbarLinks isAdmin={isAdmin} />
      <div className="flex items-center gap-2">
        {user && <NavbarNewRecordButton />}
        {(user || isAdminLoginPage) && <NavbarRoleSwitch />}
        <NavbarUserMenu />
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
