
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sliders } from 'lucide-react';
import { FieldWeightsTab } from './FieldWeightsTab';
import { AlgorithmTypeTab } from './AlgorithmTypeTab';
import { PerformanceTab } from './PerformanceTab';

export const AlgorithmConfiguration = () => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" /> Algorithm Configuration
        </CardTitle>
        <CardDescription>
          Configure matching algorithm settings and view performance metrics
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="weights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weights">Field Weights</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Type</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weights">
          <FieldWeightsTab />
        </TabsContent>
        
        <TabsContent value="algorithm">
          <AlgorithmTypeTab />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t p-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};
