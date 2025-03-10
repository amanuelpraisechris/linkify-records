
import { jaroWinkler } from './stringComparison';
import { SupportedLanguage } from '../../languageUtils';
import { normalizeText } from '../../languageUtils';

export const namesMatch = (
  name1: string | undefined, 
  name2: string | undefined,
  language: SupportedLanguage = 'latin'
): boolean => {
  if (!name1 || !name2) return false;
  
  const normalized1 = normalizeText(name1, language);
  const normalized2 = normalizeText(name2, language);
  
  const similarity = jaroWinkler(normalized1, normalized2);
  return similarity >= 0.7;
};

export const findBestNameMatch = (
  sourceName: string | undefined,
  targetNames: (string | undefined)[], 
  language: SupportedLanguage = 'latin'
): number => {
  if (!sourceName || !targetNames.length) return 0;
  
  let bestScore = 0;
  
  for (const targetName of targetNames) {
    if (!targetName) continue;
    
    const normalized1 = normalizeText(sourceName, language);
    const normalized2 = normalizeText(targetName, language);
    const score = jaroWinkler(normalized1, normalized2);
    
    if (score > bestScore) {
      bestScore = score;
    }
  }
  
  return bestScore;
};

export const birthYearMatches = (
  year1: string | undefined,
  year2: string | undefined,
  allowableDiff: number = 3
): boolean => {
  if (!year1 || !year2) return false;
  
  const y1 = parseInt(year1, 10);
  const y2 = parseInt(year2, 10);
  
  if (isNaN(y1) || isNaN(y2)) return false;
  
  return Math.abs(y1 - y2) <= allowableDiff;
};
