
import React from 'react';
import MatchingConfigAdmin from '@/components/admin/MatchingConfigAdmin';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';

const MatchingConfiguration = () => {
  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Matching Configuration</h1>
        <p className="text-muted-foreground">
          Configure and fine-tune the parameters used by the matching algorithm to identify potential duplicate records.
        </p>
      </div>
      
      <MatchingConfigProvider>
        <MatchingConfigAdmin />
      </MatchingConfigProvider>
    </div>
  );
};

export default MatchingConfiguration;
