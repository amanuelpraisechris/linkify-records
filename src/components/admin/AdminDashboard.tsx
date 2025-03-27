
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Settings, 
  UserCog, 
  FileText, 
  SlidersHorizontal, 
  Users,
  BarChart4,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import ChangePasswordForm from './ChangePasswordForm';
import AlgorithmConfiguration from './AlgorithmConfiguration';
import UserManagement from './UserManagement';
import MatchingConfigAdmin from './MatchingConfigAdmin';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const togglePanel = (panel: string) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md fixed top-16 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage system settings and user accounts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Welcome, {profile?.full_name || 'Admin'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-2xl font-semibold">System Configuration</h2>
            </div>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-3xl">
              Configure matching parameters, algorithm settings, manage user accounts, and view system reports.
              Use the cards below to access different configuration sections.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                    Matching Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure matching algorithms and parameters
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => togglePanel('matching')}
                  >
                    Configure
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                    Algorithm Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure algorithm type, weights, and view performance
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => togglePanel('algorithm')}
                  >
                    Manage Settings
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage system users and permissions
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => togglePanel('users')}
                  >
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                    System Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View system logs and activity history
                  </p>
                  <Button className="w-full" disabled>
                    View Logs
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Match Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View detailed match statistics and reports
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/reports')}
                  >
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
