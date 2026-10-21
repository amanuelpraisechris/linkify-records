
import { useState, useEffect } from 'react';
import { Check, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SupportedLanguage } from '@/utils/languageUtils';
import { useToast } from '@/components/ui/use-toast';

interface ConsentWorkflowTabProps {
  inputLanguage: SupportedLanguage;
  onConsentComplete: (consentData: {
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  }) => void;
  onProceedToEntry: () => void;
}

const ConsentWorkflowTab = ({
  inputLanguage,
  onConsentComplete,
  onProceedToEntry
}: ConsentWorkflowTabProps) => {
  const { toast } = useToast();
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentType, setConsentType] = useState<'written' | 'verbal' | 'previous'>('written');
  const [showConsentAlert, setShowConsentAlert] = useState(false);
  const [consentDate, setConsentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleConsentChange = (checked: boolean) => {
    setConsentGiven(checked);
    setShowConsentAlert(false);
  };

  const handleConsentSubmit = () => {
    if (!consentType) {
      toast({
        title: "Please select consent type",
        description: "You need to select how consent was obtained.",
        variant: "destructive",
      });
      return;
    }

    const consentData = {
      consentGiven: true,
      consentType,
      consentDate: consentDate + 'T' + new Date().toTimeString().split(' ')[0]
    };

    onConsentComplete(consentData);
    
    toast({
      title: "Consent Recorded",
      description: `Patient consent (${consentType}) has been recorded successfully.`,
    });
  };

  const handleProceed = () => {
    if (!consentGiven) {
      setShowConsentAlert(true);
      return;
    }

    handleConsentSubmit();
    onProceedToEntry();
  };

  const getLocalizedText = (key: string) => {
    const texts = {
      latin: {
        title: 'Patient Consent Required',
        subtitle: 'Consent must be obtained before collecting any patient data',
        dataUseNotice: 'Data Use Notice',
        dataUseDescription: 'Patient data will be used for record linkage with the HDSS database to improve healthcare delivery and research.',
        consentTypes: 'Type of Consent',
        written: 'Written consent form signed',
        verbal: 'Verbal consent obtained',
        previous: 'Previous consent on file',
        consentDate: 'Consent Date',
        consentCheckbox: 'I confirm that patient consent has been obtained for data collection and linkage',
        consentConfirmed: 'Consent confirmed - Ready to proceed',
        proceedButton: 'Proceed to Record Entry',
        consentRequired: 'Consent Required',
        consentRequiredMsg: 'Patient consent must be obtained before proceeding with data collection.',
        privacyNotice: 'Privacy Protection Notice',
        privacyDescription: 'All personal data is protected according to local privacy regulations. Data is used solely for healthcare improvement and research purposes.'
      },
      amharic: {
        title: 'የታካሚ ፈቃድ ያስፈልጋል',
        subtitle: 'ማንኛውም የታካሚ መረጃ ከመሰብሰብ በፊት ፈቃድ መያዝ አለበት',
        dataUseNotice: 'የዳታ አጠቃቀም ማሳወቂያ',
        dataUseDescription: 'የታካሚ ዳታ የጤና አገልግሎትን እና ምርምርን ለማሻሻል ከHDSS ዳታቤዝ ጋር ለማገናኘት ይጠቅማል።',
        consentTypes: 'የፈቃድ አይነት',
        written: 'የተፈረመ የጽሁፍ ፈቃድ ቅጽ',
        verbal: 'የአፍ ፈቃድ ተገኝቷል',
        previous: 'ቀደም ሲል የተሰጠ ፈቃድ በፋይል',
        consentDate: 'የፈቃድ ቀን',
        consentCheckbox: 'ለዳታ መሰብሰብ እና ማገናኘት የታካሚ ፈቃድ መገኘቱን አረጋግጣለሁ',
        consentConfirmed: 'ፈቃድ ተረጋግጧል - ለመቀጠል ዝግጁ',
        proceedButton: 'ወደ መዝገብ ግቤት ይሂዱ',
        consentRequired: 'ፈቃድ ያስፈልጋል',
        consentRequiredMsg: 'የዳታ መሰብሰብ ከመቀጠል በፊት የታካሚ ፈቃድ መገኘት አለበት።',
        privacyNotice: 'የግላዊነት ጥበቃ ማሳወቂያ',
        privacyDescription: 'ሁሉም የግል መረጃዎች በአካባቢው የግላዊነት ደንቦች መሰረት የተጠበቁ ናቸው። ዳታ ለጤና ማሻሻያ እና ለምርምር ዓላማዎች ብቻ ይጠቅማል።'
      },
      tigrinya: {
        title: 'ፍቓድ ሕሙም የድለ',
        subtitle: 'ክቡር ሓበሬታ ሕሙም ቅድሚ ምእካብ ፍቓድ ክሕዝ ኣለዎ',
        dataUseNotice: 'ሓበሬታ ኣጠቓቕማ መፍለጢ',
        dataUseDescription: 'ሓበሬታ ሕሙም ንምምሕያሽ ኣገልግሎት ጥዕናን ምርምርን ምስ ዳታቤዝ HDSS ክሳተፍ ይቕዋም።',
        consentTypes: 'ዓይነት ፍቓድ',
        written: 'ተፈሪሙ ቅጽ ፍቓድ ጽሑፍ',
        verbal: 'ፍቓድ በቓል ተረኺቡ',
        previous: 'ናይ ቀደም ፍቓድ ኣብ ፋይል',
        consentDate: 'ዕለት ፍቓድ',
        consentCheckbox: 'ንምእካብን ምትእስሳርን ሓበሬታ ፍቓድ ሕሙም ተረኺቡ ምህላዉ የረጋግጽ እየ',
        consentConfirmed: 'ፍቓድ ተረጋጊጹ - ንምቕጻል ድሉው',
        proceedButton: 'ናብ ምእታው መዝገብ ኪድ',
        consentRequired: 'ፍቓድ የድለ',
        consentRequiredMsg: 'ቅድሚ ምቕጻል ምእካብ ሓበሬታ ፍቓድ ሕሙም ክርከብ ኣለዎ።',
        privacyNotice: 'ሓበሬታ ጥበቃ ግላዊነት',
        privacyDescription: 'ኩሉ ሓበሬታ ብግሉ ብወሰን ሕግታት ንግላዊነት ክልል ተጠቒሙ ኢዩ። ሓበሬታ ንምምሕያሽ ጥዕናን ንዓላማታት ምርምርን ጥራይ ይቅዋም።'
      }
    };

    return texts[inputLanguage][key] || texts.latin[key];
  };

  const types = ['written', 'verbal', 'previous'] as const;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{getLocalizedText('title')}</h2>
          <p className="text-sm text-muted-foreground">{getLocalizedText('dataUseDescription')}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{getLocalizedText('consentTypes')}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {types.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setConsentType(type)}
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                consentType === type ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {getLocalizedText(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="consentDate" className="text-sm font-medium">{getLocalizedText('consentDate')}</label>
        <input
          type="date"
          id="consentDate"
          value={consentDate}
          onChange={(e) => setConsentDate(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <label htmlFor="patient-consent" className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${consentGiven ? 'border-primary bg-primary/5' : showConsentAlert ? 'border-destructive' : ''}`}>
        <Checkbox id="patient-consent" checked={consentGiven} onCheckedChange={(c) => handleConsentChange(c as boolean)} className="mt-0.5" />
        <span className="text-sm">
          {getLocalizedText('consentCheckbox')}
          <span className="mt-1 block text-xs text-muted-foreground">{getLocalizedText('privacyDescription')}</span>
        </span>
      </label>

      <Button onClick={handleProceed} disabled={!consentGiven} size="lg" className="w-full">
        {consentGiven && <Check className="mr-2 h-4 w-4" />}
        {getLocalizedText('proceedButton')}
      </Button>
    </div>
  );
};

export default ConsentWorkflowTab;
