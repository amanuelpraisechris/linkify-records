
import React, { useState } from 'react';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import TableHeader from './record-table/TableHeader';
import TableRow from './record-table/TableRow';
import ExpandedRow from './record-table/ExpandedRow';

interface RecordTableViewProps {
  records: Record[];
  expandedRecord: string | null;
  toggleRecordDetails: (recordId: string) => void;
  showMatchDetail?: boolean;
  onAssignMatch?: (record: Record) => void;
  onSaveNotes?: (record: Record, notes: string) => void;
}

const RecordTableView = ({ 
  records, 
  expandedRecord, 
  toggleRecordDetails, 
  showMatchDetail = false,
  onAssignMatch,
  onSaveNotes
}: RecordTableViewProps) => {
  const { toast } = useToast();
  const [activeRecord, setActiveRecord] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<{[key: string]: string}>({});
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Records in RecordTableView:', records);
  }
  
  const handleAssignMatch = (record: Record) => {
    if (onAssignMatch) {
      onAssignMatch(record);
      toast({
        title: "Match Assigned",
        description: `Successfully assigned match for record: ${record.firstName} ${record.lastName}`,
      });
    }
  };
  
  const handleSaveNotes = (record: Record) => {
    if (onSaveNotes && noteText[record.id]) {
      onSaveNotes(record, noteText[record.id]);
      toast({
        title: "Match Notes Saved",
        description: "Your notes have been saved successfully.",
      });
      setNoteText(prev => ({...prev, [record.id]: ''}));
    } else {
      toast({
        title: "No Notes to Save",
        description: "Please enter some notes before saving.",
        variant: "destructive",
      });
    }
  };

  // Calculate the correct colSpan for expanded rows
  const getColSpan = () => {
    let span = 6; // Base columns
    if (showMatchDetail) span += 1;
    if (onAssignMatch) span += 1;
    return span;
  };

  return (
    <div className="rounded-lg border overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader 
            showMatchDetail={showMatchDetail} 
            showActions={!!onAssignMatch} 
          />
          <tbody className="divide-y bg-white dark:bg-black">
            {records.map((record) => (
              <React.Fragment key={record.id}>
                <TableRow 
                  record={record}
                  isExpanded={expandedRecord === record.id}
                  toggleExpand={() => toggleRecordDetails(record.id)}
                  showMatchDetail={showMatchDetail}
                  onAssignMatch={onAssignMatch ? (r) => handleAssignMatch(r) : undefined}
                  onToggleNotes={onAssignMatch ? () => setActiveRecord(record.id === activeRecord ? null : record.id) : undefined}
                />
                <ExpandedRow 
                  record={record}
                  isExpanded={expandedRecord === record.id}
                  showMatchDetail={showMatchDetail}
                  showNotes={activeRecord === record.id}
                  noteText={noteText[record.id] || ''}
                  onNoteChange={(text) => setNoteText(prev => ({...prev, [record.id]: text}))}
                  onSaveNotes={() => handleSaveNotes(record)}
                  colSpan={getColSpan()}
                />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordTableView;
