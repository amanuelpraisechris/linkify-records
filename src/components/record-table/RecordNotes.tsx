
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';
import { Record } from '@/types';

interface RecordNotesProps {
  record: Record;
  noteText: string;
  onNoteChange: (text: string) => void;
  onSaveNotes: () => void;
}

const RecordNotes = ({ record, noteText, onNoteChange, onSaveNotes }: RecordNotesProps) => {
  return (
    <div className="md:col-span-2 mt-4 border-t pt-4">
      <h4 className="font-medium mb-2 flex items-center">
        <MessageSquareText className="w-4 h-4 mr-1 text-muted-foreground" />
        Match Notes
      </h4>
      <textarea
        value={noteText}
        onChange={(e) => onNoteChange(e.target.value)}
        className="w-full h-24 p-2 border rounded-md text-sm"
        placeholder="Enter notes about this match here. Include date and any relevant details that might help with future matching."
      />
      <div className="flex justify-end mt-2">
        <Button
          variant="default"
          size="sm"
          onClick={onSaveNotes}
        >
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default RecordNotes;
