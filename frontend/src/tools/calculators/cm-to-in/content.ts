import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { centimetersToInches, formatLength, inchesToCentimeters } from './calculation';
import { CM_PER_INCH } from './types';

export const CM_TO_IN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-many-inches-in-cm', label: 'How Many Inches Are in a Centimeter?' },
  { id: 'how-to-convert-cm-in', label: 'How Do I Convert CM to Inches or Inches to CM?' },
  { id: 'conversion-reference-table', label: 'Conversion Reference Table' },
  { id: 'related-length-converters', label: 'Other Conversion Related Calculators' },
  { id: 'cm-to-in-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_CM = [1, 2, 2.54, 5, 10, 15, 20, 25, 30, 36, 50, 100] as const;

/** Display helper favoring up to four decimals without trailing zeros. */
function formatTableInches(cm: number): string {
  const inches = centimetersToInches(cm);
  if (!Number.isFinite(inches)) return '';
  if (inches === 0) return '0';
  return String(Number(inches.toFixed(4)));
}

export const CM_TO_IN_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-many-inches-in-cm',
    title: 'How Many Inches Are in a Centimeter?',
    paragraphs: [
      `One international inch is defined as exactly ${CM_PER_INCH} centimeters, so 1 cm ≈ ${formatLength(centimetersToInches(1))} in.`,
      'Centimeters belong to the metric system. Inches are common in US customary and imperial length measurements.',
      'People convert between them for object sizes, furniture, clothing, screens, crafting, construction, and personal height.',
    ],
    formula: `1 in = ${CM_PER_INCH} cm  ·  1 cm ≈ ${formatLength(centimetersToInches(1))} in`,
  },
  {
    id: 'how-to-convert-cm-in',
    title: 'How Do I Convert CM to Inches or Inches to CM?',
    paragraphs: [
      `Convert centimeters to inches by dividing by ${CM_PER_INCH}: inches = cm ÷ ${CM_PER_INCH}.`,
      `Example; 36 cm: 36 ÷ ${CM_PER_INCH} ≈ ${formatLength(centimetersToInches(36))} in.`,
      `Convert inches to centimeters by multiplying by ${CM_PER_INCH}: cm = inches × ${CM_PER_INCH}.`,
      `Example; 27 in: 27 × ${CM_PER_INCH} = ${formatLength(inchesToCentimeters(27))} cm.`,
    ],
    formula: `in = cm ÷ ${CM_PER_INCH}  ·  cm = in × ${CM_PER_INCH}`,
  },
  {
    id: 'conversion-reference-table',
    title: 'Conversion Reference Table',
    paragraphs: [
      'Common centimeter lengths with inch equivalents. Table inches use up to four decimals; the calculator keeps full precision internally.',
    ],
    tableHeaders: ['Centimeters', 'Inches'],
    table: EXAMPLE_CM.map((cm) => [`${formatLength(cm)} cm`, `${formatTableInches(cm)} in`]),
  },
  {
    id: 'related-length-converters',
    title: 'Other Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include CM to Ft In Converter, Centimeter Calculator, CM Height Conversion Calculator, Meters to Feet Converter, and Metric Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_TO_IN_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 27 IN to CM?',
    answer: `Multiply inches by ${CM_PER_INCH}. 27 × ${CM_PER_INCH} = ${formatLength(inchesToCentimeters(27))} cm.`,
  },
  {
    question: 'How Do I Convert 36 CM to IN?',
    answer: `Divide centimeters by ${CM_PER_INCH}. 36 ÷ ${CM_PER_INCH} ≈ ${formatLength(centimetersToInches(36))} in.`,
  },
  {
    question: 'How Many Inches Are in 1 CM?',
    answer: `One centimeter equals approximately ${formatLength(centimetersToInches(1))} inches.`,
  },
  {
    question: 'Is 1 Inch Exactly 2.54 CM?',
    answer: `Yes. One international inch is defined as exactly ${CM_PER_INCH} centimeters.`,
  },
  {
    question: 'How Many CM Are in 12 Inches?',
    answer: `12 × ${CM_PER_INCH} = ${formatLength(inchesToCentimeters(12))} cm.`,
  },
  {
    question: 'How Do I Convert Inches to CM Without a Calculator?',
    answer: `Multiply inches by ${CM_PER_INCH}. Multiplying by 2.5 is a rough mental estimate; the exact factor is ${CM_PER_INCH}.`,
  },
];
