
import { useState, useEffect } from 'react';
import { useRecordData } from '@/contexts/RecordDataContext';
import { FileText, ChartBar, CheckCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchResult } from '@/types';
import StatCard from '@/components/StatCard';
import Navbar from '@/components/Navbar';

const Reports = () => {
  const { matchResults, communityRecords, clinicRecords } = useRecordData();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMatches: 0,
    highConfidenceMatches: 0, 
    mediumConfidenceMatches: 0,
    lowConfidenceMatches: 0,
    averageConfidence: 0,
    matchRate: 0
  });

  useEffect(() => {
    if (matchResults.length > 0) {
      const highConfidence = matchResults.filter(match => match.confidence >= 80).length;
      const mediumConfidence = matchResults.filter(match => match.confidence >= 60 && match.confidence < 80).length;
      const lowConfidence = matchResults.filter(match => match.confidence < 60).length;
      const avgConfidence = matchResults.reduce((sum, match) => sum + (match.confidence || 0), 0) / matchResults.length;
      
      // Calculate match rate (percentage of records that have matches)
      const totalRecords = clinicRecords.length;
      const matchRate = totalRecords > 0 ? (matchResults.length / totalRecords) * 100 : 0;
      
      setStats({
        totalMatches: matchResults.length,
        highConfidenceMatches: highConfidence,
        mediumConfidenceMatches: mediumConfidence,
        lowConfidenceMatches: lowConfidence,
        averageConfidence: avgConfidence,
        matchRate: matchRate
      });
    }
  }, [matchResults, clinicRecords.length]);

  const handleExportCSV = () => {
    // Function to create and download CSV of match data
    const headers = [
      'Source Record ID',
      'Match Record ID',
      'Match Status',
      'Confidence Score',
      'Matched By',
      'Matched At',
      'Consent Obtained',
      'Notes'
    ].join(',');
    
    const csvData = matchResults.map((match: MatchResult) => {
      return [
        match.sourceId,
        match.matchId || 'N/A',
        match.status,
        match.confidence || 0,
        match.matchedBy,
        match.matchedAt,
        match.consentObtained ? 'Yes' : 'No',
        (match.notes || '').replace(/,/g, ';').replace(/\n/g, ' ')
      ].join(',');
    }).join('\n');
    
    const csvContent = `${headers}\n${csvData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `match_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <FileText className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">Match Reports</h1>
          </div>
          <Button onClick={handleExportCSV} className="sm:self-end">
            <Download className="mr-1" />
            Export to CSV
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Match Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Matched Records"
                value={stats.totalMatches}
                icon={<CheckCheck className="h-4 w-4" />}
                color="primary"
              />
              <StatCard
                title="Match Rate"
                value={stats.matchRate.toFixed(1)}
                description="Percentage of records with matches"
                isPercentage={true}
                color="success"
              />
              <StatCard
                title="Average Confidence"
                value={stats.averageConfidence.toFixed(1)}
                isPercentage={true}
                color="warning"
              />
              <StatCard
                title="High Confidence Matches"
                value={stats.highConfidenceMatches}
                description="Matches with ≥80% confidence"
                color="success"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Match Confidence Distribution</CardTitle>
                <CardDescription>
                  Breakdown of matches by confidence level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Confidence (≥80%)</span>
                    <span className="text-sm font-medium text-success">{stats.highConfidenceMatches}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success" 
                      style={{ 
                        width: `${stats.totalMatches > 0 ? (stats.highConfidenceMatches / stats.totalMatches) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Confidence (60-79%)</span>
                    <span className="text-sm font-medium text-amber-500">{stats.mediumConfidenceMatches}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ 
                        width: `${stats.totalMatches > 0 ? (stats.mediumConfidenceMatches / stats.totalMatches) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Confidence (&lt;60%)</span>
                    <span className="text-sm font-medium text-destructive">{stats.lowConfidenceMatches}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive" 
                      style={{ 
                        width: `${stats.totalMatches > 0 ? (stats.lowConfidenceMatches / stats.totalMatches) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Match Details</CardTitle>
                <CardDescription>
                  All successfully matched records with matching details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {matchResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Source ID</th>
                          <th className="py-2 px-4 text-left">Match ID</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Confidence</th>
                          <th className="py-2 px-4 text-left">Matched On</th>
                          <th className="py-2 px-4 text-left">Date Matched</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchResults.map((match: MatchResult, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{match.sourceId}</td>
                            <td className="py-3 px-4">{match.matchId || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                match.status === 'matched' ? 'bg-green-100 text-green-800' : 
                                match.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {match.confidence ? (
                                <span className={`font-medium ${
                                  match.confidence >= 80 ? 'text-success' : 
                                  match.confidence >= 60 ? 'text-amber-500' : 
                                  'text-destructive'
                                }`}>
                                  {match.confidence}%
                                </span>
                              ) : 'N/A'}
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate">
                              {match.fieldScores ? 
                                Object.keys(match.fieldScores).filter(
                                  field => match.fieldScores && match.fieldScores[field] > 80
                                ).join(', ') : 
                                'N/A'
                              }
                            </td>
                            <td className="py-3 px-4">
                              {new Date(match.matchedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ChartBar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Match Data Available</h3>
                    <p className="text-muted-foreground mt-2">
                      Process some records to generate match statistics and details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
