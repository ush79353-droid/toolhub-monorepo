import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ccToLiters, ccToMl, formatVolume, litersToCc } from './calculation';
import { ML_PER_LITER } from './types';

export const CC_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cc-ml', label: 'What Is cc? What Is mL?' },
  { id: 'how-to-convert-cc-to-ml', label: 'How to Convert cc to mL?' },
  { id: 'related-volume-tools', label: 'Volume Conversion Related Calculators' },
  { id: 'cc-to-ml-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CC = [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 750, 1000, 2000, 5000] as const;

export const CC_TO_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-cc-ml',
    title: 'What Is cc? What Is mL?',
    paragraphs: [
      'cc means cubic centimeter. cm³ is the SI-style symbol for the same unit. mL means milliliter. All three measure volume.',
      'A cubic centimeter is the volume of a cube with edges of one centimeter. By definition, one cubic centimeter equals one milliliter.',
      'These units appear in medicine (syringes), laboratories, liquid product labels, engine displacement (often labeled in cc), and general scientific volume work.',
      'Industries may prefer different labels, but the volumes are exactly equivalent: 1 cc = 1 cm³ = 1 mL.',
    ],
    formula: '1 cc = 1 cm³ = 1 mL',
  },
  {
    id: 'how-to-convert-cc-to-ml',
    title: 'How to Convert cc to mL?',
    paragraphs: [
      'Step 1: Determine the volume in cubic centimeters. Example: Volume = 100 cc.',
      'Step 2: Use the one-to-one relationship: 1 cc = 1 mL.',
      'Step 3: Convert: 100 cc = 100 mL.',
      `Step 4: If liters are needed, divide by ${ML_PER_LITER.toLocaleString('en-US')}: 100 / ${ML_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(100))} L.`,
      `Final result: 100 cc = 100 mL = ${formatVolume(ccToLiters(100))} L.`,
    ],
    formula: `mL = cc · L = cc / ${ML_PER_LITER.toLocaleString('en-US')}`,
    tableHeaders: ['Cubic Centimeters (cc)', 'Milliliters (mL)', 'Liters (L)'],
    table: TABLE_CC.map((cc) => [
      formatVolume(cc),
      formatVolume(ccToMl(cc)),
      formatVolume(ccToLiters(cc)),
    ]),
  },
  {
    id: 'related-volume-tools',
    title: 'Here Are Some Volume Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Volume Conversion, cc to Liter Converter, Liter to cc Converter, Liters to Centiliters Converter, L to Gal Converter, Cubic Meter Calculator, and mL to Cups Converter. Only active catalog tools appear as live site links.',
    ],
  },
];

export const CC_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is Volume?',
    answer:
      'Volume is the amount of three-dimensional space occupied by an object or substance. Common units include cubic centimeters, milliliters, liters, and cubic meters.',
  },
  {
    question: 'How Can I Convert cc to mL?',
    answer: `The conversion is one-to-one: 1 cc = 1 mL. Therefore 10 cc = 10 mL, 50 cc = 50 mL, and 100 cc = 100 mL. No multiplication or division is required between cc and mL.`,
  },
  {
    question: 'Can Volume Be Negative?',
    answer:
      'Physical volume is nonnegative. A negative value is not valid for a normal volume measurement in this converter.',
  },
  {
    question: 'Does Volume Only Apply to Liquids?',
    answer:
      'No. Volume applies to solids, liquids, and gases; anything that occupies three-dimensional space.',
  },
  {
    question: 'Is 1 cc the Same as 1 mL?',
    answer: 'Yes. 1 cc = 1 mL. They are exactly equivalent units of volume.',
  },
  {
    question: 'How Many cc Are in 1 Liter?',
    answer: `1 L = ${ML_PER_LITER.toLocaleString('en-US')} cc = ${formatVolume(litersToCc(1))} cc.`,
  },
  {
    question: 'How Many mL Are in 500 cc?',
    answer: `500 cc = ${formatVolume(ccToMl(500))} mL.`,
  },
  {
    question: 'What Is the Difference Between cc and mL?',
    answer:
      'There is no difference in the amount of volume represented. The distinction is mainly in naming and industry preference.',
  },
];
