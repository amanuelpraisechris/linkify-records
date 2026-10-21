import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FilePlus2, Search, Building2, BarChart3, Database, ShieldCheck } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { dashboardStats } from '@/utils/mockData';
import { Link2, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

const shortcuts = [
  { title: 'Clinic records', icon: Building2, path: '/data-management' },
  { title: 'HDSS database', icon: Database, path: '/database' },
  { title: 'Analytics', icon: BarChart3, path: '/analytics' },
  { title: 'Data quality', icon: ShieldCheck, path: '/data-quality' },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">Kilte Awlaelo HDSS · MCH / ANC linkage</p>
        <h1 className="text-3xl sm:text-4xl font-semibold mt-1">
          {firstName ? `Selam, ${firstName}` : 'Welcome to LinkRec'}
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/record-entry"
          className="group flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15">
            <FilePlus2 className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold">New clinic record</span>
            <span className="block text-sm opacity-80">Consent, details, then find matches</span>
          </span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link to="/record-entry"
          className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Search className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold">Search HDSS</span>
            <span className="block text-sm text-muted-foreground">Look up a person in the community data</span>
          </span>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total records" value={dashboardStats.totalRecords} icon={<Database className="w-5 h-5" />} isLoading={isLoading} />
        <StatCard title="Matched" value={dashboardStats.matchedRecords} color="success" icon={<Link2 className="w-5 h-5" />} isLoading={isLoading} />
        <StatCard title="Needs review" value={dashboardStats.pendingMatches} color="warning" icon={<Filter className="w-5 h-5" />} isLoading={isLoading} />
        <StatCard title="Match rate" value={dashboardStats.matchRate} color="neutral" icon={<Search className="w-5 h-5" />} isPercentage isLoading={isLoading} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Go to</h2>
        <div className="rounded-xl border bg-card shadow-soft divide-y overflow-hidden">
          {shortcuts.map(({ title, icon: Icon, path }) => (
            <Link key={path} to={path} className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
              <span className="flex-1 font-medium">{title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <Dialog>
        <DialogTrigger className="text-sm text-muted-foreground underline-offset-4 hover:underline">About this system</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About LinkRec</DialogTitle>
            <DialogDescription>
              LinkRec connects MCH and ANC clinic records with HDSS community records, so each mother and child's
              care history can be followed across clinic visits and the surveillance census. It is benchmarked on
              the PIRL record linkage software.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Index;
