
import { LayoutList, Table } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'card' | 'table';
  setViewMode: (mode: 'card' | 'table') => void;
}

const ViewToggle = ({ viewMode, setViewMode }: ViewToggleProps) => {
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setViewMode('card')}
        className={`p-1.5 rounded-md transition-colors ${
          viewMode === 'card' 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        aria-label="Card view"
      >
        <LayoutList className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => setViewMode('table')}
        className={`p-1.5 rounded-md transition-colors ${
          viewMode === 'table' 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        aria-label="Table view"
      >
        <Table className="w-4 h-4" />
      </button>
      
      <div className="w-px h-5 bg-border mx-1"></div>
    </div>
  );
};

export default ViewToggle;
