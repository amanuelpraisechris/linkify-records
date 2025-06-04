
import { supabase } from '@/integrations/supabase/client';
import { Record, MatchResult } from '@/types';

export interface DatabaseRecord {
  id: string;
  patient_id?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  sex?: string;
  birth_date: string;
  address?: string;
  phone_number?: string;
  email?: string;
  health_facility?: string;
  last_visit?: string;
  village?: string;
  sub_village?: string;
  district?: string;
  household_head?: string;
  mother_name?: string;
  year_moved_in?: string;
  never_in_dss?: boolean;
  balozi_first_name?: string;
  balozi_middle_name?: string;
  balozi_last_name?: string;
  oldest_member_first_name?: string;
  oldest_member_middle_name?: string;
  oldest_member_last_name?: string;
  telephone?: string;
  fuzzy_score?: number;
  matched_on?: string[];
  source_id?: string;
  household_members?: string[];
  identifiers?: any;
  metadata?: any;
  field_scores?: any;
  record_type?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

const convertRecordToDatabase = (record: Record, userId: string): Omit<DatabaseRecord, 'id' | 'created_at' | 'updated_at'> => ({
  patient_id: record.id,
  first_name: record.firstName,
  last_name: record.lastName,
  middle_name: record.middleName,
  sex: record.sex,
  birth_date: record.birthDate,
  address: record.address,
  phone_number: record.phoneNumber,
  email: record.email,
  health_facility: record.healthFacility,
  last_visit: record.lastVisit,
  village: record.village,
  sub_village: record.subVillage,
  district: record.district,
  household_head: record.householdHead,
  mother_name: record.motherName,
  year_moved_in: record.yearMovedIn,
  never_in_dss: record.neverInDSS,
  balozi_first_name: record.balozi_first_name,
  balozi_middle_name: record.balozi_middle_name,
  balozi_last_name: record.balozi_last_name,
  oldest_member_first_name: record.oldest_member_first_name,
  oldest_member_middle_name: record.oldest_member_middle_name,
  oldest_member_last_name: record.oldest_member_last_name,
  telephone: record.telephone,
  household_members: record.householdMembers,
  identifiers: record.identifiers || [],
  metadata: record.metadata || {},
  user_id: userId
});

const convertDatabaseToRecord = (dbRecord: DatabaseRecord): Record => ({
  id: dbRecord.patient_id || dbRecord.id,
  firstName: dbRecord.first_name,
  lastName: dbRecord.last_name,
  middleName: dbRecord.middle_name,
  sex: dbRecord.sex,
  birthDate: dbRecord.birth_date,
  address: dbRecord.address,
  phoneNumber: dbRecord.phone_number,
  email: dbRecord.email,
  healthFacility: dbRecord.health_facility,
  lastVisit: dbRecord.last_visit,
  village: dbRecord.village,
  subVillage: dbRecord.sub_village,
  district: dbRecord.district,
  householdHead: dbRecord.household_head,
  motherName: dbRecord.mother_name,
  yearMovedIn: dbRecord.year_moved_in,
  neverInDSS: dbRecord.never_in_dss,
  balozi_first_name: dbRecord.balozi_first_name,
  balozi_middle_name: dbRecord.balozi_middle_name,
  balozi_last_name: dbRecord.balozi_last_name,
  oldest_member_first_name: dbRecord.oldest_member_first_name,
  oldest_member_middle_name: dbRecord.oldest_member_middle_name,
  oldest_member_last_name: dbRecord.oldest_member_last_name,
  telephone: dbRecord.telephone,
  householdMembers: dbRecord.household_members,
  identifiers: dbRecord.identifiers || [],
  metadata: dbRecord.metadata || {}
});

export const databaseService = {
  // Community Records
  async getCommunityRecords(): Promise<Record[]> {
    const { data, error } = await supabase
      .from('community_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching community records:', error);
      return [];
    }
    
    return (data || []).map(convertDatabaseToRecord);
  },

  async insertCommunityRecords(records: Record[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const dbRecords = records.map(record => convertRecordToDatabase(record, user.id));
    
    const { error } = await supabase
      .from('community_records')
      .insert(dbRecords);
    
    if (error) {
      console.error('Error inserting community records:', error);
      throw error;
    }
  },

  async clearCommunityRecords(): Promise<void> {
    const { error } = await supabase
      .from('community_records')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      console.error('Error clearing community records:', error);
      throw error;
    }
  },

  // Clinic Records
  async getClinicRecords(): Promise<Record[]> {
    const { data, error } = await supabase
      .from('clinic_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clinic records:', error);
      return [];
    }
    
    return (data || []).map(convertDatabaseToRecord);
  },

  async insertClinicRecord(record: Record): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const dbRecord = {
      ...convertRecordToDatabase(record, user.id),
      visits: record.visits || [],
      residency_timeline: record.residencyTimeline || []
    };
    
    const { error } = await supabase
      .from('clinic_records')
      .insert([dbRecord]);
    
    if (error) {
      console.error('Error inserting clinic record:', error);
      throw error;
    }
  },

  // All Records (combination view)
  async getAllRecords(): Promise<Record[]> {
    const [communityRecords, clinicRecords] = await Promise.all([
      this.getCommunityRecords(),
      this.getClinicRecords()
    ]);
    
    return [...communityRecords, ...clinicRecords];
  },

  // Match Results
  async saveMatchResult(result: MatchResult): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('match_results')
      .insert([{
        source_id: result.sourceId,
        match_id: result.matchId,
        status: result.status,
        confidence: result.confidence,
        matched_by: result.matchedBy,
        matched_at: result.matchedAt,
        notes: result.notes,
        field_scores: result.fieldScores || {},
        consent_obtained: result.consentObtained,
        consent_date: result.consentDate,
        user_id: user.id
      }]);
    
    if (error) {
      console.error('Error saving match result:', error);
      throw error;
    }
  },

  async getMatchResults(): Promise<MatchResult[]> {
    const { data, error } = await supabase
      .from('match_results')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching match results:', error);
      return [];
    }
    
    return (data || []).map(result => ({
      sourceId: result.source_id,
      matchId: result.match_id,
      status: result.status as 'matched' | 'rejected' | 'manual-review',
      confidence: result.confidence,
      matchedBy: result.matched_by,
      matchedAt: result.matched_at,
      notes: result.notes,
      fieldScores: result.field_scores,
      consentObtained: result.consent_obtained,
      consentDate: result.consent_date
    }));
  },

  // Match Attempts
  async saveMatchAttempt(query: string, success: boolean, resultsCount: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('match_attempts')
      .insert([{
        query,
        success,
        results_count: resultsCount,
        user_id: user.id
      }]);
    
    if (error) {
      console.error('Error saving match attempt:', error);
      throw error;
    }
  },

  async getMatchAttempts(): Promise<Array<{ timestamp: string; query: string; success: boolean }>> {
    const { data, error } = await supabase
      .from('match_attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching match attempts:', error);
      return [];
    }
    
    return (data || []).map(attempt => ({
      timestamp: attempt.created_at,
      query: attempt.query,
      success: attempt.success
    }));
  }
};
