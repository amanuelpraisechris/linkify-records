
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
    
    console.log(`Filtering record: ${record.firstName}`);
    
    // Extract strings from the record that we want to search in
    const fieldsToSearch = [
      record.firstName,
      record.lastName,
      record.patientId,
      record.healthFacility,
      record.village,
      record.district,
    ];
    
    // Add identifier values to searchable fields
    if (record.identifiers?.length) {
      record.identifiers.forEach(id => {
        fieldsToSearch.push(id.value);
      });
    }
    
    // Filter out undefined or null values and perform the comparison
    return fieldsToSearch
      .filter(Boolean)
      .some(field => compareStrings(field || '', searchQuery, searchLanguage));
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
    
    // Use proper field access
    const firstName = record.firstName || '';
    const lastName = record.lastName || '';
    
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
              // No need to transform the record - just use the fields as defined in the type
              return (
                <RecordCard 
                  key={record.id} 
                  record={record}
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
