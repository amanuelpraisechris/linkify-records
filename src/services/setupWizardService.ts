/**
 * Setup Wizard Service
 * First-run configuration management
 */

import {
  SetupWizardState,
  SetupStep,
  USE_CASE_TEMPLATES,
  UseCaseTemplate,
  HealthCheck
} from '@/types/setupWizard';
import { logAudit } from './auditService';

const SETUP_STATE_KEY = 'setup_wizard_state';
const SETUP_COMPLETE_KEY = 'setup_complete';

/**
 * Check if setup is complete
 */
export function isSetupComplete(): boolean {
  return localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
}

/**
 * Get current setup state
 */
export function getSetupState(): SetupWizardState {
  const stateStr = localStorage.getItem(SETUP_STATE_KEY);

  if (stateStr) {
    try {
      return JSON.parse(stateStr);
    } catch (error) {
      console.error('Error parsing setup state:', error);
    }
  }

  // Return default state
  return {
    currentStep: 'welcome',
    completedSteps: [],
    useCase: 'custom',
    environment: 'production',
    isComplete: false
  };
}

/**
 * Save setup state
 */
export function saveSetupState(state: SetupWizardState): void {
  localStorage.setItem(SETUP_STATE_KEY, JSON.stringify(state));

  if (state.isComplete) {
    localStorage.setItem(SETUP_COMPLETE_KEY, 'true');

    logAudit({
      actionType: 'SYSTEM_INFO',
      description: `Setup wizard completed - Use case: ${state.useCase}`,
      severity: 'info',
      metadata: state
    });
  }
}

/**
 * Complete setup wizard
 */
export function completeSetup(state: SetupWizardState): void {
  const completeState: SetupWizardState = {
    ...state,
    isComplete: true,
    completedAt: new Date().toISOString()
  };

  saveSetupState(completeState);

  // Apply configurations based on use case
  if (state.useCase && state.useCase !== 'custom') {
    const template = USE_CASE_TEMPLATES.find(t => t.id === state.useCase);
    if (template && state.matchingConfig) {
      // Configuration will be applied by the wizard UI
      console.log('Setup complete with template:', template.name);
    }
  }
}

/**
 * Reset setup wizard
 */
export function resetSetup(): void {
  localStorage.removeItem(SETUP_STATE_KEY);
  localStorage.removeItem(SETUP_COMPLETE_KEY);

  logAudit({
    actionType: 'DATA_CLEAR',
    description: 'Setup wizard reset',
    severity: 'warning'
  });
}

/**
 * Run health checks
 */
export function runHealthChecks(): HealthCheck[] {
  const checks: HealthCheck[] = [];

  // Check localStorage availability
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    checks.push({
      category: 'Storage',
      name: 'LocalStorage Available',
      status: 'pass',
      message: 'Browser storage is working correctly'
    });
  } catch (error) {
    checks.push({
      category: 'Storage',
      name: 'LocalStorage Available',
      status: 'fail',
      message: 'LocalStorage is not available'
    });
  }

  // Check data availability
  const clinicRecords = localStorage.getItem('clinic_records');
  const communityRecords = localStorage.getItem('community_records');

  if (clinicRecords || communityRecords) {
    checks.push({
      category: 'Data',
      name: 'Data Sources',
      status: 'pass',
      message: 'Data sources detected'
    });
  } else {
    checks.push({
      category: 'Data',
      name: 'Data Sources',
      status: 'warning',
      message: 'No data sources found - you may want to load demo data'
    });
  }

  return checks;
}

/**
 * Load demo data
 */
export async function loadDemoData(): Promise<{success: boolean; message: string}> {
  try {
    // Generate demo records
    const demoRecords = generateDemoRecords(50);

    localStorage.setItem('community_records', JSON.stringify(demoRecords));
    localStorage.setItem('clinic_records', JSON.stringify(demoRecords.slice(0, 20)));

    logAudit({
      actionType: 'DATA_IMPORT',
      description: 'Loaded demo data',
      severity: 'info',
      metadata: { recordCount: demoRecords.length }
    });

    return {
      success: true,
      message: `Successfully loaded ${demoRecords.length} demo records`
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to load demo data'
    };
  }
}

function generateDemoRecords(count: number): any[] {
  const firstNames = ['John', 'Mary', 'James', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const villages = ['Mekele', 'Adigrat', 'Aksum', 'Shire'];
  const genders = ['Male', 'Female'];

  const records = [];
  for (let i = 0; i < count; i++) {
    records.push({
      id: `demo_${i + 1}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      sex: genders[Math.floor(Math.random() * genders.length)],
      birthDate: `${1950 + Math.floor(Math.random() * 50)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      village: villages[Math.floor(Math.random() * villages.length)],
      phoneNumber: `+251${Math.floor(Math.random() * 1000000000)}`,
      metadata: {
        source: 'demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  return records;
}
