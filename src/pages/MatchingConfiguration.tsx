
import React from 'react';
import MatchingConfigAdmin from '@/components/admin/MatchingConfigAdmin';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { InfoCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MatchingConfiguration = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-3 text-white">Matching Configuration</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Configure and fine-tune the parameters used by the matching algorithm to identify potential duplicate records.
        </p>
      </div>
      
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <InfoCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700">Gold Standard Matching</AlertTitle>
        <AlertDescription className="text-amber-600">
          The default configuration uses the Fellegi-Sunter probabilistic model. This approach calculates match weights using agreement (log2[m/u]) and disagreement (log2[(1-m)/(1-u)]) probabilities, combined with Jaro-Winkler string comparison for names.
        </AlertDescription>
      </Alert>
      
      <MatchingConfigProvider>
        <MatchingConfigAdmin />
      </MatchingConfigProvider>
      
      <div className="mt-8 flex justify-center">
        <Button 
          className="cta-btn"
          onClick={() => navigate('/data-management')}
        >
          Return to Data Management
        </Button>
      </div>
      
      <div className="footer mt-12 text-center">
        <p>Record Linkage Application • Powered by Medical Informatics</p>
      </div>
    </div>
  );
};

export default MatchingConfiguration;
