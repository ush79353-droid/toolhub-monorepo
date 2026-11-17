import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertLength, formatLength, MICRONS_PER_MIL, MILS_PER_INCH } from './calculation';

export const MIL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-mil', label: 'What Is a Mil?' },
  { id: 'mil-to-imperial', label: 'Converting Mil to Other Imperial Units' },
  { id: 'mil-to-metric', label: 'Converting Mil to Metric Units' },
  { id: 'example-mil-to-um', label: 'Example — Convert Mil to Micrometers' },
  { id: 'how-to-use', label: 'How to Use the Mil Conversion Calculator' },
  { id: 'conversion-chart', label: 'Mil Conversion Chart' },
  { id: 'related-tools', label: 'Other Mil Conversion Tools' },
  { id: 'mil-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_MILS = [1, 5, 10, 20, 25, 40, 50, 100, 500, 1000] as const;

export const MIL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-mil',
    title: 'What Is a Mil?',
    paragraphs: [
      'A mil is one-thousandth of an international inch. It is also called a thou. Exactly 1,000 mils make one inch, and one mil equals 25.4 micrometers.',
      'Mils are commonly used for thin materials, films, coatings, manufacturing tolerances, and engineering specifications.',
      'Do not confuse a mil with a millimeter (mm) or a milliradian. This calculator uses the length definition only.',
    ],
    formula: `1 mil = 0.001 in\n1 mil = ${MICRONS_PER_MIL} µm\n1 mil = 0.0254 mm\n1 mil = 0.0000254 m`,
  },
  {
    id: 'mil-to-imperial',
    title: 'Calculating the Conversion from Mil to Other Imperial Units',
    paragraphs: [
      'Within Imperial/US customary measure, mils nest cleanly into inches, feet, and yards.',
      `Examples: ${MILS_PER_INCH} mil = 1 inch; 12,000 mil = 1 foot; 36,000 mil = 1 yard.`,
    ],
    formula: `in = mil / ${MILS_PER_INCH}\nft = mil / 12000\nyd = mil / 36000`,
  },
  {
    id: 'mil-to-metric',
    title: 'Converting Mil to Metric Units',
    paragraphs: [
      'Use the exact SI link through meters (1 mil = 0.0000254 m), or the convenient micrometers and millimeters factors.',
    ],
    formula: `µm = mil × ${MICRONS_PER_MIL}\nmm = mil × 0.0254\ncm = mil × 0.00254\nm = mil × 0.0000254`,
  },
  {
    id: 'example-mil-to-um',
    title: 'Example — Convert Mil to Micrometers',
    paragraphs: [
      `Convert 10 mil to micrometers: multiply by ${MICRONS_PER_MIL}.`,
      `10 × ${MICRONS_PER_MIL} = ${formatLength(convertLength(10, 'mil', 'um'))} µm.`,
      `Therefore 10 mil = ${formatLength(convertLength(10, 'mil', 'um'))} micrometers.`,
    ],
    formula: `µm = mil × ${MICRONS_PER_MIL}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mil Conversion Calculator',
    paragraphs: [
      '1. Enter a value in mils.',
      '2. View the equivalent metric and imperial values.',
      '3. Expand the unit groups and choose additional units from the selectors.',
      '4. Edit any supported unit field to reverse the calculation.',
      '5. Use Clear or Reload when needed.',
      'Fields start empty. Signed lengths are allowed mathematically.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Mil Conversion Chart',
    paragraphs: [
      'Common mil values converted with the same exact engine as the calculator.',
    ],
    tableHeaders: ['Mil', 'Microns (µm)', 'Millimeters (mm)', 'Inches (in)'],
    table: CHART_MILS.map((mil) => [
      formatLength(mil),
      formatLength(convertLength(mil, 'mil', 'um')),
      formatLength(convertLength(mil, 'mil', 'mm')),
      formatLength(convertLength(mil, 'mil', 'in')),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Mil Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Micron to Mil Conversion Calculator, Micrometer Converter, Inch Converter, Length Converter, Millimeter Calculator, Imperial to Metric Conversion, Metric to Standard Converter, in to cm Converter, Inch to Meter Calculator, and Kilometer Calculator. Only active catalog tools appear as live links.',
    ],
  },
];

export const MIL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Inches to Thou?',
    answer: `Multiply inches by ${MILS_PER_INCH}. thou = in × ${MILS_PER_INCH}. For example, 0.025 inch = 25 thou.`,
  },
  {
    question: 'How Much Is a Mil?',
    answer: `A mil is one-thousandth of an inch. 1 mil = 0.001 in = ${MICRONS_PER_MIL} microns.`,
  },
  {
    question: 'How Much Is 1 mm in Mils?',
    answer: `1 mm = 1 / 0.0254 mil ≈ ${formatLength(convertLength(1, 'mm', 'mil'))} mil.`,
  },
  {
    question: 'Is Mil the Same as Millimeter?',
    answer: `No. One mil is 0.0254 millimeters. One millimeter is approximately ${formatLength(convertLength(1, 'mm', 'mil'))} mils.`,
  },
  {
    question: 'How Many Mils Are in One Inch?',
    answer: `Exactly ${MILS_PER_INCH} mils.`,
  },
  {
    question: 'How Thick Is 10 Mil?',
    answer: `10 mil is 0.01 inch, 0.254 millimeter, and ${formatLength(convertLength(10, 'mil', 'um'))} microns.`,
  },
  {
    question: 'What Is the Difference Between a Mil and a Micron?',
    answer: `A micron is one-millionth of a meter. A mil is one-thousandth of an inch. One mil equals exactly ${MICRONS_PER_MIL} microns.`,
  },
];
