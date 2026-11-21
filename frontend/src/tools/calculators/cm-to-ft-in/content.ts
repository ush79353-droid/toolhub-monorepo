import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  centimetersToFeetInches,
  feetInchesToCentimeters,
  formatInchesFriendly,
  formatLength,
} from './calculation';

export const CM_TO_FT_IN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-centimeters', label: 'What Are Centimeters?' },
  { id: 'what-do-ft-and-in-mean', label: 'What Do ft and in Mean?' },
  { id: 'how-to-convert-cm', label: 'How Do You Convert CM to ft and in?' },
  { id: 'how-to-convert-ft-in', label: 'How to Convert ft and in to CM' },
  { id: 'conversion-examples', label: 'Conversion Examples' },
  { id: 'related-length-converters', label: 'Other Length Converters' },
  { id: 'cm-to-ft-in-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_CM = [100, 120, 140, 150, 160, 165, 170, 175, 178, 180, 185, 190, 200] as const;

function mixedLabel(cm: number): string {
  const { feet, inches } = centimetersToFeetInches(cm);
  return `${formatLength(feet)} ft ${formatInchesFriendly(inches)} in`;
}

export const CM_TO_FT_IN_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-centimeters',
    title: 'What Are Centimeters?',
    paragraphs: [
      'A centimeter is a metric length equal to one-hundredth of a meter (1 cm = 0.01 m; 100 cm = 1 m). Centimeters are common for body height, object dimensions, clothing, furniture, and everyday measurements.',
    ],
  },
  {
    id: 'what-do-ft-and-in-mean',
    title: 'What Do ft and in Mean?',
    paragraphs: [
      'ft means feet and in means inches. One foot equals exactly 12 inches. One inch equals exactly 2.54 centimeters, so one foot equals exactly 30.48 centimeters.',
      'A mixed measurement such as 5 ft 8 in means five complete feet plus eight additional inches. That is not the same as 5.8 decimal feet.',
      '5.8 decimal feet equals 5 ft 9.6 in. 5 ft 8 in equals approximately 5.6667 decimal feet. Keep mixed feet-and-inches distinct from decimal feet.',
    ],
    formula: '1 in = 2.54 cm  ·  1 ft = 12 in = 30.48 cm',
  },
  {
    id: 'how-to-convert-cm',
    title: 'How Do You Convert CM to ft and in?',
    paragraphs: [
      'Step 1: convert centimeters to total inches: inches = cm ÷ 2.54.',
      'Step 2: complete feet = floor(total inches ÷ 12).',
      'Step 3: remaining inches = total inches − 12 × feet.',
      `Example; 178 cm: 178 ÷ 2.54 ≈ 70.07874 total inches → ${mixedLabel(178)}.`,
    ],
    formula: 'I = cm ÷ 2.54  ·  F = ⌊I ÷ 12⌋  ·  R = I − 12F',
  },
  {
    id: 'how-to-convert-ft-in',
    title: 'How to Convert ft and in to CM',
    paragraphs: [
      'Formula: cm = (ft × 30.48) + (in × 2.54).',
      `Example; 5 ft 8 in: 5 × 30.48 = 152.4; 8 × 2.54 = 20.32; total = ${formatLength(feetInchesToCentimeters(5, 8))} cm.`,
    ],
    formula: 'cm = (ft × 30.48) + (in × 2.54)',
  },
  {
    id: 'conversion-examples',
    title: 'Conversion Examples',
    paragraphs: [
      'Common centimeter lengths with mixed feet-and-inches results. Display inches are rounded to two decimals; the calculator keeps full precision internally.',
    ],
    tableHeaders: ['Centimeters', 'Feet and inches'],
    table: EXAMPLE_CM.map((cm) => [`${formatLength(cm)} cm`, mixedLabel(cm)]),
  },
  {
    id: 'related-length-converters',
    title: 'Other Length Converters',
    paragraphs: [
      'Related Omega Calculators pages include CM Height Conversion Calculator, Centimeter Calculator, Meters to Feet Converter, and Metric Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_TO_FT_IN_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 178 CM in ft and in?',
    answer: `178 cm equals approximately ${mixedLabel(178)}. The conversion uses 1 inch = 2.54 cm exactly.`,
  },
  {
    question: 'What Are Mixed Measurements?',
    answer:
      'Mixed measurements use two or more units for one quantity, for example 5 ft 8 in for height or everyday dimensions.',
  },
  {
    question: 'How Much Is 170 CM in Feet and Inches?',
    answer: `170 cm is approximately ${mixedLabel(170)}.`,
  },
  {
    question: 'Is 180 CM Equal to 6 Feet?',
    answer: `No. 180 cm is approximately ${mixedLabel(180)}. Exactly 6 feet equals ${formatLength(feetInchesToCentimeters(6, 0))} cm.`,
  },
  {
    question: 'How Do I Convert Feet and Inches to CM?',
    answer: 'Multiply feet by 30.48 and inches by 2.54, then add both results.',
  },
  {
    question: 'How Many Inches Are in One Foot?',
    answer: 'Exactly 12 inches.',
  },
  {
    question: 'Is 5.8 Feet the Same as 5 Feet 8 Inches?',
    answer:
      'No. 5.8 decimal feet equals 5 feet 9.6 inches. 5 feet 8 inches equals approximately 5.6667 decimal feet.',
  },
];
