import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarLinksProps {
  isAdmin: boolean;
}

const primary = [
  { path: '/', label: 'Home' },
  { path: '/record-entry', label: 'Search' },
  { path: '/data-management', label: 'Clinic records' },
  { path: '/search-sessions', label: 'Sessions' },
];

const more = [
  { group: 'Work', items: [{ path: '/batch-matching', label: 'Batch match' }] },
  { group: 'Insights', items: [{ path: '/analytics', label: 'Analytics' }, { path: '/data-quality', label: 'Data quality' }] },
];

const admin = { group: 'Admin', items: [
  { path: '/clinic-intake', label: 'Clinic intake' },
  { path: '/reports', label: 'Reports & export' },
  { path: '/database', label: 'HDSS database' },
  { path: '/audit-logs', label: 'Audit logs' },
] };

export const NavbarLinks = ({ isAdmin }: NavbarLinksProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const groups = isAdmin ? [...more, admin] : more;
  const moreActive = groups.some(g => g.items.some(i => i.path === pathname));

  const cls = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    }`;

  return (
    <div className="hidden lg:flex items-center gap-1 rounded-full border bg-card/60 p-1">
      {primary.map(item => (
        <Link key={item.path} to={item.path} className={cls(pathname === item.path)}>
          {item.label}
        </Link>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger className={`${cls(moreActive)} flex items-center gap-1 outline-none`}>
          More <ChevronDown className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {groups.map((g, gi) => (
            <div key={g.group}>
              {gi > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">{g.group}</DropdownMenuLabel>
              {g.items.map(i => (
                <DropdownMenuItem key={i.path} onSelect={() => navigate(i.path)}>{i.label}</DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarLinks;
