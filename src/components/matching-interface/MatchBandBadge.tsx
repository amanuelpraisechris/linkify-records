import { CheckCircle2, Eye, XCircle } from 'lucide-react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { bandScore, MatchBand } from '@/utils/matching/probabilistic';

const STYLES: Record<MatchBand, { label: string; cls: string; Icon: typeof Eye }> = {
  high: { label: 'High confidence', cls: 'bg-success/15 text-success border-success/30', Icon: CheckCircle2 },
  review: { label: 'Needs review', cls: 'bg-warning/15 text-warning border-warning/30', Icon: Eye },
  'no-match': { label: 'No match', cls: 'bg-destructive/10 text-destructive border-destructive/30', Icon: XCircle },
};

export const useMatchBand = () => {
  const { config } = useMatchingConfig();
  return (score: number): MatchBand =>
    bandScore(score, { high: config.threshold.high, low: config.threshold.low });
};

const MatchBandBadge = ({ score }: { score: number }) => {
  const band = useMatchBand()(score);
  const { label, cls, Icon } = STYLES[band];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${cls}`}>
      <Icon className="h-4 w-4" />
      {label} · {score}%
    </span>
  );
};

export default MatchBandBadge;
