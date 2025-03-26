
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

const RecordEntryHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link 
          to="/" 
          className="hover:text-foreground transition-colors flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Record Entry</span>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Clinic Record Entry</h1>
      <p className="text-lg text-muted-foreground">
        Add new clinic records and match them with the DSS community database
      </p>
    </div>
  );
};

export default RecordEntryHeader;
