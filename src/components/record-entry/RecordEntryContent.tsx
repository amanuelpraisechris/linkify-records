
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecordEntryTab from './RecordEntryTab';
import { Navbar } from '@/components/navbar';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface RecordEntryContentProps {
  onRecordCreated?: () => void;
}

// Since RecordEntryTab requires specific props, let's create an interface for it
interface TabProps {
  // This is a simple representation - adjust based on the actual requirements
  name: string;
}

const RecordEntryContent = ({ onRecordCreated }: RecordEntryContentProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const { state } = useRecordData(); // Using 'state' instead of 'recordData'
  const { toast } = useToast();

  const handleSubmit = () => {
    if (state) { // Using 'state' instead of 'recordData'
      console.log('Record Data:', state);
      toast({
        title: "Success!",
        description: "Record submitted successfully.",
      })
      if (onRecordCreated) {
        onRecordCreated();
      }
    } else {
      console.error('No record data to submit.');
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to submit record.",
      })
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Enter New Record
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill in the details below to create a new record.
        </p>
      </div>

      {!state && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please fill out all tabs to create a new record.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <RecordEntryTab name="personal" />
        </TabsContent>
        <TabsContent value="education">
          <RecordEntryTab name="education" />
        </TabsContent>
        <TabsContent value="experience">
          <RecordEntryTab name="experience" />
        </TabsContent>
        <TabsContent value="skills">
          <RecordEntryTab name="skills" />
        </TabsContent>
      </Tabs>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Submit Record
      </button>
    </div>
  );
};

export default RecordEntryContent;
