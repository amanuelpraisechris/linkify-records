
import { useState } from 'react';
import AdminCardGrid from './AdminCardGrid';
import MatchingConfigAdmin from '../MatchingConfigAdmin';
import AlgorithmConfiguration from '../algorithm-config';
import UserManagement from '../UserManagement';
import { SlidersHorizontal, Users } from 'lucide-react';

const AdminContent = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const togglePanel = (panel: string) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  return (
    <div className="space-y-6">
      <AdminCardGrid onTogglePanel={togglePanel} activePanel={activePanel} />

      {/* Matching Configuration Section */}
      {activePanel === 'matching' && (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-soft">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
            Matching Configuration
          </h3>
          <MatchingConfigAdmin />
        </div>
      )}
      
      {/* Algorithm Configuration Section */}
      {activePanel === 'algorithm' && (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-soft">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
            Algorithm Configuration
          </h3>
          <AlgorithmConfiguration />
        </div>
      )}

      {/* User Management Section */}
      {activePanel === 'users' && (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-soft">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            User Management
          </h3>
          <UserManagement />
        </div>
      )}

    </div>
  );
};

export default AdminContent;
