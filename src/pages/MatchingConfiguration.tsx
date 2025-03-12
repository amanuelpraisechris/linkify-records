
import React from 'react';
import MatchingConfigAdmin from '@/components/admin/MatchingConfigAdmin';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MatchingConfiguration = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3 text-white">Matching Configuration</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Configure and fine-tune the parameters used by the matching algorithm to identify potential duplicate records.
        </p>
      </div>
      
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
