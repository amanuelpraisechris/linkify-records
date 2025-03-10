
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ConsentTabProps {
  consentGiven: boolean;
  setConsentGiven: (checked: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const ConsentTab = ({ consentGiven, setConsentGiven, setActiveTab }: ConsentTabProps) => {
  return (
    <div className="bg-white dark:bg-black border rounded-xl p-6 shadow-subtle space-y-4">
      <h3 className="text-xl font-semibold mb-2">Patient Consent for Record Linkage</h3>
      <p className="text-muted-foreground">
        Before linking patient records, you must obtain and document the patient's consent to link their clinical data with their HDSS record.
      </p>
      
      <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-800 dark:text-amber-300">
        <h4 className="font-semibold mb-1">Consent Process</h4>
        <p className="text-sm">
          Please read the following to the patient:
        </p>
        <p className="text-sm mt-2 italic">
          "We would like to link your clinical records with your community demographic records to improve healthcare coordination. This will help us better understand health patterns in your community and improve services. Your information will remain confidential and only authorized personnel will have access. Do you consent to this linkage?"
        </p>
      </div>
      
      <div className="flex items-start space-x-2 pt-4">
        <Checkbox 
          id="consent" 
          checked={consentGiven} 
          onCheckedChange={(checked) => setConsentGiven(checked === true)}
        />
        <div className="grid gap-1.5">
          <Label htmlFor="consent" className="font-medium">
            I confirm that the patient has given verbal consent for record linkage
          </Label>
          <p className="text-sm text-muted-foreground">
            By checking this box, you are confirming that you have explained the purpose of record linkage to the patient and they have consented.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setActiveTab('matching')}>
          Back to Matching
        </Button>
        <Button 
          onClick={() => setActiveTab('matching')}
          disabled={!consentGiven}
        >
          Confirm Consent
        </Button>
      </div>
    </div>
  );
};

export default ConsentTab;
