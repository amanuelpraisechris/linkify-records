import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ClipboardList } from 'lucide-react';
import { loadDecisionHistory, type MatchDecisionEntry } from '@/services/matchDecisionHistory';

export default function DecisionHistory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MatchDecisionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setEntries([]);
    if (!user) return;
    setLoading(true);
    setError(false);
    loadDecisionHistory().then(data => {
      if (!cancelled) { setEntries(data); setHasMore(data.length === 50); }
    }).catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, refresh]);

  const loadMore = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await loadDecisionHistory(entries.length);
      setEntries(previous => [...previous, ...data]);
      setHasMore(data.length === 50);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  return <section className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-xl font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5" />Decision History</h3>
      <Button variant="outline" size="icon" aria-label="Refresh decision history" title="Refresh decision history" disabled={loading || !user} onClick={() => setRefresh(value => value + 1)}><RefreshCw className="h-4 w-4" /></Button>
    </div>
    {!user ? <p className="text-muted-foreground">Sign in to view your saved decisions.</p> : <>
      {error && <p role="alert" className="text-destructive">Could not load decision history. Please retry.</p>}
      {loading && <p role="status" className="text-muted-foreground">Loading decisions…</p>}
      {!loading && !error && entries.length === 0 && <p className="text-muted-foreground py-6">No saved decisions yet.</p>}
      <div className="space-y-3">{entries.map(entry => <article key={entry.id} className="border border-border rounded-lg p-4 space-y-2 bg-card">
        <div className="flex flex-wrap justify-between gap-2">
          <Badge variant="outline" className={entry.decision === 'confirmed' ? 'text-success border-success/40' : entry.decision === 'review' ? 'text-warning border-warning/40' : 'text-destructive border-destructive/40'}>
            {entry.decision === 'confirmed' ? 'Match confirmed' : entry.decision === 'no-match' ? 'No match' : 'Sent for review'}
          </Badge>
          <time className="text-sm text-muted-foreground" dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
        </div>
        <p className="font-medium break-words">{entry.collector_name}</p>
        <p className="text-sm text-muted-foreground break-all">Collector ID: {entry.user_id}</p>
        <p className="text-sm break-all">Source: {entry.source_id}{entry.candidate_id && ` · Candidate: ${entry.candidate_id}`}</p>
        {entry.reason && <p className="text-sm whitespace-pre-wrap break-words"><span className="font-medium">Reason: </span>{entry.reason}</p>}
      </article>)}</div>
      {hasMore && <Button variant="outline" disabled={loading} onClick={loadMore}>Load older decisions</Button>}
    </>}
  </section>;
}