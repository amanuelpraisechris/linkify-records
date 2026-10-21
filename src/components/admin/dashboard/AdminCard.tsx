import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

const AdminCard = ({ title, description, icon: Icon, onClick, disabled = false, active = false }: AdminCardProps) => (
  <button type="button" onClick={onClick} disabled={disabled}
    className={cn('w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 disabled:opacity-50 disabled:pointer-events-none',
      active && 'bg-accent')}>
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
      <Icon className="h-5 w-5" />
    </span>
    <span className="flex-1 min-w-0">
      <span className="block font-medium">{title}{disabled && <span className="ml-2 text-xs text-muted-foreground">Coming soon</span>}</span>
      <span className="block text-sm text-muted-foreground truncate">{description}</span>
    </span>
    <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', active && 'rotate-90')} />
  </button>
);

export default AdminCard;
