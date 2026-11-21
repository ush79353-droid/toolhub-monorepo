import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass, kgToLbs, lbsToKg, KG_PER_POUND, LBS_PER_KG } from './calculation';

export const KG_TO_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert kg to Pounds' },
  { id: 'how-to-use', label: 'How to Use This kg to lbs Converter' },
  { id: 'lbs-to-kg', label: 'How to Convert Pounds to Kilograms' },
  { id: 'what-is-kg', label: 'What Is a Kilogram?' },
  { id: 'what-is-lb', label: 'What Is a Pound?' },
  { id: 'conversion-table', label: 'kg to lbs Conversion Table' },
  { id: 'common-uses', label: 'Common Uses of kg to lbs Conversion' },
  { id: 'related-converters', label: 'Related Weight Converters' },
  { id: 'kg-to-lbs-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KG = [0, 0.5, 1, 2, 5, 10, 20, 25, 50, 62, 75, 100, 500, 1000] as const;

export const KG_TO_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert kg to Pounds',
    paragraphs: [
      'This tool converts mass between kilograms and international avoirdupois pounds instantly. Both directions are supported.',
      `Multiply kilograms by ${formatMass(LBS_PER_KG)}, or equivalently divide by ${KG_PER_POUND} (the exact kilogram mass of one pound).`,
      `Example; convert 50 kg: 50 × ${formatMass(LBS_PER_KG)} ≈ ${formatMass(kgToLbs(50))} lb. One kilogram is approximately ${formatMass(LBS_PER_KG)} pounds.`,
    ],
    formula: `lb = kg × ${formatMass(LBS_PER_KG)}   ·   lb = kg ÷ ${KG_PER_POUND}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This kg to lbs Converter',
    paragraphs: [
      '1. Enter the mass in kilograms.',
      '2. View the converted value in pounds.',
      '3. Alternatively, enter pounds to calculate kilograms.',
      '4. Edit either field to recalculate instantly.',
      'Negative mass values are rejected. The informal plural “lbs” appears in everyday writing; the standard unit symbol is lb.',
    ],
  },
  {
    id: 'lbs-to-kg',
    title: 'How to Convert Pounds to Kilograms',
    paragraphs: [
      `Multiply pounds by ${KG_PER_POUND}.`,
      `Example; convert 100 lb: 100 × ${KG_PER_POUND} = ${formatMass(lbsToKg(100))} kg.`,
    ],
    formula: `kg = lb × ${KG_PER_POUND}`,
  },
  {
    id: 'what-is-kg',
    title: 'What Is a Kilogram?',
    paragraphs: [
      'The kilogram (kg) is the SI base unit of mass. It is used in science, healthcare, industry, shipping, and everyday measurements.',
      'One kilogram equals exactly 1,000 grams.',
    ],
  },
  {
    id: 'what-is-lb',
    title: 'What Is a Pound?',
    paragraphs: [
      `The international avoirdupois pound (lb) is a unit of mass equal to exactly ${KG_PER_POUND} kilograms.`,
      'It is commonly used in the United States and in some other measurement contexts. This converter uses the international pound, not a local historical pound.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kg to lbs Conversion Table',
    paragraphs: [
      'Common kilogram values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilograms (kg)', 'Pounds (lb)'],
    table: TABLE_KG.map((kg) => [formatMass(kg), formatMass(kgToLbs(kg))]),
  },
  {
    id: 'common-uses',
    title: 'Common Uses of kg to lbs Conversion',
    paragraphs: [
      'People convert kilograms to pounds for body mass, fitness tracking, luggage allowances, shipping labels, grocery quantities, product specifications, and comparing metric and customary measurements across markets.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Related Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, g to lbs Converter, lbs to kg Converter, kg to g Converter, Pounds to Ounces Converter, Pounds to Tons Converter, Grams to Ounces Converter, Ounces to Pounds Converter, and Stone to kg Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KG_TO_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Pounds Are in 1 kg?',
    answer: `1 kilogram is approximately ${formatMass(kgToLbs(1))} pounds.`,
  },
  {
    question: 'How Do I Convert 62 kg to Pounds?',
    answer: `Multiply 62 by approximately ${formatMass(LBS_PER_KG)}. 62 × ${formatMass(LBS_PER_KG)} ≈ ${formatMass(kgToLbs(62))} lb.`,
  },
  {
    question: 'How Much Is 50 kg in Pounds?',
    answer: `50 × ${formatMass(LBS_PER_KG)} ≈ ${formatMass(kgToLbs(50))} lb.`,
  },
  {
    question: 'How Do I Convert Pounds to kg?',
    answer: `Multiply the number of pounds by ${KG_PER_POUND}.`,
  },
  {
    question: 'What Is 100 Pounds in kg?',
    answer: `100 × ${KG_PER_POUND} = ${formatMass(lbsToKg(100))} kg.`,
  },
  {
    question: 'Is 1 kg Equal to 2.2 lbs?',
    answer: `Approximately yes. For greater precision, 1 kilogram is approximately ${formatMass(kgToLbs(1))} pounds.`,
  },
  {
    question: 'How Do I Convert Price per kg to Price per Pound?',
    answer: `Use Price/lb = Price/kg × ${KG_PER_POUND}. Example: if a product costs $10 per kg, then 10 × ${KG_PER_POUND} ≈ $${formatMass(10 * KG_PER_POUND)} per pound. This converts a unit price, not a mass measurement.`,
  },
];
