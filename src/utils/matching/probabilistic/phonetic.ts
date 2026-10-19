/**
 * Soundex-style phonetic code for Latin-script names.
 * Returns '' for empty or non-Latin input so callers can treat it as "unknown".
 */
export const soundex = (value: string | undefined): string => {
  if (!value) return '';
  const s = value.toUpperCase().replace(/[^A-Z]/g, '');
  if (!s) return '';
  const codes: { [k: string]: string } = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3', L: '4', M: '5', N: '5', R: '6',
  };
  let out = s[0];
  let prev = codes[s[0]] || '';
  for (let i = 1; i < s.length && out.length < 4; i++) {
    const ch = s[i];
    const code = codes[ch] || '';
    if (code && code !== prev) out += code;
    if (ch !== 'H' && ch !== 'W') prev = code;
  }
  return out.padEnd(4, '0');
};
