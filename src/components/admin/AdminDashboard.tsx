
import { AdminHeader, AdminContent } from './dashboard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <AdminHeader />
      
      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8">
          <AdminContent />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
