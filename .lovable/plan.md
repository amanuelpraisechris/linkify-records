# Reports module: fix and PIRL-style linkage reporting

## What I found
- **Repeated header:** the app adds the top bar to every page, and the Reports page adds its own copy, so it shows twice.
- **Reports page uses made-up content:** the "Data Quality Score" goes up by 10 each time you click a button, "Usage Analytics" is placeholder text, and "Download Report" does nothing.
- **The export in the Admin area uses fake visits** (random demo data). The matches file has no names of who decided, no reasons, no confidence bands and no summary figures.
- **The papers you attached (PIRL, Gates Open Res 2018; Rentsch, UAPS 2015; Mourby, IJPDS 2019)** report linkage like this: patients consented; the share who say they live in the HDSS area; match rate among those residents (84% in Kisesa); a breakdown of high / review / no match; the score of each confirmed match; repeat patients; and how match rates differ by sex, age group, village and facility. Mourby stresses giving out as little identifying data as possible, controlled access and an audit trail.

## What will change
1. **One top bar only.** Remove the extra copy from Reports and check other pages for the same problem.
2. **Reports page for admins only, using real saved data**, with a date range and filters for facility and tabia:
   - **Overview:** consented, refused, residents vs. never in the HDSS area, matched, no match, sent for review, and the match rate among residents.
   - **Linkage quality:** a chart of confidence scores, the split across the three labels, and how often each field agreed (given name, father's name, birth year, tabia, kushet, mother's name).
   - **Who is not getting linked:** match rate by sex, age group, tabia, facility and visit type (ANC, delivery, PNC, child).
   - **Collector activity:** decisions per collector, how many were sent for review, and how many had a reason written.
   - **Data completeness:** a real score based on the fields entered, replacing the button.
3. **Export (admins only):**
   - Matching results as CSV: linkage ID, facility, tabia, visit type, score, label, decision, collector, time and reason.
   - Metrics summary as CSV, plus a printable PDF report you can save from the browser.
   - Decision history (audit trail) as CSV.
   - A **"remove names" option, turned on by default.** With it on, names, phone numbers and card numbers are left out and coded IDs are used.
   - Each export is recorded: who downloaded it, when, and which filters were used.
   - Remove the fake visits from the current export.
4. **Database:** let admins read everyone's match results, decision history and clinic records (collectors still see only their own). Add a table that records exports.
5. **Tests** for match rate among residents, how scores are put into the three labels, and leaving names out of exports.

## Technical details
- Delete `<Navbar />` from `src/pages/Reports.tsx`; search the other pages for their own Navbar.
- New `src/services/reportsService.ts` (Supabase queries plus aggregation done as pure functions) and `src/utils/reportExport.ts` (CSV building, pseudonymised IDs from a hash of the record ID). Add a print stylesheet for the PDF.
- Migration: admin SELECT policies using `has_role(auth.uid(),'admin')` on match_results, match_decision_history, clinic_records and unmatched_records. Add `export_log` (user_id, export_type, filters jsonb, row_count, created_at) with GRANTs and RLS: admins insert their own rows and read all rows.
- Put `/reports` behind the admin route guard. Update `DataExport.tsx` to use the same service.
- Tests go in `src/utils/matching/__tests__/reports.test.ts`.
