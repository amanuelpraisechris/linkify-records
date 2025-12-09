
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
  'email', 'village', 'subVillage', 'district', 'identifiers',
  'balozi_first_name', '"balozi_first_name"',
  'balozi_middle_name', '"balozi_middle_name"',
  'balozi_last_name', '"balozi_last_name"',
  'oldest_member_first_name', '"oldest_member_first_name"',
  'oldest_member_middle_name', '"oldest_member_middle_name"',
  'oldest_member_last_name', '"oldest_member_last_name"',
  'cellLeaderFirstName', 'cellLeaderMiddleName', 'cellLeaderLastName',
  'oldestHouseholdMemberFirstName', 'oldestHouseholdMemberMiddleName', 'oldestHouseholdMemberLastName',
  'Ten Cell Leader First Name', '"Ten Cell Leader First Name"',
  'Ten Cell Leader Middle Name', '"Ten Cell Leader Middle Name"',
  'Ten Cell Leader Last Name', '"Ten Cell Leader Last Name"'
];
