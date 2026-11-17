import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  milsToMicrons,
  micronsToMils,
  MICRONS_PER_MIL,
} from './calculation';

export const MICRON_TO_MIL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-micron', label: 'What Is a Micron?' },
  { id: 'what-is-a-mil', label: 'What Is a Mil?' },
  { id: 'microns-to-mils', label: 'How to Convert Microns to Mils' },
  { id: 'mils-to-microns', label: 'How to Convert Mils to Microns' },
  { id: 'conversion-chart', label: 'Micron to Mil Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Micron to Mil Calculator' },
  { id: 'related-tools', label: 'Other Conversion Tools' },
  { id: 'micron-to-mil-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  highlight?: readonly string[];
}

const CHART_MICRONS = [1, 5, 10, 25.4, 50, 100, 127, 254, 500, 1000] as const;

export const MICRON_TO_MIL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-micron',
    title: 'What Is a Micron?',
    paragraphs: [
      'A micron is another name for a micrometer. Its symbol is µm. One micron equals one-millionth of a meter (10⁻⁶ m), and 1,000 microns equal 1 millimeter.',
      'Microns are commonly used for material thickness, coatings, films, particle sizes, and manufacturing tolerances.',
    ],
    formula: '1 µm = 10⁻⁶ m\n1000 µm = 1 mm',
  },
  {
    id: 'what-is-a-mil',
    title: 'What Is a Mil?',
    paragraphs: [
      'A mil is one-thousandth of an inch (0.001 in). It is also called a thou. Exactly 1 mil = 25.4 microns.',
      'A mil is not a millimeter and not a milliradian. One millimeter is about 39.3701 mils.',
      'Mils are used for coating thickness, plastic films, engineering drawings, and manufacturing specifications.',
    ],
    formula: `1 mil = 0.001 in = ${MICRONS_PER_MIL} µm`,
  },
  {
    id: 'microns-to-mils',
    title: 'How to Convert Microns to Mils',
    paragraphs: [
      `Divide the micron value by ${MICRONS_PER_MIL}.`,
      `Example — convert 100 microns: 100 ÷ ${MICRONS_PER_MIL} ≈ ${formatLength(micronsToMils(100))} mil.`,
    ],
    formula: `mil = µm / ${MICRONS_PER_MIL}`,
  },
  {
    id: 'mils-to-microns',
    title: 'How to Convert Mils to Microns',
    paragraphs: [
      `Multiply the mil value by ${MICRONS_PER_MIL}.`,
      `Example — convert 40 mils: 40 × ${MICRONS_PER_MIL} = ${formatLength(milsToMicrons(40))} µm.`,
    ],
    formula: `µm = mil × ${MICRONS_PER_MIL}`,
  },
  {
    id: 'conversion-chart',
    title: 'Micron to Mil Conversion Chart',
    paragraphs: [
      `To convert microns to mils, divide by ${MICRONS_PER_MIL}. To convert mils to microns, multiply by ${MICRONS_PER_MIL}.`,
      'Values below use the same exact factor as the calculator.',
    ],
    highlight: [
      '1 micron ≈ 0.03937 mil',
      `1 mil = exactly ${MICRONS_PER_MIL} microns`,
    ],
    tableHeaders: ['Microns (µm)', 'Mils'],
    table: CHART_MICRONS.map((um) => [
      formatLength(um),
      formatLength(Number(micronsToMils(um).toFixed(7))),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Micron to Mil Calculator',
    paragraphs: [
      '1. Enter the length in microns or mils.',
      '2. Read the converted value in the other field.',
      '3. Edit either field to reverse the calculation.',
      '4. Expand More conversion options for mm, cm, m, in, and nm.',
      '5. Use the conversion chart to compare common values.',
      'Fields start empty. Signed lengths are allowed mathematically.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Micrometer Converter, Inch Converter, Length Converter, Millimeter Calculator, Nanometer Converter, Metric to Standard Converter, Imperial to Metric Conversion, in to cm Converter, Inch to Meter Calculator, and Kilometer Calculator. Only active catalog tools appear as live links.',
    ],
  },
];

export const MICRON_TO_MIL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Microns Are in a Mil?',
    answer: `Exactly ${MICRONS_PER_MIL} microns. 1 mil = ${MICRONS_PER_MIL} µm.`,
  },
  {
    question: 'How Big Is 50 Microns?',
    answer: `50 microns equals 0.05 millimeters, approximately ${formatLength(micronsToMils(50))} mils, and approximately ${formatLength(50 / 25400)} inches.`,
  },
  {
    question: 'How Thick Is 40 Mil?',
    answer: `40 mil equals 0.04 inches, 1.016 millimeters, and ${formatLength(milsToMicrons(40))} microns.`,
  },
  {
    question: 'What Is 50 Mil in Microns?',
    answer: `50 × ${MICRONS_PER_MIL} = ${formatLength(milsToMicrons(50))} µm.`,
  },
  {
    question: 'Are Mils and Millimeters the Same?',
    answer:
      'No. A mil is 0.001 inch, whereas a millimeter is 0.001 meter. One millimeter equals approximately 39.3701 mils.',
  },
  {
    question: 'How Do I Convert Microns to Mils?',
    answer: `Divide the micron measurement by ${MICRONS_PER_MIL}. For example, 254 µm = 10 mil.`,
  },
];
