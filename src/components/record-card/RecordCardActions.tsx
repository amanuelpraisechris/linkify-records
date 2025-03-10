
import { Check, X } from 'lucide-react';

interface RecordCardActionsProps {
  isExpanded: boolean;
  showActions?: boolean;
  onToggleExpand: () => void;
  onMatch?: () => void;
  onReject?: () => void;
}

const RecordCardActions = ({
  isExpanded,
  showActions = false,
  onToggleExpand,
  onMatch,
  onReject
}: RecordCardActionsProps) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={onToggleExpand}
        className="text-sm text-primary font-medium hover:underline focus:outline-none"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
      
      {showActions && (
        <div className="flex space-x-2">
          <button
            onClick={onReject}
            className="inline-flex items-center justify-center p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all-medium"
            aria-label="Reject match"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={onMatch}
            className="inline-flex items-center justify-center p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition-all-medium"
            aria-label="Confirm match"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordCardActions;
