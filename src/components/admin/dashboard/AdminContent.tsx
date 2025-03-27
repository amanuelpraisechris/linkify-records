
import { useState } from 'react';
import AdminCardGrid from './AdminCardGrid';
import MatchingConfigAdmin from '../MatchingConfigAdmin';
import AlgorithmConfiguration from '../algorithm-config';
import UserManagement from '../UserManagement';
import ChangePasswordForm from '../ChangePasswordForm';
import { Settings, SlidersHorizontal, Users, UserCog } from 'lucide-react';

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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-3 text-primary" />
        <h2 className="text-2xl font-semibold">System Configuration</h2>
      </div>
      
      <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-3xl">
        Configure matching parameters, algorithm settings, manage user accounts, and view system reports.
        Use the cards below to access different configuration sections.
      </p>
      
      <AdminCardGrid onTogglePanel={togglePanel} />

      {/* Matching Configuration Section */}
      {activePanel === 'matching' && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
            Matching Configuration
          </h3>
          <MatchingConfigAdmin />
        </div>
      )}
      
      {/* Algorithm Configuration Section */}
      {activePanel === 'algorithm' && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
            Algorithm Configuration
          </h3>
          <AlgorithmConfiguration />
        </div>
      )}

      {/* User Management Section */}
      {activePanel === 'users' && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            User Management
          </h3>
          <UserManagement />
        </div>
      )}

      {/* Password Change Form */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <UserCog className="h-5 w-5 mr-2 text-primary" />
          Admin Settings
        </h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default AdminContent;
