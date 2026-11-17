import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  MILLIGRAMS_PER_POUND,
  formatMass,
  milligramsToPounds,
  poundsToMilligrams,
} from './calculation';

export const MG_TO_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the mg to lbs Converter' },
  { id: 'how-to-convert', label: 'How to Convert mg to lbs: The Formula' },
  { id: 'pounds-to-mg', label: 'How to Convert Pounds to Milligrams' },
  { id: 'understanding', label: 'Understanding Milligrams and Pounds' },
  { id: 'examples', label: 'mg to lbs Conversion Examples' },
  { id: 'lookup-table', label: 'Milligrams to Pounds Conversion Table' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'mg-to-lbs-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MG = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000] as const;
const EXAMPLE_MG = [1, 100, 250, 500, 1000, 5000] as const;

export const MG_TO_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the mg to lbs Converter',
    paragraphs: [
      '1. Enter the mass in milligrams.',
      '2. Read the automatically calculated weight in pounds.',
      '3. Alternatively, enter a value in pounds.',
      '4. Read the equivalent mass in milligrams.',
      '5. Use Reload Calculator to reset the inputs.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert mg to lbs: The Formula',
    paragraphs: [
      `Divide milligrams by ${MILLIGRAMS_PER_POUND}. The exact international avoirdupois definition should be preferred over a rounded multiplication factor.`,
      `Approximately, lb ≈ mg × ${formatMass(1 / MILLIGRAMS_PER_POUND)}, but the exact division formula is used by this calculator.`,
    ],
    formula: `lb = mg ÷ ${MILLIGRAMS_PER_POUND}`,
  },
  {
    id: 'pounds-to-mg',
    title: 'How to Convert Pounds to Milligrams',
    paragraphs: [
      `Multiply pounds by ${MILLIGRAMS_PER_POUND}. Example: 1 lb = ${formatMass(poundsToMilligrams(1))} mg. Example: 0.5 lb = ${formatMass(poundsToMilligrams(0.5))} mg.`,
    ],
    formula: `mg = lb × ${MILLIGRAMS_PER_POUND}`,
  },
  {
    id: 'understanding',
    title: 'Understanding Milligrams and Pounds',
    paragraphs: [
      'A milligram (mg) is a metric unit of mass equal to one-thousandth of a gram. 1,000 mg = 1 g.',
      `A pound (lb) is a unit of mass in the avoirdupois system. One international avoirdupois pound equals exactly 0.45359237 kg, which is exactly ${MILLIGRAMS_PER_POUND} mg.`,
    ],
  },
  {
    id: 'examples',
    title: 'mg to lbs Conversion Examples',
    paragraphs: EXAMPLE_MG.map(
      (mg) =>
        `${mg} mg ÷ ${MILLIGRAMS_PER_POUND} ≈ ${formatMass(milligramsToPounds(mg))} lb.`,
    ),
  },
  {
    id: 'lookup-table',
    title: 'Milligrams to Pounds Conversion Table',
    paragraphs: [
      'Values generated with the exact conversion factor. Displayed decimals are rounded for readability; calculations keep full precision.',
    ],
    tableHeaders: ['Milligrams (mg)', 'Pounds (lb), approximately'],
    table: TABLE_MG.map((mg) => [formatMass(mg), formatMass(milligramsToPounds(mg))]),
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, g to lbs Converter, kg to lbs Converter, lbs to kg Converter, lbs to g Converter, Pounds to Ounces Converter, Pounds to Grams Converter, and Grams to Ounces Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const MG_TO_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert mg to lb?',
    answer: `Divide the mass in milligrams by ${MILLIGRAMS_PER_POUND}. For example, 1,000 mg ≈ ${formatMass(milligramsToPounds(1000))} lb.`,
  },
  {
    question: 'What Is 250 mg in lbs?',
    answer: `250 ÷ ${MILLIGRAMS_PER_POUND} ≈ ${formatMass(milligramsToPounds(250))}. Therefore 250 mg ≈ ${formatMass(milligramsToPounds(250))} lb.`,
  },
  {
    question: 'What Is 500 mg in lbs?',
    answer: `500 ÷ ${MILLIGRAMS_PER_POUND} ≈ ${formatMass(milligramsToPounds(500))}. Therefore 500 mg ≈ ${formatMass(milligramsToPounds(500))} lb.`,
  },
  {
    question: 'How Many Milligrams Are in One Pound?',
    answer: `There are exactly ${MILLIGRAMS_PER_POUND} milligrams in one international avoirdupois pound.`,
  },
  {
    question: 'Is mg the Same as lb?',
    answer:
      'No. Both are units of mass, but their sizes differ significantly. Milligrams are metric units used for small masses, while pounds are commonly used for larger masses.',
  },
  {
    question: 'How Do I Convert 0.5 lb to mg?',
    answer: `0.5 × ${MILLIGRAMS_PER_POUND} = ${formatMass(poundsToMilligrams(0.5))}. Therefore 0.5 lb = ${formatMass(poundsToMilligrams(0.5))} mg.`,
  },
];
