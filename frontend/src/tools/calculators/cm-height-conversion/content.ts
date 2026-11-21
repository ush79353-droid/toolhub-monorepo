import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cmToFeetAndInches, formatInchesFriendly, formatLength } from './calculation';

export const CM_HEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'feet-to-cm', label: 'Height Calculator: Feet to CM Conversion' },
  { id: 'cm-to-feet-inches', label: 'How to Convert CM to Feet and Inches' },
  { id: 'height-conversion-table', label: 'Height Conversion Reference Table' },
  { id: 'related-height-tools', label: 'Other Related Height Conversion Tools' },
  { id: 'cm-height-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_CM = [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200] as const;

function chartRow(cm: number): string[] {
  const { feet, inches } = cmToFeetAndInches(cm);
  return [`${cm} cm`, `${feet} ft ${formatInchesFriendly(inches)} in`];
}

export const CM_HEIGHT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'feet-to-cm',
    title: 'Height Calculator: Feet to CM Conversion',
    paragraphs: [
      'To convert height from feet and inches into centimeters, convert each part with the exact international factors, then add them.',
      'Step 1: convert feet: 1 ft = 30.48 cm, so multiply feet by 30.48.',
      'Step 2: convert inches: 1 in = 2.54 cm, so multiply inches by 2.54.',
      'Step 3: add both: cm = (feet × 30.48) + (inches × 2.54).',
      'Example; 5 ft 8 in: 5 × 30.48 = 152.4; 8 × 2.54 = 20.32; 152.4 + 20.32 = 172.72. Therefore 5 ft 8 in = 172.72 cm.',
    ],
    formula: 'cm = (feet × 30.48) + (inches × 2.54)',
  },
  {
    id: 'cm-to-feet-inches',
    title: 'How to Convert CM to Feet and Inches',
    paragraphs: [
      'Step 1: divide centimeters by 2.54 to get total inches.',
      'Step 2: divide total inches by 12; the whole-number part is feet.',
      'Step 3: the remainder is inches.',
      `Example; 175 cm: 175 ÷ 2.54 ≈ ${formatLength(175 / 2.54)} inches ≈ 5 feet ${formatInchesFriendly(cmToFeetAndInches(175).inches)} inches.`,
      'Some people round to the nearest whole inch (about 5 ft 9 in for 175 cm). This calculator keeps the precise remaining inches and shows a friendly two-decimal label in the result summary.',
    ],
    formula: 'total inches = cm ÷ 2.54 · feet = floor(total ÷ 12) · inches = remainder',
  },
  {
    id: 'height-conversion-table',
    title: 'Height Conversion Reference Table',
    paragraphs: [
      'Common adult height references from 140 cm to 200 cm. Table inches are rounded to two decimal places for readability; the calculator engine keeps full conversion precision.',
    ],
    tableHeaders: ['Centimeters', 'Feet and Inches'],
    table: CHART_CM.map(chartRow),
  },
  {
    id: 'related-height-tools',
    title: 'Other Related Height Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Height in Inches, Feet and Inches, Meters to Feet, Metric to Imperial, and Length Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_HEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Tall Am I in Centimeters?',
    answer:
      'Convert feet and inches with cm = (feet × 30.48) + (inches × 2.54). For example, 5 feet 8 inches equals 172.72 cm.',
  },
  {
    question: 'How Tall Am I in Feet?',
    answer: `Divide centimeters by 30.48 for decimal feet. For example, 175 ÷ 30.48 ≈ ${formatLength(175 / 30.48)} ft, or about 5 ft ${formatInchesFriendly(cmToFeetAndInches(175).inches)} in as a mixed height.`,
  },
  {
    question: 'How Tall Am I in Centimeters if I Am 5 Feet 6 Inches?',
    answer: '5 × 30.48 + 6 × 2.54 = 167.64. Therefore 5 ft 6 in = 167.64 cm.',
  },
  {
    question: 'How Many Centimeters Are in One Foot?',
    answer: 'Exactly 30.48 centimeters.',
  },
  {
    question: 'How Many Centimeters Are in One Inch?',
    answer: 'Exactly 2.54 centimeters.',
  },
  {
    question: 'Is 180 CM Equal to 6 Feet?',
    answer: `No. 180 cm is approximately ${cmToFeetAndInches(180).feet} ft ${formatInchesFriendly(cmToFeetAndInches(180).inches)} in. Exactly 6 feet equals 182.88 cm.`,
  },
  {
    question: 'How Do I Convert 165 CM to Feet?',
    answer: `165 ÷ 30.48 ≈ ${formatLength(165 / 30.48)} decimal feet, or about ${cmToFeetAndInches(165).feet} ft ${formatInchesFriendly(cmToFeetAndInches(165).inches)} in.`,
  },
];
