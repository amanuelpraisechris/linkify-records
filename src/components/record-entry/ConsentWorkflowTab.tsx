
import { useState, useEffect } from 'react';
import { AlertCircle, Check, Info, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getLocalizedText('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {getLocalizedText('subtitle')}
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-300 dark:bg-blue-950/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">
          {getLocalizedText('dataUseNotice')}
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          {getLocalizedText('dataUseDescription')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('consentTypes')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {(['written', 'verbal', 'previous'] as const).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={type}
                  name="consentType"
                  value={type}
                  checked={consentType === type}
                  onChange={(e) => setConsentType(e.target.value as typeof consentType)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor={type} className="text-sm font-medium cursor-pointer">
                  {getLocalizedText(type)}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="consentDate" className="block text-sm font-medium mb-2">
              {getLocalizedText('consentDate')}
            </label>
            <input
              type="date"
              id="consentDate"
              value={consentDate}
              onChange={(e) => setConsentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 border-amber-300 dark:bg-amber-950/20">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">
          {getLocalizedText('privacyNotice')}
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          {getLocalizedText('privacyDescription')}
        </AlertDescription>
      </Alert>

      {showConsentAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{getLocalizedText('consentRequired')}</AlertTitle>
          <AlertDescription>
            {getLocalizedText('consentRequiredMsg')}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-muted/20 p-4 rounded-md border">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="patient-consent" 
            checked={consentGiven}
            onCheckedChange={(checked) => handleConsentChange(checked as boolean)}
          />
          <label
            htmlFor="patient-consent"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            {getLocalizedText('consentCheckbox')}
          </label>
        </div>
        
        {consentGiven && (
          <div className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center">
            <Check className="w-4 h-4 mr-2" />
            {getLocalizedText('consentConfirmed')}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleProceed}
          disabled={!consentGiven}
          className="px-8 py-2"
        >
          {getLocalizedText('proceedButton')}
        </Button>
      </div>
    </div>
  );
};

export default ConsentWorkflowTab;
