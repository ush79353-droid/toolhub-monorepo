import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass, mcgToMg } from './calculation';
import { MICROGRAMS_PER_MILLIGRAM } from './types';

export const MCG_TO_MG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-microgram', label: 'What Is a Microgram?' },
  { id: 'what-is-a-milligram', label: 'What Is a Milligram?' },
  { id: 'mcg-to-mg', label: 'How to Convert mcg to mg' },
  { id: 'mg-to-mcg', label: 'How to Convert mg to mcg' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-table', label: 'mcg to mg Conversion Table' },
  { id: 'difference', label: 'Difference Between mcg and mg' },
  { id: 'metric-units', label: 'Common Metric Mass Units' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'mcg-to-mg-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  mcg: string;
  mg: string;
}

export interface McgToMgGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_MCG = [
  1, 5, 10, 25, 50, 75, 100, 125, 250, 500, 750, 1000, 1500, 2500, 5000, 10_000,
] as const;

export const MCG_TO_MG_GUIDE_SECTIONS: readonly McgToMgGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter turns metric mass between micrograms (mcg / µg) and milligrams (mg). Enter either unit and read the matching value instantly.',
      'These small units appear in laboratory notes, nutritional labels, and pharmaceutical manufacturing. The tool converts mass units only—it does not recommend a dose or concentration.',
    ],
  },
  {
    id: 'what-is-a-microgram',
    title: 'What Is a Microgram?',
    paragraphs: [
      'A microgram is a metric mass unit. Its SI symbol is µg; mcg is a common alternative abbreviation. One microgram equals 0.001 milligrams and 0.000001 grams.',
    ],
  },
  {
    id: 'what-is-a-milligram',
    title: 'What Is a Milligram?',
    paragraphs: [
      `A milligram is one-thousandth of a gram. Its symbol is mg. One milligram equals exactly ${MICROGRAMS_PER_MILLIGRAM} micrograms and 0.001 grams.`,
    ],
  },
  {
    id: 'mcg-to-mg',
    title: 'How to Convert mcg to mg',
    paragraphs: ['Divide micrograms by 1000. Example: 250 mcg ÷ 1000 = 0.25 mg.'],
    formula: 'mg = mcg / 1000',
  },
  {
    id: 'mg-to-mcg',
    title: 'How to Convert mg to mcg',
    paragraphs: ['Multiply milligrams by 1000. Example: 0.1 mg × 1000 = 100 mcg.'],
    formula: 'mcg = mg × 1000',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Enter a mass in micrograms to fill milligrams, or enter milligrams to fill micrograms. Open More conversion options for ng, cg, dg, g, and kg. Copy result places a short summary on the clipboard; Reset clears both fields.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'mcg to mg Conversion Table',
    paragraphs: [
      `Common values below use the same engine as the calculator. Every row follows 1 mg = ${MICROGRAMS_PER_MILLIGRAM} mcg exactly.`,
    ],
    table: TABLE_MCG.map((mcg) => ({
      mcg: formatMass(mcg),
      mg: formatMass(mcgToMg(mcg)),
    })),
  },
  {
    id: 'difference',
    title: 'Difference Between mcg and mg',
    paragraphs: [
      'Both units measure mass. A milligram is exactly 1000 times larger than a microgram, so 1 mg = 1000 mcg and 1 mcg = 0.001 mg. Do not confuse mcg with mg, or either mass unit with milliliters (mL).',
    ],
  },
  {
    id: 'metric-units',
    title: 'Common Metric Mass Units',
    paragraphs: [
      'Within the metric ladder: 1 kg = 1000 g = 1,000,000 mg = 1,000,000,000 mcg. Also 1 mcg = 1000 ng, 1 cg = 10 mg, and 1 dg = 100 mg.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for laboratory measurements, chemistry notes, scientific research, nutritional labeling, pharmaceutical manufacturing records, analytical testing, classroom metric drills, and everyday mcg ↔ mg checks.',
      'Mass cannot be converted into volume without density or concentration. This page never establishes an appropriate medication dose—verify clinical instructions with a qualified healthcare professional.',
    ],
  },
];

export const MCG_TO_MG_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert mcg to mg?',
    answer: 'Divide the microgram value by 1000.',
  },
  {
    question: 'How do I convert mg to mcg?',
    answer: 'Multiply the milligram value by 1000.',
  },
  {
    question: 'How many micrograms are in one milligram?',
    answer: 'Exactly 1000 micrograms.',
  },
  {
    question: 'How many milligrams are in one microgram?',
    answer: 'Exactly 0.001 milligrams.',
  },
  {
    question: 'What is 100 mcg in mg?',
    answer: '100 ÷ 1000 = 0.1 mg.',
  },
  {
    question: 'What is 125 mcg in mg?',
    answer: '125 ÷ 1000 = 0.125 mg.',
  },
  {
    question: 'What is 250 mcg in mg?',
    answer: '250 ÷ 1000 = 0.25 mg.',
  },
  {
    question: 'What is 500 mcg in mg?',
    answer: '500 ÷ 1000 = 0.5 mg.',
  },
  {
    question: 'What is 1000 mcg in mg?',
    answer: '1000 ÷ 1000 = 1 mg.',
  },
  {
    question: 'What is 0.1 mg in mcg?',
    answer: '0.1 × 1000 = 100 mcg.',
  },
  {
    question: 'What is 0.125 mg in mcg?',
    answer: '0.125 × 1000 = 125 mcg.',
  },
  {
    question: 'Is mcg the same as µg?',
    answer:
      'Yes. Both refer to micrograms. The official SI symbol is µg, while mcg is a commonly used alternative abbreviation.',
  },
  {
    question: 'Which is bigger, mg or mcg?',
    answer: 'A milligram is 1000 times larger than a microgram.',
  },
  {
    question: 'Can I convert decimal mcg values?',
    answer: 'Yes. The calculator supports integers and decimal measurements.',
  },
  {
    question: 'Can I use this converter for medication measurements?',
    answer:
      'It can convert mass values between mcg and mg, but it cannot determine a medication’s appropriate dose, concentration, or suitability. Medication instructions should be verified with a qualified healthcare professional.',
  },
];
