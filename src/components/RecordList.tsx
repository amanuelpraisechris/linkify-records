
import { useState, useEffect } from 'react';
import { Record } from '@/types';
import RecordCard from './RecordCard';
import { compareStrings } from '@/utils/languageUtils';
import { SupportedLanguage } from '@/utils/languageUtils';
import RecordFilters from './RecordFilters';
import ViewToggle from './ViewToggle';
import RecordTableView from './RecordTableView';
import { useToast } from '@/components/ui/use-toast';
import { useRecordData } from '@/contexts/RecordDataContext';

interface RecordListProps {
  records: Record[];
  title?: string;
  emptyMessage?: string;
  showMatchDetail?: boolean;
  enableMatchAssignment?: boolean;
}

const RecordList = ({ 
  records, 
  title = "Records",
  emptyMessage = "No records found",
  showMatchDetail = false,
  enableMatchAssignment = false
}: RecordListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchLanguage, setSearchLanguage] = useState<SupportedLanguage>('latin');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const { toast } = useToast();
  const { saveMatchResult, saveMatchNotes } = useRecordData();
  
  useEffect(() => {
    console.log(`RecordList received ${records.length} records`);
    if (records.length > 0) {
      console.log('Sample record:', records[0]);
    }
  }, [records]);

  // Updated filtering logic to handle more field patterns
  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    console.log(`Filtering record: ${record.firstName || record.FirstName || record["\"FirstName\""]}`);
    
    // Normalize record fields to handle quoted and unquoted keys
    const fields = Object.entries(record).reduce((acc, [key, value]) => {
      if (key.startsWith('"') && typeof value === 'string') {
        const cleanKey = key.replace(/"/g, '');
        acc[cleanKey] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as {[key: string]: any});
    
    // Try all possible naming patterns
    const matches = 
      compareStrings(record.firstName || fields.FirstName || '', searchQuery, searchLanguage) ||
      compareStrings(record.lastName || fields.LastName || '', searchQuery, searchLanguage) ||
      compareStrings(record.patientId || '', searchQuery, searchLanguage) ||
      compareStrings(record.healthFacility || '', searchQuery, searchLanguage) ||
      compareStrings(record.village || fields.villagename || '', searchQuery, searchLanguage) ||
      compareStrings(record.district || fields.district || '', searchQuery, searchLanguage) ||
      record.identifiers?.some(id => compareStrings(id.value, searchQuery, searchLanguage)) ||
      compareStrings(fields.FirstName || '', searchQuery, searchLanguage) ||
      compareStrings(fields.LastName || '', searchQuery, searchLanguage) ||
      compareStrings(fields.villagename || '', searchQuery, searchLanguage) ||
      compareStrings(fields.subvillagename || '', searchQuery, searchLanguage);
    
    if (matches) {
      console.log(`Match found for "${searchQuery}": ${record.firstName || fields.FirstName || ''} ${record.lastName || fields.LastName || ''}`);
    }
    
    return matches;
  });

  const toggleRecordDetails = (recordId: string) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(recordId);
    }
  };

  const handleAssignMatch = (record: Record) => {
    const matchResult = {
      sourceId: record.sourceId || "unknown",
      matchId: record.id,
      status: 'matched' as 'matched' | 'rejected' | 'manual-review',
      confidence: record.metadata?.matchScore || record.fuzzyScore || 0,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
    };
    
    saveMatchResult(matchResult);
    
    // Use improved display name logic
    const firstName = record.firstName || record.FirstName || record["\"FirstName\""]?.replace(/"/g, '') || '';
    const lastName = record.lastName || record.LastName || record["\"LastName\""]?.replace(/"/g, '') || '';
    
    toast({
      title: "Match Assigned",
      description: `Successfully assigned match to ${firstName} ${lastName}`,
    });
  };
  
  const handleSaveNotes = (record: Record, notes: string) => {
    // This now uses the saveMatchNotes function from the context
    saveMatchNotes(record.id, notes);
    
    toast({
      title: "Match Notes Saved",
      description: "Your notes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex items-center space-x-3">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          
          <RecordFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchLanguage={searchLanguage}
            setSearchLanguage={setSearchLanguage}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>
      </div>
      
      {filteredRecords.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-4 animate-fade-in">
            {filteredRecords.map((record) => {
              // Transform the record to ensure proper data display
              const normalizedRecord = {
                ...record,
                firstName: record.firstName || 
                          (record.FirstName) || 
                          (record["\"FirstName\""] ? record["\"FirstName\""].replace(/"/g, '') : ''),
                lastName: record.lastName || 
                         (record.LastName) || 
                         (record["\"LastName\""] ? record["\"LastName\""].replace(/"/g, '') : ''),
                gender: record.gender || 
                        (record.Sex ? (record.Sex === 'M' ? 'Male' : record.Sex === 'F' ? 'Female' : record.Sex) : 
                        (record["\"Sex\""] ? 
                          (record["\"Sex\""].replace(/"/g, '') === 'M' ? 'Male' : 
                          record["\"Sex\""].replace(/"/g, '') === 'F' ? 'Female' : 
                          record["\"Sex\""].replace(/"/g, '')) : '-')),
                birthDate: record.birthDate || 
                          (record.dob) || 
                          (record["\"dob\""] ? record["\"dob\""].replace(/"/g, '') : ''),
                village: record.village || 
                        (record.villagename) || 
                        (record["\"villagename\""] ? record["\"villagename\""].replace(/"/g, '') : '-'),
                subVillage: record.subVillage || 
                           (record.subvillagename) || 
                           (record["\"subvillagename\""] ? record["\"subvillagename\""].replace(/"/g, '') : '-'),
              };
              
              return (
                <RecordCard 
                  key={record.id} 
                  record={normalizedRecord}
                  matchScore={record.metadata?.matchScore || record.fuzzyScore}
                  matchedOn={record.matchedOn}
                />
              );
            })}
          </div>
        ) : (
          <RecordTableView 
            records={filteredRecords}
            expandedRecord={expandedRecord}
            toggleRecordDetails={toggleRecordDetails}
            showMatchDetail={showMatchDetail}
            onAssignMatch={enableMatchAssignment ? handleAssignMatch : undefined}
            onSaveNotes={enableMatchAssignment ? handleSaveNotes : undefined}
          />
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecordList;
