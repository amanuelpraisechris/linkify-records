import { Record } from '@/types';

/**
 * Deterministic FAKE KAHDSS-style census records for demos and training only.
 * Names follow Ethiopian convention: given name + father's name + grandfather's name.
 */
const FEMALE = ['Almaz', 'Freweyni', 'Hiwet', 'Letemariam', 'Mebrat', 'Tsega', 'Abrehet', 'Selam', 'Rahel', 'Tirhas', 'Mulu', 'Kidan', 'Yordanos', 'Senait', 'Meseret', 'Azeb', 'Lemlem', 'Saba', 'Genet', 'Haregu', 'Zewdi', 'Birikti', 'Nigisti', 'Mihret'];
const MALE = ['Gebremariam', 'Tesfay', 'Hailu', 'Berhe', 'Kahsay', 'Gebremedhin', 'Weldegerima', 'Tekle', 'Assefa', 'Abraha', 'Kidane', 'Gebreyohannes', 'Haile', 'Mehari', 'Teklay', 'Gebru', 'Desta', 'Negash', 'Atsbeha', 'Hagos', 'Fitsum', 'Yemane', 'Kiros', 'Mulugeta'];

export const KAHDSS_AREAS: { [tabia: string]: string[] } = {
  'Agulae': ['Agulae Town', 'Adi Hiza', 'Maiweyni'],
  'Aynalem': ['Aynalem', 'Adi Kisandid', 'Hadnet'],
  'Genfel': ['Genfel', 'Debre Selam', 'Adi Hiyo'],
  'Abraha Atsbeha': ['Abraha Atsbeha', 'Adi Gebru', 'Maimesanu'],
  'Kihen': ['Kihen', 'Adi Mesanu', 'Mai Kiyah'],
  'Mahbere Selam': ['Mahbere Selam', 'Adi Hageray', 'Gemad'],
  'Negash': ['Negash', 'Adi Awala', 'Maykeyah'],
  'Wukro Town': ['Kebele 01', 'Kebele 02', 'Kebele 03'],
};

// Simple seeded generator so every load produces the same 100 people.
const rng = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

export function generateKahdssDemoRecords(count = 100): Record[] {
  const r = rng(20261021);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const tabias = Object.keys(KAHDSS_AREAS);
  const now = new Date().toISOString();

  return Array.from({ length: count }, (_, i) => {
    const female = r() < 0.75; // MCH focus: mostly women of reproductive age
    const given = female ? pick(FEMALE) : pick(MALE);
    const father = pick(MALE);
    const grandfather = pick(MALE);
    const mother = `${pick(FEMALE)} ${pick(MALE)}`;
    const tabia = pick(tabias);
    const kushet = pick(KAHDSS_AREAS[tabia]);
    const year = female ? 1980 + Math.floor(r() * 26) : 1960 + Math.floor(r() * 50);
    const birthDate = `${year}-${String(1 + Math.floor(r() * 12)).padStart(2, '0')}-${String(1 + Math.floor(r() * 28)).padStart(2, '0')}`;
    const tIdx = String(tabias.indexOf(tabia) + 1).padStart(2, '0');
    const hh = String(100 + Math.floor(i / 3)).padStart(4, '0');
    const indiv = `KA-${tIdx}-${hh}-${String((i % 3) + 1).padStart(2, '0')}`;
    const movedIn = r() < 0.3 ? String(2005 + Math.floor(r() * 18)) : '';

    return {
      id: `kahdss-demo-${i + 1}`,
      patientId: indiv,
      firstName: given, middleName: father, lastName: grandfather,
      father_name: father, grandfather_name: grandfather,
      sex: female ? 'Female' : 'Male',
      birthDate,
      woreda: 'Kilte Awlaelo', district: 'Kilte Awlaelo',
      tabia, kushet, village: tabia, subVillage: kushet,
      houseNumber: hh,
      motherName: mother,
      householdHead: `${pick(MALE)} ${father}`,
      yearMovedIn: movedIn,
      telephone: r() < 0.6 ? `+2519${String(10000000 + Math.floor(r() * 89999999))}` : '',
      identifiers: [
        { type: 'HDSS Individual ID', value: indiv },
        { type: 'HDSS Household ID', value: `KA-${tIdx}-${hh}` },
      ],
      metadata: { createdAt: now, updatedAt: now, source: 'HDSS Database (demo)' },
    } as Record;
  });
}
