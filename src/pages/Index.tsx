
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';
import RecordList from '@/components/RecordList';
import MatchingInterface from '@/components/MatchingInterface';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { useToast } from '@/components/ui/use-toast';
import { dashboardStats, exampleRecords, recordMatches, newRecords } from '@/utils/mockData';
import { Database, Link2, Search, Filter, FileUp, UserPlus, PanelRight, Settings, LogIn } from 'lucide-react';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matching' | 'records'>('matching');
  const { toast } = useToast();
  const isAdmin = localStorage.getItem('adminAuth') === 'true';

  const { records } = useRecordData();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      toast({
        title: "Search Initiated",
        description: `Searching for "${query}"`,
        duration: 3000,
      });
    }
  };

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
      title: "Admin Dashboard",
      description: "Access admin controls and settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin-dashboard",
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      adminOnly: true
    },
    {
      title: "View Reports",
      description: "Analytics and record matching reports",
      icon: <PanelRight className="w-5 h-5" />,
      path: "/reports",
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col items-center text-center my-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Record Linkage System</h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Connect and manage patient records with precision and ease
          </p>
          
          <div className="w-full max-w-xl mt-8">
            <SearchBar 
              placeholder="Search by name, ID, or facility..." 
              onSearch={handleSearch}
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
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
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
          {navigationCards
            .filter(card => !card.adminOnly || isAdmin)
            .map((card, index) => (
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
        
        <div className="bg-white dark:bg-black border rounded-xl shadow-card overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('matching')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'matching'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                } transition-all`}
              >
                Record Matching
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'records'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                } transition-all`}
              >
                All Records
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'matching' ? (
              <MatchingConfigProvider>
                <MatchingInterface 
                  matchData={recordMatches}
                  onMatchComplete={(result) => {
                    console.log("Match result:", result);
                  }}
                />
              </MatchingConfigProvider>
            ) : (
              <RecordList 
                records={exampleRecords} 
                title="Database Records"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
