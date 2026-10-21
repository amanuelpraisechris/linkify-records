import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Printer, RefreshCw } from 'lucide-react';
import { loadReportData, logExport, ReportData } from '@/services/reportsService';
import {
  ageGroup, bandCounts, collectorActivity, completeness, fieldAgreement, histogram,
  matchExportRows, pseudoId, rateBy, summarize, toCSV, latestByRecord,
  cascade, repeatRate, rankDistribution, scoreByDecision, idCompleteness, recentMovers,
} from '@/utils/reportMetrics';

const ALL = '__all';

const download = (csv: string, name: string) => {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

const Stat = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div className="rounded-xl border bg-card p-4 shadow-soft">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const RateTable = ({ title, rows }: { title: string; rows: { group: string; n: number; matched: number; rate: number }[] }) => (
  <Card className="break-inside-avoid">
    <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
    <CardContent className="space-y-2">
      {rows.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
      {rows.map(r => (
        <div key={r.group} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm">
          <div>
            <div className="flex justify-between"><span>{r.group}</span><span className="text-muted-foreground">{r.matched}/{r.n}</span></div>
            <Progress value={r.rate} className="h-1.5" />
          </div>
          <span className="w-12 text-right font-medium">{r.rate}%</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const Reports = () => {
  const { toast } = useToast();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [facility, setFacility] = useState(ALL);
  const [tabia, setTabia] = useState(ALL);
  const [deidentify, setDeidentify] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setData(await loadReportData(from || undefined, to || undefined)); }
    catch (e) { console.error(e); toast({ title: 'Could not load reports', variant: 'destructive' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const facilities = useMemo(() => [...new Set((data?.clinic ?? []).map(c => c.health_facility).filter(Boolean) as string[])].sort(), [data]);
  const tabias = useMemo(() => [...new Set((data?.clinic ?? []).map(c => c.tabia || c.village).filter(Boolean) as string[])].sort(), [data]);

  const filtered = useMemo(() => {
    if (!data) return null;
    const clinic = data.clinic.filter(c => (facility === ALL || c.health_facility === facility) && (tabia === ALL || (c.tabia || c.village) === tabia));
    const ids = new Set(clinic.flatMap(c => [c.id, c.patient_id].filter(Boolean) as string[]));
    const narrowed = facility !== ALL || tabia !== ALL;
    const matches = narrowed ? data.matches.filter(m => ids.has(m.source_id)) : data.matches;
    const history = narrowed ? data.history.filter(h => ids.has(h.source_id)) : data.history;
    return { clinic, matches, history };
  }, [data, facility, tabia]);

  const m = useMemo(() => {
    if (!filtered) return null;
    const latest = [...latestByRecord(filtered.matches).values()];
    return {
      s: summarize(filtered.clinic, filtered.matches),
      bands: bandCounts(latest), hist: histogram(latest), fields: fieldAgreement(latest),
      bySex: rateBy(filtered.clinic, filtered.matches, c => c.sex || ''),
      byAge: rateBy(filtered.clinic, filtered.matches, c => ageGroup(c.birth_date)),
      byTabia: rateBy(filtered.clinic, filtered.matches, c => c.tabia || c.village || ''),
      byFacility: rateBy(filtered.clinic, filtered.matches, c => c.health_facility || ''),
      byVisit: rateBy(filtered.clinic, filtered.matches, c => c.visit_type || ''),
      collectors: collectorActivity(filtered.history),
      complete: completeness(filtered.clinic),
      cascade: cascade(filtered.clinic, filtered.matches),
      repeat: repeatRate(filtered.clinic, filtered.matches),
      rank: rankDistribution(filtered.matches),
      scores: scoreByDecision(filtered.matches),
      ids: idCompleteness(filtered.clinic),
      movers: recentMovers(filtered.clinic),
      byCollector: rateBy(filtered.clinic, filtered.matches, c => filtered.history.find(h => h.source_id === c.id)?.collector_name || ''),
    };
  }, [filtered]);

  const filters = { from, to, facility, tabia, deidentify };
  const stamp = new Date().toISOString().slice(0, 10);

  const exportMatches = async () => {
    if (!filtered) return;
    const rows = matchExportRows(filtered.clinic, filtered.matches, deidentify);
    download(toCSV(rows), `linkage_results_${stamp}.csv`);
    await logExport('match_results', filters, rows.length);
  };
  const exportMetrics = async () => {
    if (!m) return;
    const rows: Record<string, unknown>[] = [
      ...Object.entries(m.s).map(([k, v]) => ({ section: 'summary', group: k, n: v, matched: '', rate_pct: '' })),
      ...Object.entries(m.bands).map(([k, v]) => ({ section: 'confidence_band', group: k, n: v, matched: '', rate_pct: '' })),
      ...([['sex', m.bySex], ['age_group', m.byAge], ['tabia', m.byTabia], ['facility', m.byFacility], ['visit_type', m.byVisit]] as const)
        .flatMap(([sec, rs]) => rs.map(r => ({ section: `match_rate_by_${sec}`, group: r.group, n: r.n, matched: r.matched, rate_pct: r.rate }))),
      ...m.fields.map(f => ({ section: 'field_agreement', group: f.field, n: f.n, matched: '', rate_pct: f.rate })),
      ...m.cascade.map(c => ({ section: 'cascade', group: c.step, n: c.n, matched: '', rate_pct: c.pctOfPrev })),
      { section: 'repeat_patients', group: 'repeat_visits', n: m.repeat.repeatVisits, matched: m.repeat.linkedVisits, rate_pct: m.repeat.repeatPct },
      { section: 'repeat_patients', group: 'consistent_links', n: m.repeat.repeatPatients, matched: '', rate_pct: m.repeat.consistentPct },
      ...Object.entries(m.rank).map(([k, v]) => ({ section: 'confirmed_candidate_rank', group: k, n: v, matched: '', rate_pct: '' })),
      { section: 'score_by_decision', group: 'matched_avg', n: '', matched: '', rate_pct: m.scores.matchedAvg },
      { section: 'score_by_decision', group: 'rejected_avg', n: '', matched: '', rate_pct: m.scores.rejectedAvg },
      { section: 'review_resolved', group: 'all', n: m.scores.reviewTotal, matched: m.scores.reviewResolved, rate_pct: m.scores.reviewResolvedPct },
      { section: 'recent_movers', group: 'moved_in_last_year', n: m.movers, matched: '', rate_pct: '' },
      ...m.byCollector.map(r => ({ section: 'match_rate_by_collector', group: r.group, n: r.n, matched: r.matched, rate_pct: r.rate })),
      ...m.ids.map(i => ({ section: 'clinic_id_completeness', group: i.label, n: i.n, matched: '', rate_pct: i.pct })),
      { section: 'data_completeness', group: 'all', n: m.s.total, matched: '', rate_pct: m.complete },
    ];
    download(toCSV(rows), `linkage_metrics_${stamp}.csv`);
    await logExport('metrics', filters, rows.length);
  };
  const exportAudit = async () => {
    if (!filtered) return;
    const rows = filtered.history.map(h => ({
      linkage_id: pseudoId(h.source_id),
      hdss_candidate: deidentify ? (h.candidate_id ? pseudoId(h.candidate_id) : '') : h.candidate_id ?? '',
      decision: h.decision, reason: h.reason ?? '', collector: h.collector_name, recorded_at: h.created_at,
    }));
    download(toCSV(rows), `decision_history_${stamp}.csv`);
    await logExport('audit_trail', filters, rows.length);
  };
  const printReport = async () => { await logExport('pdf_report', filters, m?.s.total ?? 0); window.print(); };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8 print:py-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Linkage reports</h1>
          <p className="text-sm text-muted-foreground">How well clinic patients are being linked to the HDSS, following the PIRL reporting approach.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
          <Button variant="outline" size="sm" onClick={printReport} disabled={!m}><Printer className="mr-2 h-4 w-4" />Print / PDF</Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1"><Label htmlFor="from">From</Label><Input id="from" type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="to">To</Label><Input id="to" type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="space-y-1"><Label>Facility</Label>
            <Select value={facility} onValueChange={setFacility}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={ALL}>All facilities</SelectItem>{facilities.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1"><Label>Tabia</Label>
            <Select value={tabia} onValueChange={setTabia}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={ALL}>All tabias</SelectItem>{tabias.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="flex items-end"><Button className="w-full" onClick={load} disabled={loading}>Apply dates</Button></div>
        </CardContent>
      </Card>

      {!m ? <p className="text-sm text-muted-foreground">{loading ? 'Loading…' : 'No data.'}</p> : (
        <Tabs defaultValue="overview">
          <TabsList className="print:hidden flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Linkage quality</TabsTrigger>
            <TabsTrigger value="equity">Who isn't linked</TabsTrigger>
            <TabsTrigger value="collectors">Collectors</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 print:block">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Clinic records" value={m.s.total} />
              <Stat label="Consented" value={m.s.consented} hint={`${m.s.refused} refused`} />
              <Stat label="Live in HDSS area" value={m.s.residents} hint={`${m.s.nonResidents} never in DSS`} />
              <Stat label="Match rate (residents)" value={`${m.s.matchRateResidents}%`} hint="PIRL Kisesa benchmark: 84%" />
              <Stat label="Matched" value={m.s.matched} />
              <Stat label="No match" value={m.s.noMatch} />
              <Stat label="Sent for review" value={m.s.review} />
              <Stat label="Not yet decided" value={m.s.pending} />
            </div>
            <Card className="break-inside-avoid">
              <CardHeader className="pb-2"><CardTitle className="text-base">Linkage cascade</CardTitle>
                <CardDescription>Each step as a share of the step before (Rentsch et al. 2015; PIRL).</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {m.cascade.map(c => (
                  <div key={c.step} className="text-sm">
                    <div className="flex justify-between"><span>{c.step}</span><span className="text-muted-foreground">{c.n} · {c.pctOfPrev}%</span></div>
                    <Progress value={c.pctOfPrev} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Moved in last year" value={m.movers} hint="Counted separately" />
              <Stat label="Repeat visits" value={`${m.repeat.repeatPct}%`} hint={`${m.repeat.repeatVisits} of ${m.repeat.linkedVisits} linked visits`} />
              <Stat label="Repeat links consistent" value={`${m.repeat.consistentPct}%`} hint={`${m.repeat.repeatPatients} repeat patients`} />
              <Stat label="Reviews resolved" value={`${m.scores.reviewResolvedPct}%`} hint={`${m.scores.reviewResolved} of ${m.scores.reviewTotal}`} />
            </div>
            <Card className="break-inside-avoid">
              <CardHeader className="pb-2"><CardTitle className="text-base">Clinic ID completeness</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {m.ids.map(i => (<div key={i.label} className="text-sm"><div className="flex justify-between"><span>{i.label}</span><span className="text-muted-foreground">{i.n} · {i.pct}%</span></div><Progress value={i.pct} className="h-1.5" /></div>))}
              </CardContent>
            </Card>
            <Card className="break-inside-avoid">
              <CardHeader className="pb-2"><CardTitle className="text-base">Data completeness</CardTitle>
                <CardDescription>Share of key linkage fields filled in (names, sex, birth date, tabia, kushet, mother's name, facility).</CardDescription></CardHeader>
              <CardContent><Progress value={m.complete} /><p className="mt-2 text-sm font-medium">{m.complete}%</p></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4 print:block">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="High confidence" value={m.bands.high} hint="≥ 80%" />
              <Stat label="Needs review" value={m.bands.review} hint="40–79%" />
              <Stat label="No match" value={m.bands['no-match']} hint="< 40%" />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Avg score, confirmed" value={`${m.scores.matchedAvg}%`} />
              <Stat label="Avg score, rejected" value={`${m.scores.rejectedAvg}%`} />
              <Stat label="Confirmed was 1st" value={m.rank.first} hint={`${m.rank.top5} in 2–5 · ${m.rank.beyond} beyond`} />
              <Stat label="Rank not recorded" value={m.rank.unknown} hint="Older decisions" />
            </div>
            <Card className="break-inside-avoid">
              <CardHeader className="pb-2"><CardTitle className="text-base">Score distribution</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={m.hist}><CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="range" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="break-inside-avoid">
              <CardHeader className="pb-2"><CardTitle className="text-base">Field agreement in confirmed matches</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {m.fields.length === 0 && <p className="text-sm text-muted-foreground">No confirmed matches with field scores yet.</p>}
                {m.fields.map(f => (<div key={f.field} className="text-sm"><div className="flex justify-between"><span>{f.field}</span><span>{f.rate}%</span></div><Progress value={f.rate} className="h-1.5" /></div>))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equity" className="grid gap-4 md:grid-cols-2 print:grid">
            <RateTable title="By sex" rows={m.bySex} />
            <RateTable title="By age group" rows={m.byAge} />
            <RateTable title="By tabia" rows={m.byTabia} />
            <RateTable title="By facility" rows={m.byFacility} />
            <RateTable title="By visit type" rows={m.byVisit} />
          </TabsContent>

          <TabsContent value="collectors" className="print:block">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Decisions per collector</CardTitle></CardHeader>
              <CardContent>
                {m.collectors.length === 0 ? <p className="text-sm text-muted-foreground">No decisions yet.</p> : (
                  <table className="w-full text-sm"><thead className="text-left text-muted-foreground"><tr><th className="py-1">Collector</th><th>Decisions</th><th>Sent for review</th><th>With reason</th></tr></thead>
                    <tbody>{m.collectors.map(c => <tr key={c.name} className="border-t"><td className="py-1.5">{c.name}</td><td>{c.total}</td><td>{c.review}</td><td>{c.withReason}</td></tr>)}</tbody></table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 print:hidden">
            <Card>
              <CardHeader><CardTitle className="text-base">Export for research</CardTitle>
                <CardDescription>Uses the filters above. Every export is logged with your name and the filters used.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                  <Switch id="deid" checked={deidentify} onCheckedChange={setDeidentify} />
                  <div><Label htmlFor="deid">Remove names and identifiers</Label>
                    <p className="text-xs text-muted-foreground">Names, birth dates and record numbers are replaced with coded linkage IDs. Turn off only with ethics approval.</p></div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button onClick={exportMatches}><FileDown className="mr-2 h-4 w-4" />Matching results</Button>
                  <Button variant="outline" onClick={exportMetrics}><FileDown className="mr-2 h-4 w-4" />Metrics summary</Button>
                  <Button variant="outline" onClick={exportAudit}><FileDown className="mr-2 h-4 w-4" />Decision history</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Reports;
