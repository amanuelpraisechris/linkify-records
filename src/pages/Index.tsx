
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { WorldMapDemo } from '@/components/ui/world-map-demo';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { dashboardStats } from '@/utils/mockData';
import { Database, Link2, Search, Filter, FileUp, UserPlus } from 'lucide-react';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = { toast: () => {} };
  const isAdmin = localStorage.getItem('adminAuth') === 'true';

  const { records } = useRecordData();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Navigation cards for main features
  const navigationCards = [
    {
      title: "Manage Records",
      description: "Upload, view, and manage database records",
      icon: <FileUp className="w-5 h-5" />,
      path: "/data-management",
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Patient Search",
      description: "Search and match patient records",
      icon: <Search className="w-5 h-5" />,
      path: "/record-entry",
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    },
    {
      title: "View Reports",
      description: "Analytics and record matching reports",
      icon: <Filter className="w-5 h-5" />,
      path: "/reports",
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    }
  ];

  if (isAdmin) {
    navigationCards.push({
      title: "Admin Dashboard",
      description: "Access admin controls and settings",
      icon: <Database className="w-5 h-5" />,
      path: "/admin-dashboard",
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col items-center text-center mt-10 mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Kisesa DSS-Clinic Record Linkage System</h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Connect and manage patient records with precision and ease
          </p>
          
          <div className="w-full max-w-xl mt-8">
            <SearchBar 
              placeholder="Search by name, ID, or facility..." 
              onSearch={() => {}}
              className="animate-slide-up"
            />
          </div>
          
          <div className="flex gap-4 mt-8">
            <Link 
              to="/data-management" 
              className="flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-all"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Manage Databases
            </Link>
            <Link 
              to="/record-entry" 
              className="flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              New Patient Record
            </Link>
          </div>
        </div>
        
        {/* World Map Demo */}
        <WorldMapDemo />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 my-10">
          <StatCard 
            title="Total Records" 
            value={dashboardStats.totalRecords}
            icon={<Database className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Matched Records" 
            value={dashboardStats.matchedRecords}
            color="success"
            icon={<Link2 className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Pending Matches" 
            value={dashboardStats.pendingMatches}
            color="warning"
            icon={<Filter className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard 
            title="Match Rate" 
            value={dashboardStats.matchRate}
            description="Average success rate"
            color="neutral"
            icon={<Search className="w-5 h-5" />}
            isPercentage
            isLoading={isLoading}
          />
        </div>

        {/* Navigation cards for main features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {navigationCards.map((card, index) => (
            <Link 
              key={index} 
              to={card.path}
              className="block bg-card hover:bg-accent/50 border rounded-xl p-6 transition-all duration-200 hover:shadow-md"
            >
              <div className={`inline-flex p-3 rounded-full ${card.color} mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </Link>
          ))}
        </div>
        
        <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
          <h2 className="text-2xl font-semibold mb-4">About This System</h2>
          <p className="text-muted-foreground mb-4">
            The Kisesa DSS-Clinic Record Linkage System is designed to connect patient records from
            health facilities with demographic surveillance system (DSS) data. This integration enables:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Improved Patient Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Match clinic visits to community records for comprehensive care history.
              </p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Enhanced Data Quality</h3>
              <p className="text-sm text-muted-foreground">
                Reduce duplicate records and improve data accuracy for healthcare research.
              </p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Better Health Outcomes</h3>
              <p className="text-sm text-muted-foreground">
                Enable continuity of care and more informed clinical decision-making.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
