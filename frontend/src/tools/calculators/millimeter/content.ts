import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertLength,
  formatLength,
  METERS_PER_MM,
  MM_PER_INCH,
} from './calculation';
import {
  MM_PER_CM,
  MM_PER_FOOT,
  MM_PER_M,
  MM_PER_MILE,
  MM_PER_YARD,
} from './types';

export const MM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-millimeters', label: 'What Are Millimeters? Metric System Conversion' },
  { id: 'mm-to-inches', label: 'How to Convert Millimeters to Inches' },
  { id: 'mm-formulas', label: 'Millimeter Conversion Formulas' },
  { id: 'conversion-chart', label: 'Millimeter Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use Our Millimeter Calculator' },
  { id: 'related-tools', label: 'Other Length-Related Calculators' },
  { id: 'mm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_MM = [1, 5, 10, 20, 25.4, 50, 100, 500, 1000] as const;

export const MM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-millimeters',
    title: 'What Are Millimeters? Metric System Conversion',
    paragraphs: [
      'The Millimeter Calculator converts millimeters into metric and imperial/US length units for engineering, manufacturing, product dimensions, construction measurements, and scientific work.',
      `A millimeter is a metric length unit equal to one-thousandth of a meter: 1 mm = ${METERS_PER_MM} m.`,
      `Metric decimals: 10 mm = 1 cm; 1000 mm = 1 m; 1,000,000 mm = 1 km.`,
      'The metric system’s decimal structure makes scaling between mm, cm, m, and km straightforward.',
    ],
    formula: `1 mm = ${METERS_PER_MM} m\n${MM_PER_CM} mm = 1 cm\n${MM_PER_M} mm = 1 m\n1,000,000 mm = 1 km`,
  },
  {
    id: 'mm-to-inches',
    title: 'How to Convert Millimeters to Inches',
    paragraphs: [
      `The international inch is defined exactly as ${MM_PER_INCH} millimeters.`,
      `To convert millimeters to inches: in = mm / ${MM_PER_INCH}.`,
      `To convert inches to millimeters: mm = in × ${MM_PER_INCH}.`,
      `Example: 50.8 mm ÷ ${MM_PER_INCH} = 2 inches.`,
    ],
    formula: `1 in = ${MM_PER_INCH} mm\nin = mm / ${MM_PER_INCH}\nmm = in × ${MM_PER_INCH}\n50.8 ÷ ${MM_PER_INCH} = 2 in`,
  },
  {
    id: 'mm-formulas',
    title: 'Millimeter Conversion Formulas',
    paragraphs: [
      'Use these exact relationships through the shared meter base (no rounded intermediate factors).',
    ],
    formula: `cm = mm ÷ ${MM_PER_CM}\nm = mm ÷ ${MM_PER_M}\nkm = mm ÷ 1,000,000\nft = mm ÷ ${MM_PER_FOOT}\nyd = mm ÷ ${MM_PER_YARD}\nmi = mm ÷ ${MM_PER_MILE}`,
  },
  {
    id: 'conversion-chart',
    title: 'Millimeter Conversion Chart',
    paragraphs: [
      'Common millimeter values converted with the same exact engine as the calculator. Table display may round for readability; live fields keep full precision.',
    ],
    tableHeaders: ['Millimeters (mm)', 'Centimeters (cm)', 'Inches (in)', 'Meters (m)'],
    table: CHART_MM.map((mm) => [
      formatLength(mm),
      formatLength(convertLength(mm, 'mm', 'cm')),
      formatLength(convertLength(mm, 'mm', 'in')),
      formatLength(convertLength(mm, 'mm', 'm')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Millimeter Calculator',
    paragraphs: [
      '1. Enter a measurement in millimeters.',
      '2. View the automatically calculated imperial/US values (inches, feet, miles).',
      '3. Check the corresponding metric measurements (cm, m, km).',
      '4. Use the additional unit selectors for yards, micrometers, and other supported units.',
      '5. Enter a value in any other field for reverse conversion.',
      '6. Use Clear all changes to reset inputs.',
      '7. Use Share result to copy or share the conversion.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Length-Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Kilometer Calculator, Kilometer to Meter Converter, Inch Converter, Inch to Meter Calculator, Inches to Yard Conversion, Centimeter Calculator, Micrometer Converter, Mile Conversion Calculator, Metric to Standard Converter, Feet and Inches Calculator, Meter to Feet Converter, and Meter to Mile Converter. Only active catalog tools appear as live links.',
    ],
  },
];

export const MM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Millimeters Are in One Inch?',
    answer: `Exactly ${MM_PER_INCH} millimeters.`,
  },
  {
    question: 'How Many Millimeters Are in a Centimeter?',
    answer: `Exactly ${MM_PER_CM} millimeters.`,
  },
  {
    question: 'How Many Millimeters Are in a Meter?',
    answer: `Exactly ${MM_PER_M} millimeters.`,
  },
  {
    question: 'How Do I Convert Millimeters to Inches?',
    answer: `Divide the millimeter measurement by ${MM_PER_INCH}. For example, 127 ÷ ${MM_PER_INCH} = 5 inches.`,
  },
  {
    question: 'How Many Millimeters Are in One Foot?',
    answer: `Exactly ${MM_PER_FOOT} millimeters.`,
  },
  {
    question: 'Is 10 Millimeters Equal to One Centimeter?',
    answer: `Yes. ${MM_PER_CM} mm = 1 cm.`,
  },
  {
    question: 'What Is 50 Millimeters in Inches?',
    answer: `50 ÷ ${MM_PER_INCH} ≈ ${formatLength(convertLength(50, 'mm', 'in'))} inches.`,
  },
  {
    question: 'How Do I Convert Millimeters to Meters?',
    answer: `Divide by ${MM_PER_M}. For example, 2500 mm = 2.5 m.`,
  },
];
