import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Search, FilePlus2, Zap, BarChart3, ShieldCheck, History, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationLinksProps {
  isLoggedIn: boolean;
  onClose: () => void;
}

export const mobileLinkClass = (active: boolean) => cn(
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
  active ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
);

const groups = [
  { title: 'Work', items: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/record-entry', label: 'New record & search', icon: FilePlus2 },
    { path: '/data-management', label: 'Clinic records', icon: Building2 },
    { path: '/database', label: 'HDSS database', icon: Database },
  ]},
  { title: 'Insights', items: [
    { path: '/batch-matching', label: 'Batch match', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/data-quality', label: 'Data quality', icon: ShieldCheck },
    { path: '/search-sessions', label: 'Sessions', icon: History },
  ]},
];

const MobileNavigationLinks = ({ isLoggedIn, onClose }: MobileNavigationLinksProps) => {
  const { pathname } = useLocation();
  if (!isLoggedIn) return null;
  return (
    <nav className="px-3 space-y-5">
      {groups.map(g => (
        <div key={g.title}>
          <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</p>
          {g.items.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className={mobileLinkClass(pathname === path)} onClick={onClose}>
              <Icon className="w-[18px] h-[18px]" />{label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default MobileNavigationLinks;
