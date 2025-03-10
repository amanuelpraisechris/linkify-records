
export const jaroWinkler = (s1: string, s2: string): number => {
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();
  
  const s1Length = str1.length;
  const s2Length = str2.length;
  
  const matchDistance = Math.floor(Math.max(s1Length, s2Length) / 2) - 1;

  const s1Matches: boolean[] = Array(s1Length).fill(false);
  const s2Matches: boolean[] = Array(s2Length).fill(false);

  let matchingChars = 0;
  
  for (let i = 0; i < s1Length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2Length);

    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && str1[i] === str2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matchingChars++;
        break;
      }
    }
  }

  if (matchingChars === 0) return 0;

  let transpositions = 0;
  let k = 0;

  for (let i = 0; i < s1Length; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
  }

  const jaroSimilarity = (
    (matchingChars / s1Length) +
    (matchingChars / s2Length) +
    ((matchingChars - transpositions / 2) / matchingChars)
  ) / 3;

  const prefixLength = Math.min(4, Math.min(s1Length, s2Length));
  let prefixMatch = 0;
  for (let i = 0; i < prefixLength; i++) {
    if (str1[i] === str2[i]) prefixMatch++;
    else break;
  }

  const scalingFactor = 0.1;
  return jaroSimilarity + (prefixMatch * scalingFactor * (1 - jaroSimilarity));
};

export const calculateFieldWeight = (m: number, u: number, agrees: boolean): number => {
  if (agrees) {
    return Math.log2(m / u);
  } else {
    return Math.log2((1 - m) / (1 - u));
  }
};
