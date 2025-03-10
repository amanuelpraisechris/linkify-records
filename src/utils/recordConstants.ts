
// List of keys that should be excluded from name fields
export const nonPatientNameFields = [
  "balozi_first_name", "\"balozi_first_name\"",
  "balozi_middle_name", "\"balozi_middle_name\"", 
  "balozi_last_name", "\"balozi_last_name\"",
  "oldest_member_first_name", "\"oldest_member_first_name\"",
  "oldest_member_middle_name", "\"oldest_member_middle_name\"",
  "oldest_member_last_name", "\"oldest_member_last_name\"",
  "cellLeaderFirstName", "cellLeaderMiddleName", "cellLeaderLastName",
  "oldestHouseholdMemberFirstName", "oldestHouseholdMemberMiddleName", "oldestHouseholdMemberLastName",
  "Ten Cell Leader First Name", "\"Ten Cell Leader First Name\"",
  "Ten Cell Leader Middle Name", "\"Ten Cell Leader Middle Name\"",
  "Ten Cell Leader Last Name", "\"Ten Cell Leader Last Name\""
];

// Layout constants for the form
export const recordEntryGridLayout = {
  personal: "grid-cols-3 gap-3",
  residence: "grid-cols-3 gap-3",
  identifiers: "grid-cols-1 gap-2"
};

// Storage keys for localStorage data persistence
export const STORAGE_KEYS = {
  COMMUNITY_RECORDS: 'community_records',
  IMPORTED_RECORDS: 'imported_records', 
  CLINIC_RECORDS: 'clinic_records',
  MATCH_RESULTS: 'match_results'
};
