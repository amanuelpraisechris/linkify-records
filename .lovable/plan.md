# Clinic intake page for admins, export locks, and Rentsch-style metrics

## What will change
1. **New admin-only "Clinic intake" page** (Option A), separate from the HDSS database page. It lists every clinic record saved during interviews by all data collectors: date, facility, tabia, visit type, consent, match status and collector. It has filters (date, facility, tabia, status) and opens a record's details. Names are shown only to admins.
2. **Data collectors can no longer export.** The "Download CSV" and "JSON" buttons are removed from the matched records screen and other collector screens. Collectors still see their own matched records on the page. All exports move to admins (Reports > Export and the Clinic intake page), names are removed by default, and every export is logged.
3. **Metrics updated using Rentsch et al. and PIRL.** These are added to Reports:
   - Linkage cascade: attended, consented, said they live in the HDSS area, searched, matched (each with % of the step before).
   - Match rate among residents, and among people found in the HDSS in the past 12 months.
   - Non-residents and people who moved in recently, counted separately.
   - Repeat patients: share of visits linked to a record that was already matched, and how consistent those links are.
   - Search effort: candidates shown per search, and the rank of the confirmed candidate (1st, 2–5, beyond).
   - Score of confirmed vs. rejected candidates, plus the share of review decisions resolved.
   - Differences in match rate by sex, age group, tabia, facility, visit type and collector.
   - Clinic ID completeness (ANC no., MCH card, family folder).
4. **Tests** for the cascade, repeat-patient rate, candidate rank, and that collectors cannot export.

## Technical details
- New `src/pages/ClinicIntake.tsx`, route `/clinic-intake` under `ProtectedRoute adminOnly`, link added to the admin links (desktop and mobile). It reads `clinic_records` through the existing admin SELECT policy.
- Remove the export actions from `MatchedRecordsViewer.tsx` (and check `RecordList`, `SearchSessions`, `DataManagement`). Export controls render only when `isAdmin`.
- Store the candidate rank and number of candidates in `match_results.field_scores` metadata (no schema change). Add pure functions to `reportMetrics.ts` (`cascade`, `repeatRate`, `rankDistribution`, `scoreByDecision`, `idCompleteness`) with tests in `reports.test.ts`. Add new Reports sections and include them in the metrics CSV.
- Record the export-access rule in AGENTS.md.
