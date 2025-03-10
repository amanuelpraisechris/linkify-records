
import { Record, MatchResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, Info, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface ProgressReportTabProps {
  matchResults: MatchResult[];
  clinicRecords: Record[];
  communityRecords: Record[];
}

const ProgressReportTab = ({ 
  matchResults, 
  clinicRecords, 
  communityRecords 
}: ProgressReportTabProps) => {
  const renderMatchStatusBadge = (status: string) => {
    switch(status) {
      case 'matched':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Matched</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'manual-review':
        return <Badge className="bg-amber-500"><HelpCircle className="w-3 h-3 mr-1" /> For Review</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold mb-6">Matching Progress Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">Matched Records</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500">
            {matchResults.filter(r => r.status === 'matched').length}
          </p>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Under Review</h3>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            {matchResults.filter(r => r.status === 'manual-review').length}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">Rejected Matches</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-500">
            {matchResults.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>
      
      {matchResults.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-muted">
            <thead className="bg-muted/30">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Source Record
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Matched Record
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Confidence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black divide-y divide-muted">
              {matchResults.map((result, idx) => {
                const sourceRecord = clinicRecords.find(r => r.id === result.sourceId);
                const matchedRecord = result.matchId 
                  ? communityRecords.find(r => r.id === result.matchId) 
                  : null;
                  
                return (
                  <tr key={idx} className="hover:bg-muted/10">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sourceRecord ? (
                        <div>
                          <div className="font-medium">{sourceRecord.firstName} {sourceRecord.lastName}</div>
                          <div className="text-xs text-muted-foreground">ID: {sourceRecord.id.substring(0, 8)}</div>
                        </div>
                      ) : 'Unknown Record'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {matchedRecord ? (
                        <div>
                          <div className="font-medium">{matchedRecord.firstName} {matchedRecord.lastName}</div>
                          <div className="text-xs text-muted-foreground">ID: {matchedRecord.id.substring(0, 8)}</div>
                        </div>
                      ) : 'No Match Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderMatchStatusBadge(result.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {result.confidence}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(result.matchedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {result.notes ? (
                        <div className="max-w-xs truncate" title={result.notes}>
                          {result.notes}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No notes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No match history available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Match records will appear here after you process matches from the Matches tab.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressReportTab;
