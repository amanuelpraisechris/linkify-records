
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataLoader from '@/components/DataLoader';
import { Record, DataSource } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Database, FileUp, Users, ArrowLeft, CheckCircle, ArrowRight, HelpCircle, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecordDataProvider, useRecordData } from '@/contexts/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DataManagementContent = () => {
  const { addImportedRecords, communityRecords, importedRecords } = useRecordData();
  const [dataImported, setDataImported] = useState(false);
  const [showExportGuide, setShowExportGuide] = useState(false);
  const { toast } = useToast();
  
  // Check if data is already loaded
  useEffect(() => {
    if (communityRecords.length > 0) {
      setDataImported(true);
      console.log(`Data already loaded: ${communityRecords.length} community records`);
    }
  }, [communityRecords.length]);
  
  const handleDataLoaded = (data: Record[], sourceId?: string) => {
    console.log('Data loaded:', data.length, 'records');
    
    // Add to record data context for matching - set as community database
    const isCommunityDb = true; // Always set imported data as community database
    addImportedRecords(data, isCommunityDb);
    setDataImported(true);
    
    toast({
      title: "Data Imported Successfully",
      description: `${data.length} records have been imported as the main HDSS community database and will persist between pages.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Management</h1>
          <p className="text-lg text-muted-foreground">
            Import external databases for record matching
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-8">
              <div className="flex items-center mb-4">
                <FileUp className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Import HDSS Community Database</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Upload your HDSS community database or health facility records for patient matching.
                The data will be set as the main reference database for finding matches.
              </p>
              
              {communityRecords.length > 0 && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Community Database Loaded</AlertTitle>
                  <AlertDescription>
                    {communityRecords.length} records have been imported as the main HDSS community database and are ready for matching. 
                    This data will persist as you navigate between pages.
                  </AlertDescription>
                </Alert>
              )}

              {/* SQL Export Guide Toggle Button */}
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowExportGuide(!showExportGuide)}
                  className="text-sm"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  {showExportGuide ? "Hide SQL Export Guide" : "Using SQL Database?"}
                </Button>
              </div>
              
              {/* SQL Export Guide */}
              {showExportGuide && (
                <div className="mb-6 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Database className="w-4 h-4 mr-1 text-primary" />
                    SQL Database Export Guide
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="sql-server">
                      <AccordionTrigger className="text-sm font-medium">
                        Microsoft SQL Server
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>To export data from SQL Server to a compatible format:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                          <li>Open SQL Server Management Studio (SSMS)</li>
                          <li>Right-click your database and select Tasks → Export Data</li>
                          <li>Choose "Flat File Destination" and select CSV format</li>
                          <li>Select the tables you want to export</li>
                          <li>Configure column mappings if needed</li>
                          <li>Complete the wizard to export your data to CSV</li>
                        </ol>
                        <div className="pt-2">
                          <p className="font-medium">Alternative method (with SQL query):</p>
                          <pre className="bg-muted p-2 rounded text-xs mt-1 overflow-x-auto">
                            {`SELECT * 
FROM YourTable
FOR XML PATH('record'), ROOT('records')`}
                          </pre>
                          <p className="mt-1">This exports data in XML format that can be converted to JSON.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mysql">
                      <AccordionTrigger className="text-sm font-medium">
                        MySQL / MariaDB
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>Export your MySQL data to CSV:</p>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {`SELECT * 
INTO OUTFILE 'C:/output/data.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
FROM your_table;`}
                        </pre>
                        <p>Or use the MySQL Workbench export functionality:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                          <li>Right-click on your table in MySQL Workbench</li>
                          <li>Select "Table Data Export Wizard"</li>
                          <li>Choose CSV as the output format</li>
                          <li>Follow the prompts to complete the export</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="postgresql">
                      <AccordionTrigger className="text-sm font-medium">
                        PostgreSQL
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>Export PostgreSQL data to CSV:</p>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {`COPY (SELECT * FROM your_table) 
TO 'C:/output/data.csv' 
WITH CSV HEADER;`}
                        </pre>
                        <p>Or use the pgAdmin tool:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                          <li>Right-click your table in pgAdmin</li>
                          <li>Select "Import/Export"</li>
                          <li>Choose "Export" and select CSV format</li>
                          <li>Configure options as needed</li>
                          <li>Click "OK" to export</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="oracle">
                      <AccordionTrigger className="text-sm font-medium">
                        Oracle Database
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>Using SQL Developer for export:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                          <li>Run a query to get your data</li>
                          <li>Right-click on results and select "Export"</li>
                          <li>Choose CSV or Excel format</li>
                          <li>Configure export options</li>
                          <li>Click "Next" and then "Finish"</li>
                        </ol>
                        <p className="pt-1">Using SQL*Plus:</p>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {`SET MARKUP CSV ON
SPOOL data.csv
SELECT * FROM your_table;
SPOOL OFF`}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="mt-4 flex items-start gap-3 pt-2 border-t">
                    <FileSpreadsheet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recommended Format for Import</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Export your SQL data to CSV, JSON, or Excel format. Make sure to include column headers and 
                        that your data includes key patient identifiers (names, birth dates, gender, location).
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <DataLoader onDataLoaded={handleDataLoaded} />
            </div>
            
            {communityRecords.length > 0 && (
              <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Next Steps</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Your HDSS community database has been successfully imported with {communityRecords.length} records.
                  This data is now stored and will be available when you navigate to the Record Entry page.
                </p>
                
                <div className="p-4 bg-muted/30 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">What to do next:</h3>
                  <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-2">
                    <li>Go to the <Link to="/record-entry" className="text-primary hover:underline">Record Entry</Link> page</li>
                    <li>Enter patient information to search for in the HDSS database</li>
                    <li>Review potential matches that are found</li>
                  </ol>
                </div>
                
                <Link 
                  to="/record-entry" 
                  className="w-full bg-primary text-white py-2 px-4 rounded-md inline-flex items-center justify-center hover:bg-primary/90"
                >
                  Go to Record Entry Page
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Data Tips</h2>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Required Fields</h3>
                  <p className="text-muted-foreground">
                    For optimal matching, ensure your data includes at minimum:
                    name, gender, date of birth, and location information.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Data Format</h3>
                  <p className="text-muted-foreground mb-2">
                    CSV files should include headers as the first row. JSON files should contain an array of record objects.
                    Excel files should have headers in the first row.
                  </p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {`[
  {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1985-07-15",
    "gender": "Male",
    "village": "Maputo"
  }
]`}
                  </pre>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Matching Process</h3>
                  <p className="text-muted-foreground">
                    The system uses probabilistic matching to identify potential matches based on
                    similarity scores. Fields like names, birth dates, and locations are compared for potential matches.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Supported File Types</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">CSV</span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">JSON</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">Excel</span>
                  </div>
                  <p className="text-muted-foreground">
                    We support multiple file formats to make importing your data as easy as possible.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Data Conversion</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                If your database is in a format not directly supported (like .bak files), please export to one of our supported formats:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 border rounded-md">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md mr-3">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">SQL → CSV/Excel</h3>
                    <p className="text-xs text-muted-foreground">Most database systems have built-in export tools</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-md mr-3">
                    <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">SQL → JSON</h3>
                    <p className="text-xs text-muted-foreground">Use FOR JSON or JSON_OBJECT functions in your queries</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full text-sm mt-1"
                  onClick={() => setShowExportGuide(true)}
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  View Detailed Export Instructions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DataManagement = () => {
  return (
    <MatchingConfigProvider>
      <RecordDataProvider>
        <DataManagementContent />
      </RecordDataProvider>
    </MatchingConfigProvider>
  );
};

export default DataManagement;
