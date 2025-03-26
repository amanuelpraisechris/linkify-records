
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

const RecordEntryHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Record Entry</span>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Clinic Record Entry</h1>
      <p className="text-lg text-muted-foreground">
        Add new clinic records and match them with the HDSS community database
      </p>
    </div>
  );
};

export default RecordEntryHeader;
