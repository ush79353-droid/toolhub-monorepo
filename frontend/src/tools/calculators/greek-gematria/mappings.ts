import type { GreekLetterEntry } from './types';

/** Traditional Greek isopsephy numeral table (27 entries including historical symbols). */
export const GREEK_ISOPSEPHY_TABLE: readonly GreekLetterEntry[] = Object.freeze([
  { uppercase: 'Α', lowercase: 'α', name: 'Alpha', value: 1 },
  { uppercase: 'Β', lowercase: 'β', name: 'Beta', value: 2 },
  { uppercase: 'Γ', lowercase: 'γ', name: 'Gamma', value: 3 },
  { uppercase: 'Δ', lowercase: 'δ', name: 'Delta', value: 4 },
  { uppercase: 'Ε', lowercase: 'ε', name: 'Epsilon', value: 5 },
  { uppercase: 'Ϛ', lowercase: 'ϛ', name: 'Stigma', value: 6 },
  { uppercase: 'Ϝ', lowercase: 'ϝ', name: 'Digamma', value: 6 },
  { uppercase: 'Ζ', lowercase: 'ζ', name: 'Zeta', value: 7 },
  { uppercase: 'Η', lowercase: 'η', name: 'Eta', value: 8 },
  { uppercase: 'Θ', lowercase: 'θ', name: 'Theta', value: 9 },
  { uppercase: 'Ι', lowercase: 'ι', name: 'Iota', value: 10 },
  { uppercase: 'Κ', lowercase: 'κ', name: 'Kappa', value: 20 },
  { uppercase: 'Λ', lowercase: 'λ', name: 'Lambda', value: 30 },
  { uppercase: 'Μ', lowercase: 'μ', name: 'Mu', value: 40 },
  { uppercase: 'Ν', lowercase: 'ν', name: 'Nu', value: 50 },
  { uppercase: 'Ξ', lowercase: 'ξ', name: 'Xi', value: 60 },
  { uppercase: 'Ο', lowercase: 'ο', name: 'Omicron', value: 70 },
  { uppercase: 'Π', lowercase: 'π', name: 'Pi', value: 80 },
  { uppercase: 'Ϟ', lowercase: 'ϟ', name: 'Koppa', value: 90 },
  { uppercase: 'Ρ', lowercase: 'ρ', name: 'Rho', value: 100 },
  { uppercase: 'Σ', lowercase: 'σ', name: 'Sigma', value: 200 },
  { uppercase: 'Τ', lowercase: 'τ', name: 'Tau', value: 300 },
  { uppercase: 'Υ', lowercase: 'υ', name: 'Upsilon', value: 400 },
  { uppercase: 'Φ', lowercase: 'φ', name: 'Phi', value: 500 },
  { uppercase: 'Χ', lowercase: 'χ', name: 'Chi', value: 600 },
  { uppercase: 'Ψ', lowercase: 'ψ', name: 'Psi', value: 700 },
  { uppercase: 'Ω', lowercase: 'ω', name: 'Omega', value: 800 },
  { uppercase: 'Ϡ', lowercase: 'ϡ', name: 'Sampi', value: 900 },
]);

/** Display table without duplicate digamma row when stigma already listed at 6 — keep both for lookup. */
export const GREEK_ISOPSEPHY_DISPLAY_TABLE: readonly GreekLetterEntry[] = Object.freeze([
  { uppercase: 'Α', lowercase: 'α', name: 'Alpha', value: 1 },
  { uppercase: 'Β', lowercase: 'β', name: 'Beta', value: 2 },
  { uppercase: 'Γ', lowercase: 'γ', name: 'Gamma', value: 3 },
  { uppercase: 'Δ', lowercase: 'δ', name: 'Delta', value: 4 },
  { uppercase: 'Ε', lowercase: 'ε', name: 'Epsilon', value: 5 },
  { uppercase: 'Ϛ/Ϝ', lowercase: 'ϛ/ϝ', name: 'Stigma / Digamma', value: 6 },
  { uppercase: 'Ζ', lowercase: 'ζ', name: 'Zeta', value: 7 },
  { uppercase: 'Η', lowercase: 'η', name: 'Eta', value: 8 },
  { uppercase: 'Θ', lowercase: 'θ', name: 'Theta', value: 9 },
  { uppercase: 'Ι', lowercase: 'ι', name: 'Iota', value: 10 },
  { uppercase: 'Κ', lowercase: 'κ', name: 'Kappa', value: 20 },
  { uppercase: 'Λ', lowercase: 'λ', name: 'Lambda', value: 30 },
  { uppercase: 'Μ', lowercase: 'μ', name: 'Mu', value: 40 },
  { uppercase: 'Ν', lowercase: 'ν', name: 'Nu', value: 50 },
  { uppercase: 'Ξ', lowercase: 'ξ', name: 'Xi', value: 60 },
  { uppercase: 'Ο', lowercase: 'ο', name: 'Omicron', value: 70 },
  { uppercase: 'Π', lowercase: 'π', name: 'Pi', value: 80 },
  { uppercase: 'Ϟ', lowercase: 'ϟ', name: 'Koppa', value: 90 },
  { uppercase: 'Ρ', lowercase: 'ρ', name: 'Rho', value: 100 },
  { uppercase: 'Σ', lowercase: 'σ/ς', name: 'Sigma', value: 200 },
  { uppercase: 'Τ', lowercase: 'τ', name: 'Tau', value: 300 },
  { uppercase: 'Υ', lowercase: 'υ', name: 'Upsilon', value: 400 },
  { uppercase: 'Φ', lowercase: 'φ', name: 'Phi', value: 500 },
  { uppercase: 'Χ', lowercase: 'χ', name: 'Chi', value: 600 },
  { uppercase: 'Ψ', lowercase: 'ψ', name: 'Psi', value: 700 },
  { uppercase: 'Ω', lowercase: 'ω', name: 'Omega', value: 800 },
  { uppercase: 'Ϡ', lowercase: 'ϡ', name: 'Sampi', value: 900 },
]);

function buildLookup(): {
  valueByChar: Readonly<Record<string, number>>;
  nameByChar: Readonly<Record<string, string>>;
} {
  const valueByChar: Record<string, number> = {};
  const nameByChar: Record<string, string> = {};
  for (const entry of GREEK_ISOPSEPHY_TABLE) {
    valueByChar[entry.uppercase] = entry.value;
    valueByChar[entry.lowercase] = entry.value;
    nameByChar[entry.uppercase] = entry.name;
    nameByChar[entry.lowercase] = entry.name;
  }
  // Final sigma
  valueByChar['ς'] = 200;
  nameByChar['ς'] = 'Sigma';
  // Archaic koppa variants sometimes seen
  valueByChar['Ϙ'] = 90;
  valueByChar['ϙ'] = 90;
  nameByChar['Ϙ'] = 'Koppa';
  nameByChar['ϙ'] = 'Koppa';
  return {
    valueByChar: Object.freeze(valueByChar),
    nameByChar: Object.freeze(nameByChar),
  };
}

const LOOKUP = buildLookup();

export const GREEK_LETTER_VALUES = LOOKUP.valueByChar;
export const GREEK_LETTER_NAMES = LOOKUP.nameByChar;
