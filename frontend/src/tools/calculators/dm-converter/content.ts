import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertDm, formatLength } from './calculation';

export const DM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dm', label: 'What Is a Decimeter?' },
  { id: 'dm-to-m', label: 'How to Convert dm to m? The Basic dm Conversion' },
  { id: 'dm-to-cm', label: 'Converting dm to cm: Conversion Factor and Example' },
  { id: 'related-tools', label: 'More Than Converting Decimeters' },
  { id: 'dm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const DM_TABLE = [1, 2, 5, 10, 25, 50, 100] as const;

export const DM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-dm',
    title: 'What Is a Decimeter?',
    paragraphs: [
      'A decimeter (dm) is a metric length unit equal to one-tenth of a meter. The prefix deci- means one-tenth, so 1 dm = 0.1 m = 10 cm = 100 mm.',
      'Decimeters are less common in everyday speech than centimeters or meters, but they clarify metric scaling. Do not confuse linear dm with dm² (area) or dm³ (volume). Notably, 1 dm³ equals exactly 1 liter — that relationship is for cubic decimeters, not for a one-dimensional decimeter length.',
    ],
    formula: '1 dm = 0.1 m = 10 cm = 100 mm   ·   1 dm³ = 1 L (volume only)',
  },
  {
    id: 'dm-to-m',
    title: 'How to Convert dm to m? The Basic dm Conversion',
    paragraphs: [
      'Convert decimeters to meters by dividing by 10 (or multiplying by 0.1). Example: 27.94 dm ÷ 10 = 2.794 m.',
      'Convert meters to decimeters by multiplying by 10. The converter also updates millimeters, kilometers, feet, inches, and specialized units from the same meter-normalized value.',
    ],
    formula: 'Meters = Decimeters ÷ 10   ·   Decimeters = Meters × 10',
  },
  {
    id: 'dm-to-cm',
    title: 'Converting dm to cm: Conversion Factor and Example',
    paragraphs: [
      'One decimeter contains exactly 10 centimeters, so centimeters = decimeters × 10. Example: 27.94 dm × 10 = 279.4 cm. Reverse: decimeters = centimeters ÷ 10.',
    ],
    formula: 'Centimeters = Decimeters × 10',
    tableHeaders: ['Decimeters', 'Centimeters', 'Meters'],
    table: DM_TABLE.map((dm) => [
      formatLength(dm),
      formatLength(convertDm(dm, 'dm', 'cm')),
      formatLength(convertDm(dm, 'dm', 'm')),
    ]),
  },
  {
    id: 'related-tools',
    title: 'More Than Converting Decimeters',
    paragraphs: [
      'Related Omega Calculators pages may include Distance Converter, Meter Converter, Centimeter Calculator, Metric Converter, and meters/centimeters specialty tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert from dm to cm?',
    answer: `Multiply decimeters by 10. Example: 3 dm = ${formatLength(convertDm(3, 'dm', 'cm'))} cm.`,
  },
  {
    question: 'How Much Is 1.75 m in dm?',
    answer: `Multiply meters by 10: 1.75 × 10 = ${formatLength(convertDm(1.75, 'm', 'dm'))} dm.`,
  },
  {
    question: 'What Is the Relationship Between dm and L?',
    answer:
      'A decimeter is length; a liter is volume. A cubic decimeter equals one liter (1 dm³ = 1 L). A linear decimeter cannot convert to liters without a volume.',
  },
  {
    question: 'Is a Decimeter Larger Than a Centimeter?',
    answer: 'Yes. One decimeter equals 10 centimeters.',
  },
  {
    question: 'How Many Decimeters Are in a Kilometer?',
    answer: `There are ${formatLength(convertDm(1, 'km', 'dm'))} decimeters in one kilometer (1 km = 10,000 dm).`,
  },
];
