
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, UserCog } from 'lucide-react';

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    const storedUsername = localStorage.getItem('adminUsername');
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to access this page',
        variant: 'destructive',
      });
      navigate('/admin-login');
    } else {
      setUsername(storedUsername || 'Admin');
    }
  }, [navigate]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UserCog className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">Welcome, {username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              <Settings className="inline mr-2 h-5 w-5" />
              System Configuration
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              This is the admin dashboard where you can configure matching parameters,
              manage user accounts, and view system logs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="font-medium">Matching Configuration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configure matching algorithms and parameters
                </p>
                <Button className="mt-3" size="sm" onClick={() => navigate('/matching-configuration')}>
                  Configure
                </Button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="font-medium">User Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage system users and permissions
                </p>
                <Button className="mt-3" size="sm" disabled>
                  Manage Users
                </Button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="font-medium">System Logs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View system logs and activity history
                </p>
                <Button className="mt-3" size="sm" disabled>
                  View Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
