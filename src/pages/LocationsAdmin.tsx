import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { locationsService, AdminArea } from '@/services/locationsService';
import { useToast } from '@/hooks/use-toast';

const FACILITY_TYPES = ['Hospital', 'Health Center', 'Health Post', 'Clinic'];

const LocationsAdmin = () => {
  const { areas, facilities, isAdmin, refresh } = useLocations();
  const { toast } = useToast();
  const [fName, setFName] = useState('');
  const [fType, setFType] = useState('Health Center');
  const [aName, setAName] = useState('');
  const [aNameTi, setANameTi] = useState('');
  const [aLevel, setALevel] = useState<'tabia' | 'kushet'>('tabia');
  const [parentId, setParentId] = useState('');

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); refresh(); toast({ title: ok }); }
    catch (e: any) { toast({ title: 'Not saved', description: e.message, variant: 'destructive' }); }
  };

  const parents = areas.filter(a => a.level === (aLevel === 'tabia' ? 'woreda' : 'tabia'));
  const parentName = (id: string | null) => areas.find(a => a.id === id)?.name_en || '—';
  const pendingCount = [...areas, ...facilities].filter(x => x.status === 'pending').length;

  const statusCell = (table: 'admin_areas' | 'health_facilities', row: { id: string; status: string }) => (
    <div className="flex items-center gap-2 justify-end">
      {row.status === 'pending' ? <Badge variant="outline">Pending</Badge> : <Badge variant="secondary">Active</Badge>}
      {isAdmin && row.status === 'pending' && (
        <Button size="sm" variant="outline" aria-label="Approve" onClick={() => run(() => locationsService.update(table, row.id, { status: 'active' }), 'Approved')}>
          <Check className="w-4 h-4" />
        </Button>
      )}
      {isAdmin && (
        <Button size="sm" variant="ghost" aria-label="Delete" className="text-destructive" onClick={() => run(() => locationsService.remove(table, row.id), 'Removed')}>
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const areaRows = (level: AdminArea['level']) => areas.filter(a => a.level === level);

  return (
    <div className="container max-w-5xl pt-24 pb-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Locations & Facilities</h1>
        <p className="text-muted-foreground">Lists used in clinic record entry. Names added by data collectors wait here for approval.</p>
        {!isAdmin && <p className="text-sm text-muted-foreground mt-2">You can propose new names; only admins can approve or remove them.</p>}
        {pendingCount > 0 && <Badge className="mt-2">{pendingCount} waiting for approval</Badge>}
      </div>

      <Tabs defaultValue="facilities">
        <TabsList>
          <TabsTrigger value="facilities">Health facilities</TabsTrigger>
          <TabsTrigger value="areas">Tabias & kushets</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities">
          <Card>
            <CardHeader><CardTitle>Health facilities</CardTitle><CardDescription>MCH/ANC sites linked to the HDSS.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input aria-label="Facility name" placeholder="Facility name" value={fName} onChange={e => setFName(e.target.value)} />
                <Select value={fType} onValueChange={setFType}>
                  <SelectTrigger className="sm:w-48" aria-label="Facility type"><SelectValue /></SelectTrigger>
                  <SelectContent>{FACILITY_TYPES.map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                </Select>
                <Button disabled={!fName.trim()} onClick={() => run(() => locationsService.addFacility({ name: fName.trim(), facility_type: fType, woreda: 'Kilte Awlaelo' }, isAdmin).then(() => setFName('')), 'Facility saved')}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <ul className="divide-y rounded-lg border">
                {facilities.map(f => (
                  <li key={f.id} className="flex items-center justify-between p-3">
                    <div><p className="font-medium">{f.name}</p><p className="text-xs text-muted-foreground">{f.facility_type} · {f.woreda || '—'}</p></div>
                    {statusCell('health_facilities', f)}
                  </li>
                ))}
                {facilities.length === 0 && <li className="p-4 text-sm text-muted-foreground">Sign in to see the list.</li>}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas">
          <Card>
            <CardHeader><CardTitle>Tabias & kushets</CardTitle><CardDescription>Each kushet belongs to a tabia; each tabia to a woreda.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <Select value={aLevel} onValueChange={v => { setALevel(v as 'tabia' | 'kushet'); setParentId(''); }}>
                  <SelectTrigger aria-label="Level"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="tabia">Tabia</SelectItem><SelectItem value="kushet">Kushet / Got</SelectItem></SelectContent>
                </Select>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger aria-label="Belongs to"><SelectValue placeholder={aLevel === 'tabia' ? 'Woreda' : 'Tabia'} /></SelectTrigger>
                  <SelectContent>{parents.map(p => <SelectItem key={p.id} value={p.id}>{p.name_en}</SelectItem>)}</SelectContent>
                </Select>
                <Input aria-label="Name (English)" placeholder="Name (English)" value={aName} onChange={e => setAName(e.target.value)} />
                <Input aria-label="Name (Tigrinya)" placeholder="ሽም (ትግርኛ)" value={aNameTi} onChange={e => setANameTi(e.target.value)} />
                <Button disabled={!aName.trim() || !parentId}
                  onClick={() => run(() => locationsService.addArea({ level: aLevel, parent_id: parentId, name_en: aName.trim(), name_ti: aNameTi.trim() || undefined }, isAdmin).then(() => { setAName(''); setANameTi(''); }), 'Name saved')}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {(['tabia', 'kushet'] as const).map(level => (
                <div key={level}>
                  <h3 className="text-sm font-semibold mb-2">{level === 'tabia' ? 'Tabias' : 'Kushets / Gots'} ({areaRows(level).length})</h3>
                  <ul className="divide-y rounded-lg border">
                    {areaRows(level).map(a => (
                      <li key={a.id} className="flex items-center justify-between p-3">
                        <div><p className="font-medium">{a.name_en} {a.name_ti && <span className="text-muted-foreground font-normal">· {a.name_ti}</span>}</p>
                          <p className="text-xs text-muted-foreground">in {parentName(a.parent_id)}</p></div>
                        {statusCell('admin_areas', a)}
                      </li>
                    ))}
                    {areaRows(level).length === 0 && <li className="p-3 text-sm text-muted-foreground">None yet.</li>}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsAdmin;
