
import { Record } from '@/types';
import RecordDetails from './RecordDetails';
import RecordNotes from './RecordNotes';

interface ExpandedRowProps {
  record: Record;
  isExpanded: boolean;
  showMatchDetail?: boolean;
  showNotes?: boolean;
  noteText: string;
  onNoteChange: (text: string) => void;
  onSaveNotes: () => void;
  colSpan: number;
}

const ExpandedRow = ({ 
  record, 
  isExpanded,
  showMatchDetail = false,
  showNotes = false,
  noteText,
  onNoteChange,
  onSaveNotes,
  colSpan
}: ExpandedRowProps) => {
  if (!isExpanded) return null;
  
  return (
    <tr className="bg-muted/10">
      <td colSpan={colSpan} className="px-4 py-3">
        <RecordDetails record={record} showMatchDetail={showMatchDetail} />
        {showNotes && (
          <RecordNotes 
            record={record} 
            noteText={noteText} 
            onNoteChange={onNoteChange} 
            onSaveNotes={onSaveNotes} 
          />
        )}
      </td>
    </tr>
  );
};

export default ExpandedRow;
