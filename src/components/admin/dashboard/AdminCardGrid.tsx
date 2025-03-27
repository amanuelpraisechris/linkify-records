
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Users, BarChart4, FileText } from 'lucide-react';
import AdminCard from './AdminCard';

interface AdminCardGridProps {
  onTogglePanel: (panel: string) => void;
}

const AdminCardGrid = ({ onTogglePanel }: AdminCardGridProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <AdminCard
        title="Matching Configuration"
        description="Configure matching algorithms and parameters"
        icon={SlidersHorizontal}
        buttonText="Configure"
        onClick={() => onTogglePanel('matching')}
      />
      
      <AdminCard
        title="Algorithm Settings"
        description="Configure algorithm type, weights, and view performance"
        icon={SlidersHorizontal}
        buttonText="Manage Settings"
        onClick={() => onTogglePanel('algorithm')}
      />
      
      <AdminCard
        title="User Management"
        description="Manage system users and permissions"
        icon={Users}
        buttonText="Manage Users"
        onClick={() => onTogglePanel('users')}
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
