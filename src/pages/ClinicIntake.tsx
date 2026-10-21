import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileDown, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadReportData, logExport, ReportData } from '@/services/reportsService';
import { ClinicRow, decisionFor, latestByRecord, pseudoId, toCSV, toPercent } from '@/utils/reportMetrics';

const ALL = '__all';
const STATUS_LABEL: Record<string, string> = { matched: 'Matched', rejected: 'No match', review: 'Needs review', pending: 'Not searched' };

const download = (csv: string, name: string) => {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

const ClinicIntake = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [facility, setFacility] = useState(ALL); const [tabia, setTabia] = useState(ALL); const [status, setStatus] = useState(ALL);
  const [deidentify, setDeidentify] = useState(true);
  const [open, setOpen] = useState<ClinicRow | null>(null);

  const load = async () => {
    setLoading(true);
    try { setData(await loadReportData(from || undefined, to || undefined)); }
    catch (e) { console.error(e); toast({ title: 'Could not load clinic records', variant: 'destructive' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const latest = latestByRecord(data.matches);
    const collector = new Map<string, string>();
    data.history.forEach(h => { if (!collector.has(h.source_id)) collector.set(h.source_id, h.collector_name); });
    return data.clinic.map(c => {
      const d = decisionFor(c, latest);
      const st = !d ? 'pending' : d.status === 'matched' || d.status === 'rejected' ? d.status : 'review';
      return { c, d, st, collector: collector.get(c.id) || (c.patient_id ? collector.get(c.patient_id) : '') || '' };
    }).filter(r => (facility === ALL || r.c.health_facility === facility) && (tabia === ALL || (r.c.tabia || r.c.village) === tabia) && (status === ALL || r.st === status))
      .sort((a, b) => (b.c.created_at || '').localeCompare(a.c.created_at || ''));
  }, [data, facility, tabia, status]);

  const facilities = useMemo(() => [...new Set((data?.clinic ?? []).map(c => c.health_facility).filter(Boolean) as string[])].sort(), [data]);
  const tabias = useMemo(() => [...new Set((data?.clinic ?? []).map(c => c.tabia || c.village).filter(Boolean) as string[])].sort(), [data]);
  const name = (c: ClinicRow) => [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(' ');

  const exportCsv = async () => {
    const out = rows.map(({ c, d, st, collector }) => ({
      linkage_id: pseudoId(c.id), ...(deidentify ? {} : { name: name(c), mother_name: c.mother_name ?? '', birth_date: c.birth_date ?? '' }),
      recorded_at: c.created_at ?? '', facility: c.health_facility ?? '', tabia: c.tabia || c.village || '', kushet: c.kushet ?? '',
      visit_type: c.visit_type ?? '', sex: c.sex ?? '', consent: c.consent_obtained ? 'yes' : c.consent_type === 'refused' ? 'refused' : 'no',
      never_in_dss: c.never_in_dss ? 'yes' : 'no', status: STATUS_LABEL[st], score_pct: d ? Math.round(toPercent(d.confidence)) : '', collector,
    }));
    download(toCSV(out), `clinic_intake_${new Date().toISOString().slice(0, 10)}.csv`);
    await logExport('clinic_intake', { from, to, facility, tabia, status, deidentify }, out.length);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Clinic intake</h1>
          <p className="text-sm text-muted-foreground">Every clinic record saved during interviews, from all data collectors.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2"><Switch id="deid" checked={deidentify} onCheckedChange={setDeidentify} /><Label htmlFor="deid" className="text-sm">Remove names in export</Label></div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
          <Button size="sm" onClick={exportCsv} disabled={!rows.length}><FileDown className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-1"><Label htmlFor="f">From</Label><Input id="f" type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="t">To</Label><Input id="t" type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="space-y-1"><Label>Facility</Label><Select value={facility} onValueChange={setFacility}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All</SelectItem>{facilities.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Tabia</Label><Select value={tabia} onValueChange={setTabia}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All</SelectItem>{tabias.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All</SelectItem>{Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex items-end"><Button className="w-full" variant="secondary" onClick={load} disabled={loading}>Apply dates</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{rows.length} record(s)</CardTitle><CardDescription>Select a row to see details.</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr>
              {['Date', 'Patient', 'Facility', 'Tabia', 'Visit', 'Consent', 'Status', 'Collector'].map(h => <th key={h} className="px-2 py-2 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map(({ c, st, collector }) => (
                <tr key={c.id} className="cursor-pointer border-t hover:bg-muted/50" onClick={() => setOpen(c)}>
                  <td className="px-2 py-2 whitespace-nowrap">{c.created_at?.slice(0, 10)}</td>
                  <td className="px-2 py-2">{name(c)}</td>
                  <td className="px-2 py-2">{c.health_facility}</td>
                  <td className="px-2 py-2">{c.tabia || c.village}</td>
                  <td className="px-2 py-2">{c.visit_type}</td>
                  <td className="px-2 py-2">{c.consent_obtained ? 'Yes' : c.consent_type === 'refused' ? 'Refused' : 'No'}</td>
                  <td className="px-2 py-2"><Badge variant={st === 'matched' ? 'default' : st === 'rejected' ? 'destructive' : 'secondary'}>{STATUS_LABEL[st]}</Badge></td>
                  <td className="px-2 py-2">{collector}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={8} className="px-2 py-6 text-center text-muted-foreground">{loading ? 'Loading…' : 'No clinic records yet.'}</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={o => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{open && name(open)}</DialogTitle></DialogHeader>
          {open && (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {([['Linkage ID', pseudoId(open.id)], ["Mother's name", open.mother_name], ['Birth date', open.birth_date], ['Sex', open.sex], ['Facility', open.health_facility], ['Tabia', open.tabia || open.village], ['Kushet', open.kushet], ['Visit type', open.visit_type], ['Never in HDSS area', open.never_in_dss ? 'Yes' : 'No'], ['Moved in', open.year_moved_in], ['Recorded', open.created_at?.slice(0, 16).replace('T', ' ')]] as [string, unknown][])
                .map(([k, v]) => (<div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{String(v ?? '—') || '—'}</dd></div>))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicIntake;
