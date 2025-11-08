/**
 * Database Module
 * Manage the Community Database (HDSS Database) - the target for matching
 */

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { Record } from '@/types';
import DataLoader from '@/components/DataLoader';
import RecordList from '@/components/RecordList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database as DatabaseIcon, Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Database = () => {
  const { communityRecords, addImportedRecords, clearImportedRecords } = useRecordData();
  const { toast } = useToast();
  const [showDataLoader, setShowDataLoader] = useState(false);

  const handleDatabaseImport = async (newRecords: Record[]) => {
    try {
      // Mark all records with community database source
      const markedRecords = newRecords.map(record => ({
        ...record,
        metadata: {
          ...record.metadata,
          source: 'HDSS Database'
        }
      }));

      await addImportedRecords(markedRecords, true); // true = isMainCommunityData

      toast({
        title: "Community Database Imported",
        description: `Successfully imported ${newRecords.length} records as the community database.`,
      });

      setShowDataLoader(false);
    } catch (error) {
      console.error('Error importing database:', error);
      toast({
        title: "Import Error",
        description: "Failed to import community database.",
        variant: "destructive"
      });
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm(`Are you sure you want to clear the entire community database? This will remove ${communityRecords.length} records.`)) {
      return;
    }

    try {
      await clearImportedRecords();
      toast({
        title: "Database Cleared",
        description: "Community database has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Clear Error",
        description: "Failed to clear database.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <DatabaseIcon className="w-8 h-8" />
              Community Database
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage the HDSS community database - the target dataset for matching clinic records against.
              This is your master database that clinic records will be linked to.
            </p>
          </div>
        </div>
      </div>

      {/* Database Status Alert */}
      {communityRecords.length > 0 ? (
        <Alert className="mb-6 border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">Database Active</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Community database loaded with {communityRecords.length.toLocaleString()} records.
            Ready for matching operations.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">No Database Loaded</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            No community database is currently loaded. Import a database to enable matching operations.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Database Management Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Import or update the community database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDataLoader ? (
                <>
                  <Button
                    onClick={() => setShowDataLoader(true)}
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {communityRecords.length > 0 ? 'Update Database' : 'Import Database'}
                  </Button>

                  {communityRecords.length > 0 && (
                    <>
                      <Button
                        onClick={() => setShowDataLoader(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Replace Database
                      </Button>

                      <Button
                        onClick={handleClearDatabase}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Database
                      </Button>
                    </>
                  )}

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Database Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Records:</span>
                        <span className="font-medium">{communityRecords.length.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={communityRecords.length > 0 ? "text-green-600 font-medium" : "text-yellow-600"}>
                          {communityRecords.length > 0 ? 'Active' : 'Not Loaded'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowDataLoader(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <DataLoader
                    onDataLoaded={handleDatabaseImport}
                    dataSource={{
                      id: 'community-database',
                      name: 'Community Database (HDSS)',
                      recordCount: communityRecords.length,
                      lastUpdated: new Date().toISOString(),
                      type: 'community'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">About Community Database</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                The community database is the master dataset containing all community members from the HDSS (Health and Demographic Surveillance System).
              </p>
              <p>
                When you search for or match clinic records, they will be compared against this database to find existing community members.
              </p>
              <p className="font-medium text-foreground">
                Supported formats: CSV, JSON
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Database Records View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Database Records ({communityRecords.length})</CardTitle>
              <CardDescription>
                Browse all records in the community database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {communityRecords.length > 0 ? (
                <div className="max-h-[600px] overflow-y-auto">
                  <RecordList
                    records={communityRecords}
                    emptyMessage="No records in the database"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <DatabaseIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No Database Loaded</p>
                  <p className="text-sm">
                    Import a community database to get started with record matching.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Database;
