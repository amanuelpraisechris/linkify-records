
import { useState } from 'react';
import { AlertTriangle, Save, FileX, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Record } from '@/types';
import { databaseService } from '@/services/database';
import { useToast } from '@/components/ui/use-toast';

interface NoMatchHandlerProps {
  record: Record;
  reason: 'no_suitable_match' | 'low_confidence' | 'manual_review_required';
  onSaveComplete: () => void;
  onReturnToEntry: () => void;
}

const NoMatchHandler = ({ record, reason, onSaveComplete, onReturnToEntry }: NoMatchHandlerProps) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveUnmatched = async () => {
    setIsSaving(true);
    try {
      // First save the clinic record
      await databaseService.insertClinicRecord(record);
      
      // Then save it as an unmatched record for review
      await databaseService.saveUnmatchedRecord(record.id, record, reason);
      
      toast({
        title: "Record Saved Successfully",
        description: "The patient record has been saved and flagged for manual review.",
      });
      
      onSaveComplete();
    } catch (error) {
      console.error('Error saving unmatched record:', error);
      toast({
        title: "Save Error",
        description: "Failed to save the record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getReasonDisplay = () => {
    switch (reason) {
      case 'no_suitable_match':
        return {
          title: 'No Matching Records Found',
          description: 'No records in the HDSS database match this patient\'s information.',
          icon: <FileX className="h-6 w-6 text-orange-600" />
        };
      case 'low_confidence':
        return {
          title: 'Low Confidence Matches',
          description: 'Potential matches found but confidence scores are below the threshold.',
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />
        };
      case 'manual_review_required':
        return {
          title: 'Manual Review Required',
          description: 'Multiple potential matches require human review to determine the best match.',
          icon: <Archive className="h-6 w-6 text-blue-600" />
        };
    }
  };

  const reasonInfo = getReasonDisplay();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {reasonInfo.icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {reasonInfo.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {reasonInfo.description}
        </p>
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required</AlertTitle>
        <AlertDescription>
          This patient record needs to be saved to prevent data loss. The record will be flagged for manual review by a supervisor.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Patient Record Summary</CardTitle>
          <CardDescription>
            Please review the patient information before saving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {record.firstName} {record.middleName} {record.lastName}
            </div>
            <div>
              <span className="font-medium">Sex:</span> {record.sex}
            </div>
            <div>
              <span className="font-medium">Birth Date:</span> {record.birthDate}
            </div>
            <div>
              <span className="font-medium">Village:</span> {record.village || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Sub-village:</span> {record.subVillage || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Health Facility:</span> {record.healthFacility || 'Not specified'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
          <CardDescription>
            Add any additional information that might help with manual review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any additional notes about this patient or why matching was difficult..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-300 dark:bg-blue-950/20">
        <Save className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">
          Save Record for Manual Review
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          The record will be saved to the clinic database and flagged for manual review. 
          A supervisor can later review and attempt to find matches manually.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onReturnToEntry}>
          Return to Entry
        </Button>
        <Button 
          onClick={handleSaveUnmatched}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Record'}
        </Button>
      </div>
    </div>
  );
};

export default NoMatchHandler;
