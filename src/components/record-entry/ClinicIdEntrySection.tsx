
import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { useRecordData } from '@/contexts/RecordDataContext';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/alert';
import { Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ClinicIdEntrySectionProps {
  clinicIds: Array<{ type: string; value: string }>;
  handleClinicIdChange: (index: number, field: 'type' | 'value', value: string) => void;
  addClinicId: () => void;
  removeClinicId: (index: number) => void;
  onPatientFound: (record: Record) => void;
  inputLanguage: SupportedLanguage;
}

const ClinicIdEntrySection = ({
  clinicIds,
  handleClinicIdChange,
  addClinicId,
  removeClinicId,
  onPatientFound,
  inputLanguage
}: ClinicIdEntrySectionProps) => {
  const { clinicRecords } = useRecordData();
  const [isSearching, setIsSearching] = useState(false);
  const [isRepeatPatient, setIsRepeatPatient] = useState(false);
  const [repeatPatientRecord, setRepeatPatientRecord] = useState<Record | null>(null);
  const [showRepeatDialog, setShowRepeatDialog] = useState(false);
  const { toast } = useToast();

  // Function to search for patient by clinic ID
  const searchByClinicId = () => {
    setIsSearching(true);
    
    // Find any valid clinic IDs to search by
    const validClinicIds = clinicIds.filter(id => id.type && id.value);
    
    if (validClinicIds.length === 0) {
      toast({
        title: "No Valid Clinic IDs",
        description: "Please enter at least one clinic ID to search.",
        variant: "destructive"
      });
      setIsSearching(false);
      return;
    }
    
    // Search the existing clinic records for matching IDs
    const matchedRecords = clinicRecords.filter(record => {
      if (!record.identifiers) return false;
      
      return record.identifiers.some(identifier => 
        validClinicIds.some(clinicId => 
          identifier.type === clinicId.type && 
          identifier.value === clinicId.value
        )
      );
    });
    
    if (matchedRecords.length > 0) {
      const foundRecord = matchedRecords[0]; // Take the first match
      setRepeatPatientRecord(foundRecord);
      setIsRepeatPatient(true);
      setShowRepeatDialog(true);
    } else {
      toast({
        title: "New Patient",
        description: "No matching records found. This appears to be a new patient.",
      });
    }
    
    setIsSearching(false);
  };
  
  const handleConfirmRepeatPatient = () => {
    if (repeatPatientRecord) {
      onPatientFound(repeatPatientRecord);
    }
    setShowRepeatDialog(false);
  };
  
  return (
    <div className="bg-muted/20 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-md font-medium text-primary">
          {inputLanguage === 'latin' ? 'Clinic IDs' : 
          inputLanguage === 'amharic' ? 'የክሊኒክ መታወቂያዎች' : 'መለለይ ክሊኒክ'}
        </h4>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addClinicId}
            className="text-xs"
          >
            + {inputLanguage === 'latin' ? 'Add Another' : 
              inputLanguage === 'amharic' ? 'ሌላ ጨምር' : 'ካልእ ወስኽ'}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={searchByClinicId}
            disabled={isSearching}
            className="text-xs"
          >
            <Search className="w-3 h-3 mr-1" />
            {inputLanguage === 'latin' ? 'Search Patient' : 
             inputLanguage === 'amharic' ? 'ታካሚ ፈልግ' : 'ሕሙም ድለ'}
          </Button>
        </div>
      </div>
      
      <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {inputLanguage === 'latin' ? 'Important' : 
          inputLanguage === 'amharic' ? 'አስፈላጊ' : 'ኣገዳሲ'}
        </AlertTitle>
        <AlertDescription>
          {inputLanguage === 'latin' ? 
            'First collect all clinic IDs, then search to check if this is a new or repeat patient.' : 
          inputLanguage === 'amharic' ? 
            'መጀመሪያ ሁሉንም የክሊኒክ መታወቂያዎች ይሰብስቡ፣ ከዚያ ይህ አዲስ ወይም ድጋሚ ታካሚ ከሆነ ለማረጋገጥ ይፈልጉ።' : 
            'ቀዳማይ ንዅሉ መለለይታት ክሊኒክ ኣከብ፣ ሽዑ ኣብ ክንደይ እዚ ሓድሽ ወይ ዳግማይ ሕሙም ምዃኑ ክትረጋገጽ ድለ።'}
        </AlertDescription>
      </Alert>
      
      {clinicIds.map((id, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <select
            value={id.type}
            onChange={(e) => handleClinicIdChange(index, 'type', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-primary/30 w-1/3"
          >
            <option value="none">
              {inputLanguage === 'latin' ? 'Select Type' : 
              inputLanguage === 'amharic' ? 'ዓይነት ይምረጡ' : 'ዓይነት ምረጽ'}
            </option>
            <option value="CTC ID">CTC ID</option>
            <option value="ANC ID">ANC ID</option>
            <option value="HTC ID">HTC ID</option>
            <option value="OPD ID">OPD ID</option>
            <option value="PMTCT ID">PMTCT ID</option>
          </select>
          <Input
            type="text"
            value={id.value}
            onChange={(e) => handleClinicIdChange(index, 'value', e.target.value)}
            className="flex-1"
            placeholder={
              inputLanguage === 'latin' ? 'Enter ID number' : 
              inputLanguage === 'amharic' ? 'የመታወቂያ ቁጥር ያስገቡ' : 'ቁጽሪ መለለዪ የእቱ'
            }
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-md p-0 text-destructive hover:bg-destructive/10"
            onClick={() => removeClinicId(index)}
            disabled={clinicIds.length <= 1}
          >
            ✕
          </Button>
        </div>
      ))}

      {/* Repeat Patient Dialog */}
      <Dialog open={showRepeatDialog} onOpenChange={setShowRepeatDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              {inputLanguage === 'latin' ? 'Repeat Patient Found' : 
               inputLanguage === 'amharic' ? 'ድጋሚ ታካሚ ተገኝቷል' : 'ዳግማይ ሕሙም ተረኺቡ'}
            </DialogTitle>
            <DialogDescription>
              {inputLanguage === 'latin' ? 
                'This appears to be a repeat patient. Personal identifiers will be automatically filled in.' : 
               inputLanguage === 'amharic' ? 
                'ይህ ድጋሚ ታካሚ ይመስላል። የግል መለያዎች በራስ-ሰር ይሞላሉ።' : 
                'እዚ ዳግማይ ሕሙም ይመስል። ውልቃዊ መለለይታት ብኣውቶማቲክ ኪመልኡ ኢዮም።'}
            </DialogDescription>
          </DialogHeader>
          
          {repeatPatientRecord && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {inputLanguage === 'latin' ? 'Name:' : 
                   inputLanguage === 'amharic' ? 'ስም:' : 'ሽም:'}
                </span>
                <span className="font-medium">
                  {repeatPatientRecord.firstName} {repeatPatientRecord.middleName || ''} {repeatPatientRecord.lastName}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {inputLanguage === 'latin' ? 'Gender:' : 
                   inputLanguage === 'amharic' ? 'ፆታ:' : 'ጾታ:'}
                </span>
                <span>{repeatPatientRecord.gender}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {inputLanguage === 'latin' ? 'Birth Date:' : 
                   inputLanguage === 'amharic' ? 'የትውልድ ቀን:' : 'ዕለተ ልደት:'}
                </span>
                <span>{repeatPatientRecord.birthDate}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {inputLanguage === 'latin' ? 'Village:' : 
                   inputLanguage === 'amharic' ? 'መንደር:' : 'ዓዲ:'}
                </span>
                <span>{repeatPatientRecord.village || '-'}</span>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRepeatDialog(false)}
                >
                  {inputLanguage === 'latin' ? 'Cancel' : 
                   inputLanguage === 'amharic' ? 'ይቅር' : 'ኣትፈቅድ'}
                </Button>
                <Button 
                  variant="default"
                  onClick={handleConfirmRepeatPatient}
                >
                  {inputLanguage === 'latin' ? 'Use This Record' : 
                   inputLanguage === 'amharic' ? 'ይህን መዝገብ ይጠቀሙ' : 'እዚ መዝገብ ተጠቐም'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicIdEntrySection;
