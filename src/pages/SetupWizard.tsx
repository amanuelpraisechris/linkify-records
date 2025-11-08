/**
 * Setup Wizard Page
 * First-run configuration
 */

import { useState } from 'react';
import {
  SetupWizardState,
  UseCase,
  USE_CASE_TEMPLATES
} from '@/types/setupWizard';
import {
  getSetupState,
  saveSetupState,
  completeSetup,
  runHealthChecks,
  loadDemoData
} from '@/services/setupWizardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SetupWizard() {
  const navigate = useNavigate();
  const [state, setState] = useState<SetupWizardState>(getSetupState());
  const [isLoading, setIsLoading] = useState(false);

  const handleUseCaseSelect = (useCase: UseCase) => {
    setState({ ...state, useCase });
  };

  const handleLoadDemoData = async () => {
    setIsLoading(true);
    try {
      const result = await loadDemoData();
      if (result.success) {
        alert(result.message);
      } else {
        alert('Failed to load demo data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    const updatedState = {
      ...state,
      organizationName: state.organizationName || 'My Organization',
      machineName: state.machineName || 'Machine 1'
    };

    completeSetup(updatedState);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to Linkify Records</h1>
        <p className="text-muted-foreground mt-2">
          Let's set up your record linkage system in a few simple steps
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>Tell us about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Enter organization name"
                value={state.organizationName || ''}
                onChange={(e) => setState({ ...state, organizationName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machineName">Machine/Station Name</Label>
              <Input
                id="machineName"
                placeholder="Enter machine name"
                value={state.machineName || ''}
                onChange={(e) => setState({ ...state, machineName: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Use Case Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Use Case</CardTitle>
            <CardDescription>Choose the template that best fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={state.useCase} onValueChange={handleUseCaseSelect}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {USE_CASE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      state.useCase === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleUseCaseSelect(template.id)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={template.id} id={template.id} />
                      <div className="flex-1">
                        <Label
                          htmlFor={template.id}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {template.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Demo Data */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Data</CardTitle>
            <CardDescription>Load sample data to explore the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLoadDemoData} disabled={isLoading} variant="outline">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>Load Demo Data (50 records)</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Complete Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Setup</CardTitle>
            <CardDescription>Ready to start matching records</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleComplete} size="lg" className="w-full">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
