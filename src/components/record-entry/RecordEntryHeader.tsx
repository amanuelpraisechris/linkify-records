
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RecordEntryHeader = () => {
  return (
    <div className="mb-8">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Clinic Record Entry</h1>
      <p className="text-lg text-muted-foreground">
        Add new clinic records and match them with the HDSS community database
      </p>
    </div>
  );
};

export default RecordEntryHeader;
