
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NoCommunityDatabaseAlert = () => {
  return (
    <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Community Database Loaded</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Please import a community database to enable probabilistic matching of clinic records.</p>
        <p className="text-sm"><strong>Important:</strong> Click "Import Community Database" below and set it as the main HDSS database to enable matching functionality.</p>
      </AlertDescription>
    </Alert>
  );
};

export default NoCommunityDatabaseAlert;
