import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RADIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-radiation-dose', label: 'What Is Radiation Dose?' },
  { id: 'absorbed-dose-units', label: 'Absorbed Dose Units' },
  { id: 'equivalent-dose-units', label: 'Equivalent Dose Units' },
  { id: 'radiation-weighting', label: 'Radiation Weighting Factors' },
  { id: 'effective-dose', label: 'Effective Dose and Tissue Weighting' },
  { id: 'how-to-use', label: 'How to Use the Radiation Converter' },
  { id: 'examples', label: 'Radiation Converter Examples' },
  { id: 'radiation-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const RADIATION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-radiation-dose',
    title: 'What Is Radiation Dose?',
    paragraphs: [
      'Radiation protection uses several related but distinct dose quantities. Absorbed dose measures energy deposited per unit mass (SI unit: gray, Gy). Equivalent dose adjusts absorbed dose by radiation weighting factors to reflect different biological effectiveness (SI unit: sievert, Sv). Effective dose further weights tissue equivalent doses and sums them for a whole-body protection quantity (also in sieverts).',
      'This converter synchronizes units within the absorbed-dose family (Gy, mGy, rad) and within the equivalent-dose family (Sv-scale: µSv, mSv, rem). It does not treat Gy and Sv as universally interchangeable.',
    ],
  },
  {
    id: 'absorbed-dose-units',
    title: 'Absorbed Dose Units',
    paragraphs: [
      'The gray (Gy) is the SI unit of absorbed dose: one joule of energy deposited per kilogram. Milligrays and micrograys are decimal submultiples. The rad is a legacy unit: 1 Gy = 100 rad.',
    ],
    formula: '1 Gy = 1,000 mGy = 100 rad · 1 rad = 0.01 Gy',
    tableHeaders: ['Unit', 'Symbol', 'Equals'],
    table: [
      ['Gray', 'Gy', '1 Gy'],
      ['Milligray', 'mGy', '0.001 Gy'],
      ['Rad', 'rad', '0.01 Gy'],
    ],
  },
  {
    id: 'equivalent-dose-units',
    title: 'Equivalent Dose Units',
    paragraphs: [
      'The sievert (Sv) is the SI unit used for equivalent and effective dose. Millisieverts and microsieverts are common for environmental and medical reporting. The rem is a legacy unit: 1 Sv = 100 rem.',
    ],
    formula: '1 Sv = 1,000 mSv = 1,000,000 µSv = 100 rem',
    tableHeaders: ['Unit', 'Symbol', 'Equals'],
    table: [
      ['Sievert', 'Sv', '1 Sv'],
      ['Millisievert', 'mSv', '0.001 Sv'],
      ['Microsievert', 'µSv', '0.000001 Sv'],
      ['Rem', 'rem', '0.01 Sv'],
    ],
  },
  {
    id: 'radiation-weighting',
    title: 'Radiation Weighting Factors',
    paragraphs: [
      'Equal absorbed doses from different radiation types can have different biological significance. Equivalent dose uses radiation weighting factors (w_R): H_T = Σ_R w_R D_T,R. Photons and electrons typically use w_R = 1; alpha particles use a higher factor; neutrons depend on energy.',
      'A numerical conversion from absorbed dose to equivalent dose therefore requires an appropriate weighting factor for the radiation type and exposure conditions. This unit converter keeps Gy-family and Sv-family fields independent for that reason.',
    ],
    formula: 'H_T = Σ_R w_R D_T,R',
  },
  {
    id: 'effective-dose',
    title: 'Effective Dose and Tissue Weighting',
    paragraphs: [
      'Effective dose combines tissue equivalent doses with tissue weighting factors: E = Σ_T w_T H_T. It is a radiation-protection quantity for comparing stochastic risk across different exposure patterns — not a direct prediction of an individual’s clinical outcome.',
      'Calculating effective dose from a single absorbed-dose number without tissue information is not valid. This page does not invent a whole-body effective dose from unit conversion alone.',
    ],
    formula: 'E = Σ_T w_T H_T',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Radiation Converter',
    paragraphs: [
      '1. Expand Absorbed dose or Equivalent / effective dose.',
      '2. Enter a known value in any field of that section.',
      '3. Read the automatically converted units in the same category.',
      '4. Edit another field in that section to change the conversion source.',
      '5. Remember: values in the Gy section do not auto-convert to the Sv section without radiation-weighting context.',
      '6. Use Share Result, Reload Calculator, or Clear All Changes as needed.',
    ],
  },
  {
    id: 'examples',
    title: 'Radiation Converter Examples',
    paragraphs: [
      'Example 1 (absorbed): 500 mGy = 0.5 Gy = 50 rad.',
      'Example 2 (equivalent): 2 mSv = 2,000 µSv = 0.2 rem.',
      'Example 3 (absorbed): 10 rad = 0.1 Gy = 100 mGy.',
      'These examples stay within their respective measurement categories.',
    ],
  },
];

export const RADIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between gray and sievert?',
    answer:
      'Gray measures absorbed energy per unit mass. Sievert is used for equivalent or effective dose, accounting for radiation or tissue weighting as appropriate.',
  },
  {
    question: 'How many milligrays are in one gray?',
    answer: '1 Gy = 1,000 mGy.',
  },
  {
    question: 'How many rads are in one gray?',
    answer: '1 Gy = 100 rad.',
  },
  {
    question: 'How many millisieverts are in one sievert?',
    answer: '1 Sv = 1,000 mSv.',
  },
  {
    question: 'How many microsieverts are in one millisievert?',
    answer: '1 mSv = 1,000 µSv.',
  },
  {
    question: 'How many rems are in one sievert?',
    answer: '1 Sv = 100 rem.',
  },
  {
    question: 'Can I directly convert Gy to Sv?',
    answer:
      'Not universally. Additional information about radiation type and, for effective dose, tissue exposure is required.',
  },
  {
    question: 'Is absorbed dose the same as effective dose?',
    answer: 'No. They represent different radiation quantities.',
  },
  {
    question: 'Can this calculator assess whether a radiation exposure is safe?',
    answer:
      'No. Unit conversion alone cannot determine health risk or clinical significance. Interpretation depends on exposure conditions, radiation type, affected tissues, and medical context.',
  },
];
