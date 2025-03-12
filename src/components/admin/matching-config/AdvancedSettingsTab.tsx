
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedSettingsTabProps {
  config: {
    fuzzyMatching: boolean;
    languageConfig: {
      defaultLanguage: string;
      enableScriptDetection: boolean;
    };
  };
  onConfigUpdate: (updates: Partial<{
    fuzzyMatching: boolean;
    languageConfig: {
      defaultLanguage: string;
      enableScriptDetection: boolean;
    };
  }>) => void;
}

export const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({ config, onConfigUpdate }) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fuzzy-matching">Fuzzy Name Matching</Label>
            <p className="text-sm text-muted-foreground">
              Enable Levenshtein distance algorithm for fuzzy name matching
            </p>
          </div>
          <Switch
            id="fuzzy-matching"
            checked={config.fuzzyMatching}
            onCheckedChange={(checked) => onConfigUpdate({ fuzzyMatching: checked })}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <Label>Language Configuration</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Select 
                value={config.languageConfig.defaultLanguage}
                onValueChange={(value) => onConfigUpdate({
                  languageConfig: {
                    ...config.languageConfig,
                    defaultLanguage: value
                  }
                })}
              >
                <SelectTrigger id="default-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latin">Latin (English/Swahili)</SelectItem>
                  <SelectItem value="amharic">Amharic</SelectItem>
                  <SelectItem value="tigrinya">Tigrinya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="script-detection">Auto Script Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect script (e.g., Latin vs Ethiopic)
                </p>
              </div>
              <Switch
                id="script-detection"
                checked={config.languageConfig.enableScriptDetection}
                onCheckedChange={(checked) => onConfigUpdate({
                  languageConfig: {
                    ...config.languageConfig,
                    enableScriptDetection: checked
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
