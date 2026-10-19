# PIRL Benchmark Review and Upgrade Plan

## Findings (compared with the original PIRL software)

What already lines up with PIRL:
- Fellegi-Sunter scoring with agreement and disagreement weights per field.
- Jaro-Winkler fuzzy name comparison, with Amharic script detection.
- Uses PIRL fields: names, birth date, sex, village, sub-village, ten-cell leader or oldest household member.
- Side-by-side review, consent step, saving matches and "no match" records.

Gaps found:
1. **Birth year tolerance is 10 years** but still gets the strong "year matches" weight. A person born in 1980 scores the same against 1970 as against 1980. PIRL uses graded agreement (exact, ±1, ±2–5, further off).
2. **Score to percent is a made-up formula** (`(weight + 12) × 5`, capped 0–100). The percentage does not mean a real match chance, so thresholds are arbitrary.
3. **Admin settings do not reach the engine.** The probabilistic scorer uses fixed m/u values. Changes on the matching configuration page have no effect.
4. **No sound-alike or name-swap checks.** PIRL catches swapped first and last names, and names that sound alike. This version does neither.
5. **Missing data counts against a match.** If gender or a name is blank, the scorer applies the disagreement weight when it should be neutral.
6. **No candidate pre-filtering.** Every clinic record is compared with the full community list, which will be slow with real HDSS data (thousands of residents).
7. **Candidates are not ranked or banded by the PIRL rule:** a top few shown, labelled high/medium/low, with an automatic "no match" below a cutoff.
8. **No tests** cover the matching rules.
9. **Visual quality:** the "premium" screen uses hardcoded colours (green, blue) that ignore the theme. Its header states the algorithm in technical terms.

## Plan

1. **Graded field comparison:** names split into exact / close / disagree. Birth year split into exact / ±1 / ±2–5 / disagree, each with its own weight. Blank fields count as neutral.
2. **Name-swap and sound-alike matching:** compare first↔last swapped. Add a Soundex-style code for Latin names.
3. **Real probability score:** turn total weight into a match chance using a prior. Show it as a percentage. Thresholds (high / review / no match) can be set on the admin page.
4. **Link admin settings to the engine:** saved m/u values and thresholds are used for live matching.
5. **Candidate pre-filtering:** only score community records that share sex, a birth year within ±5, or a village or name sound code. Show the top 5 candidates.
6. **Review screen polish:** theme colours only. A field-by-field agreement bar showing each field's contribution. Plain-language confidence labels. Keyboard shortcuts for Match / No match / Review.
7. **Tests:** unit tests for the weights, birth year bands, name swap, missing fields and threshold banding, run with Vitest.

## Technical details
- Files: `src/utils/matching/probabilistic/*` (new `phonetic.ts`, `blocking.ts`, `scoring.ts`), `MatchingConfigContext` passes config to `calculateProbabilisticMatch(r1, r2, config)`.
- Probability: `p = 1 / (1 + 2^-(W + log2(prior/(1-prior))))`, with a default prior derived from the community size.
- Add Vitest along with `src/utils/matching/__tests__/`.
- Record decisions in `AGENTS.md`.
