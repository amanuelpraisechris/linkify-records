
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ConsentTabProps {
  consentGiven: boolean;
  setConsentGiven: (checked: boolean) => void;
  setActiveTab: (tab: string) => void;
  patientId?: string;
  previouslyConsented?: boolean;
}

const ConsentTab = ({ 
  consentGiven, 
  setConsentGiven, 
  setActiveTab,
  patientId,
  previouslyConsented = false
}: ConsentTabProps) => {
  const [showConsentDialog, setShowConsentDialog] = useState(!previouslyConsented);
  const [consentStatus, setConsentStatus] = useState<'pending' | 'given' | 'refused'>(
    previouslyConsented ? 'given' : 'pending'
  );
  const [consentFormType, setConsentFormType] = useState<'adult' | 'child'>('adult');

  useEffect(() => {
    // Auto-show the consent dialog when tab is first viewed
    if (!previouslyConsented) {
      setShowConsentDialog(true);
    }
  }, [previouslyConsented]);

  const handleConsentResponse = (consented: boolean) => {
    setConsentGiven(consented);
    setConsentStatus(consented ? 'given' : 'refused');
    setShowConsentDialog(false);
  };

  return (
    <div className="bg-white dark:bg-black border rounded-xl p-6 shadow-subtle space-y-6">
      <h3 className="text-xl font-semibold mb-2">Patient Consent for Record Linkage</h3>
      
      {/* Consent Status Display */}
      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
        <FileText className="w-5 h-5 text-primary" />
        <div>
          <p className="font-medium">Consent Status:</p>
          <p className={`text-sm ${
            consentStatus === 'given' ? 'text-green-600 dark:text-green-400' : 
            consentStatus === 'refused' ? 'text-red-600 dark:text-red-400' : 
            'text-amber-600 dark:text-amber-400'
          }`}>
            {consentStatus === 'given' ? 'CONSENT GIVEN' : 
             consentStatus === 'refused' ? 'CONSENT REFUSED' : 
             'PENDING CONSENT'}
          </p>
        </div>
      </div>
      
      {/* If previously consented, show message */}
      {previouslyConsented && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20">
          <ThumbsUp className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Previous Consent Confirmed</AlertTitle>
          <AlertDescription className="text-green-600">
            This patient has already provided written informed consent during a previous visit. 
            No new consent form is required.
          </AlertDescription>
        </Alert>
      )}
      
      {/* If consent refused, show warning */}
      {consentStatus === 'refused' && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-950/20">
          <ThumbsDown className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-700">Consent Refused</AlertTitle>
          <AlertDescription className="text-red-600">
            The patient has refused to provide consent. All data for this patient will be deleted 
            permanently when data is merged for the day.
          </AlertDescription>
        </Alert>
      )}
      
      {!previouslyConsented && consentStatus === 'pending' && (
        <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-800 dark:text-amber-300">
          <h4 className="font-semibold mb-1">Consent Process</h4>
          <p className="text-sm">
            Please read the following to the patient:
          </p>
          <p className="text-sm mt-2 italic">
            "We would like to link your clinical records with your community demographic records to improve healthcare coordination. This will help us better understand health patterns in your community and improve services. Your information will remain confidential and only authorized personnel will have access. Do you consent to this linkage?"
          </p>
        </div>
      )}
      
      {/* Manual consent checkbox only shown if status is still pending */}
      {!previouslyConsented && consentStatus === 'pending' && (
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
      )}
      
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setActiveTab('matching')}>
          Back to Matching
        </Button>
        
        {!previouslyConsented && consentStatus === 'pending' && (
          <Button 
            onClick={() => setShowConsentDialog(true)}
            className="bg-primary"
          >
            Check Written Consent
          </Button>
        )}
        
        {(consentStatus === 'given' || previouslyConsented) && (
          <Button 
            onClick={() => setActiveTab('matching')}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm and Continue
          </Button>
        )}
      </div>
      
      {/* Written Consent Dialog */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
              Consent Needed
            </DialogTitle>
            <DialogDescription className="pt-2">
              This patient has not provided written consent before. 
              Please offer the appropriate consent form.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <RadioGroup value={consentFormType} onValueChange={(value: 'adult' | 'child') => setConsentFormType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adult" id="adult" />
                <Label htmlFor="adult">Adult Consent Form (18+ years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="child" id="child" />
                <Label htmlFor="child">Child Consent Form (under 18 years)</Label>
              </div>
            </RadioGroup>
            
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Please provide the {consentFormType === 'adult' ? 'Adult' : 'Child'} Consent Form to the patient and ask them to sign it.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between space-x-4">
            <Button
              variant="destructive" 
              onClick={() => handleConsentResponse(false)}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              No, Refused
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleConsentResponse(true)}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes, Consented
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsentTab;
