import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GREEK_GEMATRIA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-isopsephy', label: 'What Is Greek Gematria?' },
  { id: 'greek-table', label: 'Greek Gematria Table' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'examples', label: 'Isopsephy Examples' },
  { id: 'greek-vs-hebrew', label: 'Greek vs Hebrew Gematria' },
  { id: 'uses-limitations', label: 'Uses and Limitations' },
  { id: 'greek-gematria-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string; fourth?: string }[];
  tableHeaders?:
    | readonly [string, string]
    | readonly [string, string, string]
    | readonly [string, string, string, string];
}

export const GREEK_GEMATRIA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-isopsephy',
    title: 'What Is Greek Gematria? Isopsephy Meaning',
    paragraphs: [
      'Greek gematria is commonly called isopsephy: a letter–number system that assigns traditional numerical values to Greek letters and adds those values for a word or phrase. It is related to historical Greek numeral practices and appears in literary and interpretive contexts.',
      'The calculator reports exact totals under the stated mapping. Matching numbers do not by themselves prove hidden meanings, predictions, or causal claims; calculation and symbolic interpretation are separate.',
    ],
  },
  {
    id: 'greek-table',
    title: 'Greek Gematria Table',
    paragraphs: [
      'Values run through units (1–9), tens (10–90), and hundreds (100–900). Stigma/digamma (6), koppa (90), and sampi (900) belong to the historical numeral set. Final sigma (ς) equals standard sigma (σ) at 200. Uppercase and lowercase share the same value.',
    ],
    table: [
      { left: 'Α α', right: 'Alpha', third: '1' },
      { left: 'Β β', right: 'Beta', third: '2' },
      { left: 'Γ γ', right: 'Gamma', third: '3' },
      { left: 'Δ δ', right: 'Delta', third: '4' },
      { left: 'Ε ε', right: 'Epsilon', third: '5' },
      { left: 'Ϛ/Ϝ ϛ/ϝ', right: 'Stigma / Digamma', third: '6' },
      { left: 'Ζ ζ', right: 'Zeta', third: '7' },
      { left: 'Η η', right: 'Eta', third: '8' },
      { left: 'Θ θ', right: 'Theta', third: '9' },
      { left: 'Ι ι', right: 'Iota', third: '10' },
      { left: 'Κ κ', right: 'Kappa', third: '20' },
      { left: 'Λ λ', right: 'Lambda', third: '30' },
      { left: 'Μ μ', right: 'Mu', third: '40' },
      { left: 'Ν ν', right: 'Nu', third: '50' },
      { left: 'Ξ ξ', right: 'Xi', third: '60' },
      { left: 'Ο ο', right: 'Omicron', third: '70' },
      { left: 'Π π', right: 'Pi', third: '80' },
      { left: 'Ϟ ϟ', right: 'Koppa', third: '90' },
      { left: 'Ρ ρ', right: 'Rho', third: '100' },
      { left: 'Σ σ/ς', right: 'Sigma', third: '200' },
      { left: 'Τ τ', right: 'Tau', third: '300' },
      { left: 'Υ υ', right: 'Upsilon', third: '400' },
      { left: 'Φ φ', right: 'Phi', third: '500' },
      { left: 'Χ χ', right: 'Chi', third: '600' },
      { left: 'Ψ ψ', right: 'Psi', third: '700' },
      { left: 'Ω ω', right: 'Omega', third: '800' },
      { left: 'Ϡ ϡ', right: 'Sampi', third: '900' },
    ],
    tableHeaders: ['Letter', 'Name', 'Value'],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Greek Gematria',
    paragraphs: [
      '1) Write the Greek word. 2) Identify each recognized letter. 3) Normalize accents. 4) Look up each value. 5) Add them. 6) Read the total.',
      'ΑΛΦΑ: 1 + 30 + 500 + 1 = 532. ΛΟΓΟΣ: 30 + 70 + 3 + 70 + 200 = 373.',
    ],
    formula: 'G = Σ value(letterᵢ)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Greek Gematria Calculator',
    paragraphs: [
      'Enter Greek text, read the total and letter count, expand the breakdown, open the mapping table, then share or reset. Spaces and punctuation do not add value. Latin characters are ignored with a notice; they are never silently treated as Greek.',
    ],
  },
  {
    id: 'examples',
    title: 'Greek Isopsephy Examples',
    paragraphs: [
      'Verified against this calculator’s mapping utility. ΙΗΣΟΥΣ = 888 is a numerical result under isopsephy, not evidence of a supernatural claim.',
    ],
    table: [
      { left: 'ΑΛΦΑ', right: '532' },
      { left: 'ΛΟΓΟΣ', right: '373' },
      { left: 'ΙΗΣΟΥΣ', right: '888' },
      { left: 'ΣΟΣ / σος', right: '470' },
      { left: 'Ω', right: '800' },
      { left: 'ΑΒΓ', right: '6' },
    ],
    tableHeaders: ['Greek Word', 'Numerical Value'],
  },
  {
    id: 'greek-vs-hebrew',
    title: 'Greek Gematria vs. Hebrew Gematria',
    paragraphs: [
      'Both systems assign numbers to letters, but Greek isopsephy uses Greek letters and Hebrew gematria uses Hebrew letters. Alphabets and mappings differ, so the same transliterated idea can produce different totals. Results are not interchangeable across systems.',
    ],
  },
  {
    id: 'uses-limitations',
    title: 'Uses and Limitations of Greek Gematria',
    paragraphs: [
      'Useful for historical numeral study, literary comparison, and educational exercises. Gematria totals do not independently establish factual claims, future events, or hidden meanings; treat them as letter-sum calculations under an explicit convention.',
    ],
  },
];

export const GREEK_GEMATRIA_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate Greek gematria by hand?',
    answer:
      'Assign each Greek letter its traditional numerical value and add them. For example, ΑΛΦΑ equals 1 + 30 + 500 + 1 = 532.',
  },
  {
    question: 'What is Greek isopsephy?',
    answer:
      'Isopsephy is a Greek letter-number system in which individual Greek letters have numerical values that can be added for a word or phrase.',
  },
  {
    question: 'What is the Greek gematria of ΙΗΣΟΥΣ?',
    answer:
      'Using traditional isopsephy values, ΙΗΣΟΥΣ equals 10 + 8 + 200 + 70 + 400 + 200 = 888.',
  },
  {
    question: 'What is the numerical value of Omega in Greek gematria?',
    answer: 'Omega (Ω or ω) has a numerical value of 800.',
  },
  {
    question: 'What is the numerical value of Alpha?',
    answer: 'Alpha (Α or α) has a numerical value of 1.',
  },
  {
    question: 'Does Greek gematria distinguish uppercase and lowercase letters?',
    answer:
      'No. Uppercase and lowercase versions of the same Greek letter share the same traditional numerical value.',
  },
  {
    question: 'Does Greek gematria count spaces?',
    answer: 'No. Spaces separate words but do not contribute numerical values.',
  },
  {
    question: 'Does the Greek letter sigma have different values at the end of a word?',
    answer: 'No. Both standard sigma (σ) and final sigma (ς) have the numerical value 200.',
  },
  {
    question: 'What is the difference between Greek gematria and Hebrew gematria?',
    answer:
      'Greek gematria uses traditional Greek letter values; Hebrew gematria uses Hebrew letter values. They are distinct systems with different alphabets and conventions.',
  },
  {
    question: 'Is Greek gematria scientifically predictive?',
    answer:
      'No. Greek gematria is a historical letter-number calculation system. Numerical matches do not establish scientific predictions or causal relationships.',
  },
];
