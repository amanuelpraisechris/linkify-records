import MatchingConfigAdmin from '@/components/admin/MatchingConfigAdmin';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Info } from 'lucide-react';

const MatchingConfiguration = () => (
  <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
    <header>
      <h1 className="text-2xl sm:text-3xl font-semibold">Matching settings</h1>
      <p className="text-sm text-muted-foreground mt-1">How strictly clinic records are matched to HDSS records.</p>
    </header>
    <div className="flex gap-3 rounded-xl bg-accent p-4 text-sm text-accent-foreground">
      <Info className="h-4 w-4 mt-0.5 shrink-0" />
      <p>The recommended setting is <strong>Probabilistic</strong>: it weighs how often each detail agrees between true matches, so small spelling differences don't block a match.</p>
    </div>
    <MatchingConfigProvider>
      <MatchingConfigAdmin />
    </MatchingConfigProvider>
  </main>
);

export default MatchingConfiguration;
