# Tigray / KAHDSS contextualisation and premium record entry and search

## Goal
Adapt the app to Ethiopian HDSS sites in Tigray (e.g. KAHDSS, Wukro), focused on MCH/ANC clinics. Make clinic record entry and DSS search faster and friendlier, more like a premium linkage platform. Let admins add and edit the lists of clinics and tabias/kebeles/kushets without code changes.

## 1. Local terms and fields
- Replace "Village / Subvillage" with **Tabia (Kebele)** and **Kushet / Got**, and add **Woreda** (default Kilte Awlaelo) and **House number**.
- Remove the Balozi section and use **Household head** and **Got leader / Kushet representative** instead (still left out of matching, as now).
- Replace the ART-style identifiers with MCH/ANC ones: **MRN / Card no.**, **ANC no.**, **Family folder no.**, **Immunization / child health card no.**, **HDSS individual ID**, **HDSS household ID**.
- Use Ethiopian naming fields: **Given name**, **Father's name**, **Grandfather's name**, plus **Mother's name** (helps matching for mothers and children). Keep a phone number field.
- Add MCH context to the visit: **Visit type** (ANC1–ANC4+, Delivery, PNC, Child immunization, Growth monitoring), **Gestational age / LMP** (optional), and **Child's mother ID**, which links a child to the mother's record.
- Dates: add an **Ethiopian calendar (E.C.) / Gregorian (G.C.)** switch for birth date and visit date. Dates are saved in G.C., and the E.C. date is shown next to them.
- Make Tigrinya the default language label set. Amharic and English stay available.

## 2. Lists admins can extend
- New admin page **Locations & Facilities** with three editable lists:
  - Health facilities (name, type such as Hospital, Health Center or Health Post, woreda, active on/off)
  - Tabias/Kebeles (name in Tigrinya and English, woreda)
  - Kushets/Gots (each belongs to a tabia)
- The starter list comes from KAHDSS: Wukro General Hospital, Wukro Health Center, Agulae Health Center and Abraha Atsbeha Health Center, plus the KAHDSS tabias. I will mark these as examples for you to confirm.
- In entry forms, these become **searchable pickers** with a "+ Add new" option. A name added by a data collector is saved as *pending* until an admin approves it, so the lists stay clean.
- Choosing a tabia narrows the kushet list to that tabia.

## 3. Premium record entry
- A **step-by-step flow** with a progress bar: Consent -> Identify (clinic ID lookup) -> Person -> Residence -> Visit -> Review & Link.
- **Look up by ID first**: entering an MRN or ANC number finds a repeat patient and fills in the form.
- A **sticky summary panel** shows the patient as entered, which fields are missing, and a "match readiness" meter (how many matching fields are filled).
- Keyboard-friendly: Enter moves to the next field, and checks run inline instead of in pop-ups.
- Clear section cards that use the app's theme colours, Ethiopic-friendly fonts and larger touch targets for tablets.

## 4. Premium DSS search and linkage
- A **split-screen view**: the clinic patient stays on the left, and ranked HDSS candidates are on the right.
- Each candidate shows a High / Review / No match label, **reason pills** (Exact name, Similar sound, Swapped names, Birth year ±1, Same tabia, Blank, not counted) and a highlighted field-by-field comparison.
- Quick filters: same tabia, same sex, birth year range. Shortcuts: 1–5 to select a candidate, M to match, N for no match, R to send for review.
- If no candidate is found, a clear no-match panel shows the save reminder (this already works).

## 5. Matching updates
- The matching engine treats Tabia, Kushet, Father's name, Grandfather's name and Mother's name as fields. Tabia and kushet are compared using the editable lists.
- An Ethiopic-script name is also compared with its Latin spelling (for example ገብረ / Gebre) using the existing language helpers.
- The existing tests keep passing, with new tests for the new fields and the E.C.->G.C. date conversion.

## Technical details
- Migration: new tables `health_facilities`, `admin_areas` (level: woreda/tabia/kushet, parent_id, name_ti, name_en, status active/pending) with grants and RLS. Everyone signed in can read; collectors can add pending entries; admins approve. This uses a new `user_roles` table with `has_role()`, kept separate from profiles.
- Add columns to `clinic_records` and `community_records`: woreda, tabia, kushet, house_number, father_name, grandfather_name, mother_name, visit_type, mother_record_id. Keep the old `village`/`sub_village` and copy their values into `tabia`/`kushet` (no destructive drops).
- New `src/utils/ethiopianCalendar.ts` with tests. New components: `SearchableAreaPicker`, `FacilityPicker`, `EntryStepper`, `EntrySummaryPanel`, `CandidateReasonPills`, `LocationsAdmin`.
- Field labels move into a single `tigrayLabels` dictionary (ti/am/en). Hardcoded amber/green colours in the entry screens are replaced with theme tokens.
- Update AGENTS.md (where location lists come from and how roles work) and save the KAHDSS terminology to memory.

## Out of scope
- Data encryption in the style of the original PIRL, and offline sync. These can come next.
