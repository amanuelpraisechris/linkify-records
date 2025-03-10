
export const sexOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Unknown', label: 'Unknown' }
];

export const visitByOptions = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'TREATMENT SUPPORTER', label: 'Treatment Supporter' }
];

// Add missing export
export const nonPatientNameFields = [
  'id', 'patientId', 'birthDate', 'sex', 'address', 'phoneNumber', 
  'email', 'village', 'subVillage', 'district', 'identifiers'
];
