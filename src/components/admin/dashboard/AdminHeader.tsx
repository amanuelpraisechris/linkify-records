
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/admin-login');
  };

  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" />Admin</p>
        <h1 className="text-2xl sm:text-3xl font-semibold mt-1">Welcome, {profile?.full_name?.split(' ')[0] || 'Admin'}</h1>
        <p className="text-sm text-muted-foreground mt-1">Settings, people and reference lists.</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="shrink-0">
        <LogOut className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Exit admin</span>
      </Button>
    </header>
  );
};

export default AdminHeader;
