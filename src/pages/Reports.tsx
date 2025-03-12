import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { RecordDataProvider } from '@/contexts/record-data/RecordDataContext';
import { MatchResult } from '@/types';
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/reports/columns"
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';

const Reports = () => {
  const { matchResults, clinicRecords, communityRecords } = useRecordData();
  const [data, setData] = useState<MatchResult[]>([]);

  useEffect(() => {
    // Prepare data for the table
    const preparedData: MatchResult[] = matchResults.map(match => {
      const clinicRecord = clinicRecords.find(record => record.id === match.sourceId);
      const communityRecord = communityRecords.find(record => record.id === match.matchId);

      return {
        ...match,
        clinicFirstName: clinicRecord?.firstName || 'N/A',
        clinicLastName: clinicRecord?.lastName || 'N/A',
        communityFirstName: communityRecord?.firstName || 'N/A',
        communityLastName: communityRecord?.lastName || 'N/A',
      };
    });

    setData(preparedData);
  }, [matchResults, clinicRecords, communityRecords]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">A comprehensive overview of matched records.</p>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Reports;
