import { Link, useLocation } from 'react-router-dom';
import { Shield, SlidersHorizontal, MapPin, FileText, Lock, Database } from 'lucide-react';
import { mobileLinkClass } from './MobileNavigationLinks';

interface MobileNavigationAdminLinksProps {
  isAdmin: boolean;
  onClose: () => void;
}

const items = [
  { path: '/admin-dashboard', label: 'Admin dashboard', icon: Shield },
  { path: '/matching-configuration', label: 'Matching settings', icon: SlidersHorizontal },
  { path: '/database', label: 'HDSS database', icon: Database },
  { path: '/locations', label: 'Locations & facilities', icon: MapPin },
  { path: '/audit-logs', label: 'Audit logs', icon: FileText },
];

const MobileNavigationAdminLinks = ({ isAdmin, onClose }: MobileNavigationAdminLinksProps) => {
  const { pathname } = useLocation();
  return (
    <div className="px-3 mt-5">
      <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
      {isAdmin ? items.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path} className={mobileLinkClass(pathname === path)} onClick={onClose}>
          <Icon className="w-[18px] h-[18px]" />{label}
        </Link>
      )) : (
        <Link to="/admin-login" className={mobileLinkClass(false)} onClick={onClose}>
          <Lock className="w-[18px] h-[18px]" />Admin sign in
        </Link>
      )}
    </div>
  );
};

export default MobileNavigationAdminLinks;
