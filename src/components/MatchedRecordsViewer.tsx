/**
 * Matched Records Viewer
 * Shows all successfully matched records with export functionality
 */

import { useState, useEffect } from 'react';
import { MatchResult, Record } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle2, FileText, Calendar, User, ArrowRight } from 'lucide-react';
import { saveAs } from 'file-saver';

interface MatchedRecordsViewerProps {
  matchResults: MatchResult[];
  sourceRecords: Record[];
  targetRecords: Record[];
}

const MatchedRecordsViewer = ({ matchResults, sourceRecords, targetRecords }: MatchedRecordsViewerProps) => {
  const [matchedRecords, setMatchedRecords] = useState<Array<{
    matchResult: MatchResult;
    sourceRecord: Record | undefined;
    targetRecord: Record | undefined;
  }>>([]);

  useEffect(() => {
    // Filter only successfully matched records
    const successful = matchResults
      .filter(result => result.status === 'matched' && result.matchId)
      .map(result => ({
        matchResult: result,
        sourceRecord: sourceRecords.find(r => r.id === result.sourceId),
        targetRecord: targetRecords.find(r => r.id === result.matchId)
      }));

    setMatchedRecords(successful);
  }, [matchResults, sourceRecords, targetRecords]);

  const handleExportCSV = () => {
    if (matchedRecords.length === 0) return;

    // CSV headers
    const headers = [
      'Match Date',
      'Clinic Patient Name',
      'Clinic Patient Sex',
      'Clinic Patient Birth Date',
      'HDSS Match Name',
      'HDSS Match Sex',
      'HDSS Match Birth Date',
      'Confidence Score',
      'Matched By',
      'Notes'
    ];

    // CSV rows
    const rows = matchedRecords.map(({ matchResult, sourceRecord, targetRecord }) => [
      new Date(matchResult.matchedAt).toLocaleString(),
      `${sourceRecord?.firstName || ''} ${sourceRecord?.lastName || ''}`.trim(),
      sourceRecord?.sex || '',
      sourceRecord?.birthDate || '',
      `${targetRecord?.firstName || ''} ${targetRecord?.lastName || ''}`.trim(),
      targetRecord?.sex || '',
      targetRecord?.birthDate || '',
      matchResult.confidence || 0,
      matchResult.matchedBy || '',
      matchResult.notes || ''
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `matched_records_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportJSON = () => {
    if (matchedRecords.length === 0) return;

    const exportData = matchedRecords.map(({ matchResult, sourceRecord, targetRecord }) => ({
      matchDate: matchResult.matchedAt,
      clinicPatient: {
        id: sourceRecord?.id,
        name: `${sourceRecord?.firstName || ''} ${sourceRecord?.lastName || ''}`.trim(),
        sex: sourceRecord?.sex,
        birthDate: sourceRecord?.birthDate,
        village: sourceRecord?.village
      },
      hdssMatch: {
        id: targetRecord?.id,
        name: `${targetRecord?.firstName || ''} ${targetRecord?.lastName || ''}`.trim(),
        sex: targetRecord?.sex,
        birthDate: targetRecord?.birthDate,
        village: targetRecord?.village
      },
      confidence: matchResult.confidence,
      matchedBy: matchResult.matchedBy,
      notes: matchResult.notes
    }));

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `matched_records_${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Matched Records
            </CardTitle>
            <CardDescription>
              All successfully matched clinic records with HDSS database entries
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              disabled={matchedRecords.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleExportJSON}
              disabled={matchedRecords.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {matchedRecords.length > 0 ? (
          <div className="space-y-3">
            {matchedRecords.map(({ matchResult, sourceRecord, targetRecord }, idx) => (
              <div
                key={matchResult.sourceId + matchResult.matchId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      Match #{idx + 1}
                    </Badge>
                    <Badge variant="outline">
                      {matchResult.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(matchResult.matchedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  {/* Clinic Record */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Clinic Patient
                    </div>
                    <div className="font-semibold">
                      {sourceRecord?.firstName} {sourceRecord?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sourceRecord?.sex} • {sourceRecord?.birthDate}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {sourceRecord?.village || 'No village'}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-green-600" />

                  {/* HDSS Match */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      HDSS Match
                    </div>
                    <div className="font-semibold">
                      {targetRecord?.firstName} {targetRecord?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {targetRecord?.sex} • {targetRecord?.birthDate}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {targetRecord?.village || 'No village'}
                    </div>
                  </div>
                </div>

                {matchResult.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Notes: </span>
                        <span className="text-muted-foreground">{matchResult.notes}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No Matched Records Yet</p>
            <p className="text-sm">
              Successfully matched records will appear here with export options.
            </p>
          </div>
        )}

        {matchedRecords.length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Total matched: <strong className="text-foreground">{matchedRecords.length}</strong> record(s)
            </div>
            <div>
              Export available in CSV or JSON format
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchedRecordsViewer;
