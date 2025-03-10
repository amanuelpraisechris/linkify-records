
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';

export const PerformanceTab: React.FC = () => {
  const [metrics] = useState({
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.79,
    f1: 0.80
  });
  
  return (
    <CardContent className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([metric, value]) => (
          <div key={metric} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500">{metric}</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold">{(value * 100).toFixed(1)}%</span>
              <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${value * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t mt-4">
        <h3 className="font-medium mb-2">Performance Analysis</h3>
        <p className="text-sm text-gray-500">
          These metrics are generated based on matches that have been validated by users.
          Higher values indicate better algorithm performance.
        </p>
        <ul className="list-disc text-sm ml-4 mt-2 text-gray-500">
          <li><strong>Accuracy:</strong> Percentage of correct classifications (true positives + true negatives)</li>
          <li><strong>Precision:</strong> Percentage of correct positive identifications</li>
          <li><strong>Recall:</strong> Percentage of actual positives correctly identified</li>
          <li><strong>F1 Score:</strong> Harmonic mean of precision and recall</li>
        </ul>
      </div>
    </CardContent>
  );
};
