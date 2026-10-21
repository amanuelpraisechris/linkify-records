import { supabase } from '@/integrations/supabase/client';

export type AreaLevel = 'woreda' | 'tabia' | 'kushet';
export type ListStatus = 'active' | 'pending';

export interface AdminArea { id: string; level: AreaLevel; parent_id: string | null; name_en: string; name_ti: string | null; status: ListStatus }
export interface HealthFacility { id: string; name: string; name_ti: string | null; facility_type: string; woreda: string | null; status: ListStatus }

// Tables are newer than the generated types; use an untyped handle.
const db = supabase as any;

export const locationsService = {
  async listAreas(): Promise<AdminArea[]> {
    const { data, error } = await db.from('admin_areas').select('*').order('name_en');
    if (error) { console.error('admin_areas', error); return []; }
    return data || [];
  },
  async listFacilities(): Promise<HealthFacility[]> {
    const { data, error } = await db.from('health_facilities').select('*').order('name');
    if (error) { console.error('health_facilities', error); return []; }
    return data || [];
  },
  /** Collectors propose (pending); admins add directly as active. */
  async addArea(a: { level: AreaLevel; parent_id?: string | null; name_en: string; name_ti?: string }, asAdmin: boolean) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw new Error('Please sign in to add a name.');
    const { data, error } = await db.from('admin_areas')
      .insert({ ...a, status: asAdmin ? 'active' : 'pending', created_by: u.user.id }).select().single();
    if (error) throw error;
    return data as AdminArea;
  },
  async addFacility(f: { name: string; facility_type?: string; woreda?: string; name_ti?: string }, asAdmin: boolean) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw new Error('Please sign in to add a name.');
    const { data, error } = await db.from('health_facilities')
      .insert({ ...f, status: asAdmin ? 'active' : 'pending', created_by: u.user.id }).select().single();
    if (error) throw error;
    return data as HealthFacility;
  },
  async update(table: 'admin_areas' | 'health_facilities', id: string, patch: { [k: string]: unknown }) {
    const { error } = await db.from(table).update(patch).eq('id', id);
    if (error) throw error;
  },
  async remove(table: 'admin_areas' | 'health_facilities', id: string) {
    const { error } = await db.from(table).delete().eq('id', id);
    if (error) throw error;
  },
  async isAdmin(): Promise<boolean> {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return false;
    const { data } = await db.from('user_roles').select('role').eq('user_id', u.user.id).eq('role', 'admin');
    return (data || []).length > 0;
  },
};
