
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Record } from '@/types';
import { getFullName } from '../../utils/nameFieldUtils';
import { getDisplayValue, getGender } from '@/utils/recordDisplayUtils';
import MatchScoreDisplay from './MatchScoreDisplay';
import RecordActions from './RecordActions';
import { formatDate } from '@/utils/dateUtils';

interface TableRowProps {
  record: Record;
  isExpanded: boolean;
  toggleExpand: () => void;
  showMatchDetail?: boolean;
  onAssignMatch?: (record: Record) => void;
  onToggleNotes?: () => void;
}

const TableRow = ({ 
  record, 
  isExpanded, 
  toggleExpand, 
  showMatchDetail = false,
  onAssignMatch,
  onToggleNotes
}: TableRowProps) => {
  // Use the consistent name utility with firstMiddleLast format
  const fullName = getFullName(record, 'firstMiddleLast');
  
  return (
    <tr 
      className={`hover:bg-muted/30 transition-colors ${isExpanded ? 'bg-muted/20' : ''}`}
    >
      <td className="px-3 py-4 whitespace-nowrap cursor-pointer" onClick={toggleExpand}>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="font-medium uppercase">
          {fullName}
        </div>
        <div className="text-xs text-muted-foreground">
          ID: {record.patientId || record.id.substring(0, 8)}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {getGender(record)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {formatDate(record.birthDate, '-')}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {getDisplayValue(record, 'village', '-')}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {getDisplayValue(record, 'district', '-')}
      </td>
      {showMatchDetail && (
        <td className="px-4 py-4 whitespace-nowrap">
          <MatchScoreDisplay score={record.metadata?.matchScore || record.fuzzyScore} />
        </td>
      )}
      {onAssignMatch && onToggleNotes && (
        <td className="px-4 py-4 whitespace-nowrap">
          <RecordActions 
            record={record} 
            onAssignMatch={onAssignMatch} 
            onToggleNotes={onToggleNotes} 
          />
        </td>
      )}
    </tr>
  );
};

export default TableRow;
