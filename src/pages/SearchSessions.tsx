/**
 * Search Sessions & Failed Matches Page
 * View all search attempts and export failed matches
 */

import { useState, useEffect } from 'react';
import {
  getSearchSessions,
  getFailedMatches,
  exportFailedMatches,
  getSearchStatistics
} from '@/services/searchSessionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Download, Search, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveAs } from 'file-saver';

export default function SearchSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [failedMatches, setFailedMatches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const searchSessions = getSearchSessions(100);
    const failed = getFailedMatches(100);
    const statistics = getSearchStatistics();

    setSessions(searchSessions);
    setFailedMatches(failed);
    setStats(statistics);
  };

  const handleExportFailed = () => {
    const csv = exportFailedMatches();
    const blob = new Blob([csv], { type: 'text/csv' });
    const filename = `failed_matches_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, filename);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'matched':
        return 'default';
      case 'not_matched':
        return 'destructive';
      case 'manual_review':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'matched':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'not_matched':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'manual_review':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Sessions & Failed Matches</h1>
        <p className="text-muted-foreground mt-2">
          View search history and export failed linkages for analysis
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSearches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.matchRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">{stats.matchedCount} matched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failedMatchesCount}
              </div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.averageConfidence.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">
            Search Sessions ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed Matches ({failedMatches.length})
          </TabsTrigger>
        </TabsList>

        {/* Search Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Search Sessions</CardTitle>
              <CardDescription>All search attempts with timestamps and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Search Criteria</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No search sessions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(session.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {session.searchCriteria.firstName} {session.searchCriteria.lastName}
                          {session.searchCriteria.village && ` - ${session.searchCriteria.village}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getOutcomeIcon(session.outcome)}
                            <Badge variant={getOutcomeColor(session.outcome) as any}>
                              {session.outcome.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{session.matchCount}</TableCell>
                        <TableCell>
                          {session.confidence ? `${session.confidence.toFixed(1)}%` : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Matches Tab */}
        <TabsContent value="failed" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Failed Matches</CardTitle>
                  <CardDescription>
                    Records that could not be matched - export for further analysis
                  </CardDescription>
                </div>
                <Button onClick={handleExportFailed} disabled={failedMatches.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Best Match</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedMatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No failed matches - Great job!
                      </TableCell>
                    </TableRow>
                  ) : (
                    failedMatches.map((failed) => (
                      <TableRow key={failed.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(failed.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {failed.sourceRecord.firstName} {failed.sourceRecord.lastName}
                        </TableCell>
                        <TableCell className="text-sm">
                          {failed.sourceRecord.birthDate || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {failed.sourceRecord.village || '-'}
                        </TableCell>
                        <TableCell>{failed.attemptedMatches}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{failed.highestConfidence.toFixed(1)}%</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {failed.reason.replace(/_/g, ' ')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
