
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useRecordData } from '@/contexts/RecordDataContext';
import { DatabaseIcon, FileDownIcon, ShieldIcon } from 'lucide-react';
import { generateSessionId, exportDataToCSV } from '@/utils/exportDataUtils';
import { visitByOptions } from '@/utils/recordConstants';
import { Visit } from '@/types';

// Generate mock visits for testing
const generateMockVisits = (count: number): Visit[] => {
  return Array.from({ length: count }).map((_, index) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
    
    // Ensure we use the correct type for visitBy
    const visitByOption = Math.random() > 0.5 ? 'PATIENT' : 'TREATMENT SUPPORTER';
    
    return {
      id: `visit-${index}`,
      date: randomDate.toISOString().split('T')[0],
      visitBy: visitByOption as 'PATIENT' | 'TREATMENT SUPPORTER',
      clinicId: `clinic-${Math.floor(Math.random() * 100)}`,
      facility: Math.random() > 0.5 ? 'Clinic A' : 'Clinic B'
    };
  });
};

const DataExport = () => {
  const { toast } = useToast();
  const { clinicRecords, communityRecords, matchResults } = useRecordData();
  const [includeRegistry, setIncludeRegistry] = useState(true);
  const [includeMatches, setIncludeMatches] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeVisits, setIncludeVisits] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // For demo purposes, generate mock visits
  const mockVisits = generateMockVisits(clinicRecords.length * 2);
  
  const handleExport = async () => {
    if (!includeRegistry && !includeMatches && !includeNotes && !includeVisits) {
      toast({
        title: "No tables selected",
        description: "Please select at least one table to export",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Generate a session ID to link records across tables
      const sessionId = generateSessionId();
      
      // Export the data
      exportDataToCSV(
        clinicRecords,
        matchResults,
        mockVisits,
        {
          includeRegistry,
          includeMatches, 
          includeNotes,
          includeVisits
        }
      );
      
      toast({
        title: "Export successful",
        description: `Data exported successfully with session ID: ${sessionId}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DatabaseIcon className="mr-2 h-5 w-5" />
          Export Data Tables
        </CardTitle>
        <CardDescription>
          Export your data in structured tables for analysis and backup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="includeRegistry" 
                checked={includeRegistry} 
                onCheckedChange={(checked) => setIncludeRegistry(!!checked)} 
              />
              <div className="space-y-1">
                <label 
                  htmlFor="includeRegistry" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Registry Table
                </label>
                <p className="text-sm text-muted-foreground">
                  Patient details and clinic identifiers
                </p>
                <p className="text-xs text-muted-foreground">
                  {clinicRecords.length} records available
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="includeMatches" 
                checked={includeMatches} 
                onCheckedChange={(checked) => setIncludeMatches(!!checked)} 
              />
              <div className="space-y-1">
                <label 
                  htmlFor="includeMatches" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Matches Table
                </label>
                <p className="text-sm text-muted-foreground">
                  HDSS matches with scores and rankings
                </p>
                <p className="text-xs text-muted-foreground">
                  {matchResults.length} matches available
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="includeNotes" 
                checked={includeNotes} 
                onCheckedChange={(checked) => setIncludeNotes(!!checked)} 
              />
              <div className="space-y-1">
                <label 
                  htmlFor="includeNotes" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notes Table
                </label>
                <p className="text-sm text-muted-foreground">
                  Match notes created during interviews
                </p>
                <p className="text-xs text-muted-foreground">
                  {matchResults.filter(m => m.notes && m.notes.trim() !== '').length} notes available
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="includeVisits" 
                checked={includeVisits} 
                onCheckedChange={(checked) => setIncludeVisits(!!checked)} 
              />
              <div className="space-y-1">
                <label 
                  htmlFor="includeVisits" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Visits Table
                </label>
                <p className="text-sm text-muted-foreground">
                  Patient visit dates and details
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockVisits.length} visits available
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md flex items-center text-sm">
            <ShieldIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">
              Password protection for exported files will be available in phase 2.
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || (!includeRegistry && !includeMatches && !includeNotes && !includeVisits)}
          className="w-full sm:w-auto"
        >
          <FileDownIcon className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Selected Tables"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataExport;
