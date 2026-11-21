import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass, lbsToPounds } from './calculation';
import { LBS_TO_POUNDS_FACTOR } from './types';

export const LBS_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the lbs to Pounds Converter' },
  { id: 'how-to-convert', label: 'How to Convert lbs to Pounds' },
  { id: 'lookup-table', label: 'lbs to Pound Conversion Chart' },
  { id: 'same-unit', label: 'Are lbs and Pounds the Same?' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'lbs-to-pounds-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LBS = [0.5, 1, 2, 5, 10, 22.5, 25, 50, 100, 125, 200, 500] as const;

export const LBS_TO_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the lbs to Pounds Converter',
    paragraphs: [
      '1. Enter the weight in the Weight in lbs field.',
      '2. The corresponding value appears in Weight in pounds.',
      '3. Enter a value in the pounds field to convert in reverse.',
      '4. Both fields remain synchronized automatically.',
      '5. Use the reload or clear controls when needed.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert lbs to Pounds',
    paragraphs: [
      'lb is the standard unit symbol for the pound, while lbs is a common informal plural abbreviation. The numerical conversion is one-to-one.',
      `Example; convert 22 lbs: 22 × ${LBS_TO_POUNDS_FACTOR} = ${formatMass(lbsToPounds(22))}. Therefore 22 lbs = ${formatMass(lbsToPounds(22))} pounds.`,
      'The value remains unchanged because both names describe the same avoirdupois mass unit. This calculator is not pounds-to-kilograms, pounds-to-ounces, or pounds-force.',
    ],
    formula: `Pounds = lbs × ${LBS_TO_POUNDS_FACTOR} · lbs = Pounds × ${LBS_TO_POUNDS_FACTOR}`,
  },
  {
    id: 'lookup-table',
    title: 'lbs to Pound Conversion Chart',
    paragraphs: [
      'Because the conversion is an identity, every chart row shows the same number in both columns.',
    ],
    tableHeaders: ['lbs', 'Pounds'],
    table: TABLE_LBS.map((v) => [formatMass(v), formatMass(lbsToPounds(v))]),
  },
  {
    id: 'same-unit',
    title: 'Are lbs and Pounds the Same?',
    paragraphs: [
      'Yes. In ordinary mass measurements, lbs and pounds refer to exactly the same unit.',
      'The singular standard symbol is lb, while lbs is commonly used informally when describing multiple pounds. For example: 1 lb = 1 pound, 5 lbs = 5 pounds, and 10 lbs = 10 pounds.',
      'The symbol lb is derived from the Latin word libra.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, kg to lbs Converter, lbs to kg Converter, lbs to g Converter, g to lbs Converter, Pounds to Ounces Converter, Pounds to Grams Converter, Pounds and Ounces Calculator, Stone to Pounds Converter, and Ounces to Pounds Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const LBS_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 lb to Pound?',
    answer: `One lb is exactly equal to one pound. 1 lb = 1 pound. No conversion factor other than ${LBS_TO_POUNDS_FACTOR} is necessary.`,
  },
  {
    question: 'How Do I Convert 22 lbs to Pounds?',
    answer: `The value remains unchanged. 22 × ${LBS_TO_POUNDS_FACTOR} = 22. Therefore 22 lbs = 22 pounds.`,
  },
  {
    question: 'Is lbs the Same as Pounds?',
    answer:
      'Yes. Both refer to the same mass unit. The standard unit symbol is lb, while lbs is a commonly used plural abbreviation.',
  },
  {
    question: 'How Many Pounds Are in 100 lbs?',
    answer: 'There are exactly 100 pounds in 100 lbs.',
  },
  {
    question: 'What Is the Difference Between lb and lbs?',
    answer:
      'There is no difference in the measurement value. lb is the standard symbol for pound, and lbs is an informal plural form commonly used in everyday writing.',
  },
  {
    question: 'Does Converting lbs to Pounds Change the Weight?',
    answer:
      'No. Since lbs and pounds represent the same unit, the weight remains exactly the same.',
  },
];
