
export type FieldDescription = {
  label: string;
  description: string;
};

export const fieldDescriptions: Record<string, FieldDescription> = {
  firstName: {
    label: "firstName",
    description: "Patient's first name (given name) - Exact or fuzzy matching"
  },
  lastName: {
    label: "lastName", 
    description: "Patient's last name (family name) - Exact or fuzzy matching"
  },
  middleName: {
    label: "middleName",
    description: "Patient's middle name - Exact or fuzzy matching"
  },
  birthDate: {
    label: "birthDate",
    description: "Full birth date in YYYY-MM-DD format"
  },
  sex: {
    label: "sex",
    description: "Patient's sex (Male/Female) - Exact matching only"
  },
  village: {
    label: "village",
    description: "Patient's residential village - Exact or fuzzy matching"
  },
  subVillage: {
    label: "subVillage",
    description: "Patient's subvillage of residence - Exact or fuzzy matching"
  },
  oldestHouseholdMember: {
    label: "oldestHouseholdMember",
    description: "Name of the oldest household member - Exact or fuzzy matching"
  },
  phoneNumber: {
    label: "phoneNumber",
    description: "Patient's phone number - Exact matching only"
  },
  // New location-based identifier fields
  tabiaName: {
    label: "tabiaName",
    description: "Patient's Tabia name - Geographic identifier"
  },
  kushetName: {
    label: "kushetName",
    description: "Patient's Kushet name - Geographic identifier"
  },
  gotName: {
    label: "gotName",
    description: "Patient's Got name - Geographic identifier"
  },
  houseNumber: {
    label: "houseNumber",
    description: "Patient's house number - Exact matching only"
  }
};
