
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquareText } from 'lucide-react';
import { Record } from '@/types';

interface RecordActionsProps {
  record: Record;
  onAssignMatch: (record: Record) => void;
  onToggleNotes: () => void;
}

const RecordActions = ({ record, onAssignMatch, onToggleNotes }: RecordActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center text-xs"
        onClick={() => onAssignMatch(record)}
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Assign Match
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center text-xs"
        onClick={onToggleNotes}
      >
        <MessageSquareText className="w-3 h-3 mr-1" />
        Match Notes
      </Button>
    </div>
  );
};

export default RecordActions;
