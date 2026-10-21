import { SupportedLanguage } from './languageUtils';

type Entry = { en: string; am: string; ti: string };

/** Single dictionary for Tigray / KAHDSS field labels (English, Amharic, Tigrinya). */
export const TIGRAY_LABELS = {
  givenName: { en: 'Given name', am: 'ስም', ti: 'ሽም' },
  fatherName: { en: "Father's name", am: 'የአባት ስም', ti: 'ሽም ኣቦ' },
  grandfatherName: { en: "Grandfather's name", am: 'የአያት ስም', ti: 'ሽም ኣባሓጎ' },
  motherName: { en: "Mother's name", am: 'የእናት ስም', ti: 'ሽም ኣደ' },
  woreda: { en: 'Woreda', am: 'ወረዳ', ti: 'ወረዳ' },
  tabia: { en: 'Tabia (Kebele)', am: 'ቀበሌ', ti: 'ጣብያ' },
  kushet: { en: 'Kushet / Got', am: 'ጎጥ', ti: 'ቁሸት / ጎጥ' },
  houseNumber: { en: 'House no.', am: 'የቤት ቁጥር', ti: 'ቁጽሪ ገዛ' },
  householdHead: { en: 'Household head', am: 'የቤተሰብ ኃላፊ', ti: 'ሓላፊ ስድራ' },
  facility: { en: 'Health facility', am: 'የጤና ተቋም', ti: 'ትካል ጥዕና' },
  visitType: { en: 'Visit type', am: 'የጉብኝት አይነት', ti: 'ዓይነት ምብጻሕ' },
  lmp: { en: 'LMP (last menstrual period)', am: 'የመጨረሻ የወር አበባ', ti: 'ናይ መወዳእታ ጽግያት' },
  motherRecordId: { en: "Child's mother ID (MRN)", am: 'የእናት መለያ', ti: 'መለለዪ ኣደ' },
  select: { en: 'Select…', am: 'ይምረጡ…', ti: 'ምረጽ…' },
  search: { en: 'Search…', am: 'ፈልግ…', ti: 'ድለ…' },
  addNew: { en: 'Add new', am: 'አዲስ ጨምር', ti: 'ሓድሽ ወስኽ' },
  pending: { en: 'pending approval', am: 'ማረጋገጫ በመጠበቅ', ti: 'ምጽዳቕ ይጽበ' },
} satisfies { [k: string]: Entry };

export type LabelKey = keyof typeof TIGRAY_LABELS;

export const t = (key: LabelKey, lang: SupportedLanguage): string => {
  const e = TIGRAY_LABELS[key];
  return lang === 'amharic' ? e.am : lang === 'tigrinya' ? e.ti : e.en;
};

export const MCH_CLINIC_ID_TYPES = ['MRN / Card no.', 'ANC no.', 'Family folder no.', 'Immunization card no.'];
export const HDSS_ID_TYPES = ['HDSS individual ID', 'HDSS household ID', 'Kebele ID', 'Phone (owner)'];
export const MCH_VISIT_TYPES = ['ANC1', 'ANC2', 'ANC3', 'ANC4+', 'Delivery', 'PNC', 'Child immunization', 'Growth monitoring', 'Other'];
