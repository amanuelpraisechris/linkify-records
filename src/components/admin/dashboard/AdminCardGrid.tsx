
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Users, BarChart4, FileText, MapPin } from 'lucide-react';
import AdminCard from './AdminCard';

interface AdminCardGridProps {
  onTogglePanel: (panel: string) => void;
  activePanel?: string | null;
}

const AdminCardGrid = ({ onTogglePanel, activePanel }: AdminCardGridProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-xl border bg-card shadow-soft divide-y overflow-hidden">
      <AdminCard
        title="Matching Configuration"
        description="Configure matching algorithms and parameters"
        icon={SlidersHorizontal}
        buttonText="Configure"
        onClick={() => onTogglePanel('matching')}
        active={activePanel === 'matching'}
      />
      
      <AdminCard
        title="Algorithm Settings"
        description="Configure algorithm type, weights, and view performance"
        icon={SlidersHorizontal}
        buttonText="Manage Settings"
        onClick={() => onTogglePanel('algorithm')}
        active={activePanel === 'algorithm'}
      />
      
      <AdminCard
        title="Locations & Facilities"
        description="Add or approve health facilities, tabias and kushets"
        icon={MapPin}
        buttonText="Manage Lists"
        onClick={() => navigate('/locations')}
      />

      <AdminCard
        title="User Management"
        description="Manage system users and permissions"
        icon={Users}
        buttonText="Manage Users"
        onClick={() => onTogglePanel('users')}
        active={activePanel === 'users'}
      />
      
      <AdminCard
        title="System Logs"
        description="View system logs and activity history"
        icon={BarChart4}
        buttonText="View Logs"
        onClick={() => {}}
        disabled={true}
      />

      <AdminCard
        title="Match Reports"
        description="View detailed match statistics and reports"
        icon={FileText}
        buttonText="View Reports"
        onClick={() => navigate('/reports')}
      />
    </div>
  );
};

export default AdminCardGrid;
