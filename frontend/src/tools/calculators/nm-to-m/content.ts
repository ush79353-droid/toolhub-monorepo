import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  metersToNanometers,
  nanometersToMeters,
  NANOMETERS_PER_METER,
} from './calculation';

export const NM_TO_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'nm to m Converter' },
  { id: 'what-is-nm', label: 'What Is a Nanometer?' },
  { id: 'how-to-convert', label: 'How to Convert nm to m' },
  { id: 'examples', label: 'Examples of Conversion From Nanometers to Meters' },
  { id: 'conversion-table', label: 'Nanometers to Meters Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the nm to m Converter' },
  { id: 'related-tools', label: 'Other Length Conversion Tools' },
  { id: 'nm-to-m-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_NM = [
  1, 10, 100, 120, 500, 1000, 10_000, 100_000, 1_000_000, 1_000_000_000,
] as const;

const billion = NANOMETERS_PER_METER.toLocaleString('en-US');

export const NM_TO_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'nm to m Converter',
    paragraphs: [
      'Convert nanometers (nm) to meters (m) and meters back to nanometers instantly. Enter a value in either field and the other updates automatically.',
      'Useful for nanotechnology, semiconductor process checks, microscopy scale bars, optics wavelengths, materials science, molecular models, and classroom SI practice.',
    ],
  },
  {
    id: 'what-is-nm',
    title: 'What Is a Nanometer?',
    paragraphs: [
      `A nanometer is one billionth of a meter: 1 nm = ${formatLength(nanometersToMeters(1))} m = 10⁻⁹ m.`,
      'Nanometers describe extremely small lengths; thin films, feature sizes on chips, probe tips, and many wavelengths of visible light (often a few hundred nanometers).',
      'Related metric steps: 1 µm = 1,000 nm, 1 mm = 1,000,000 nm, and 1 m = 1,000,000,000 nm.',
    ],
    formula: `1 nm = 10⁻⁹ m\n1 m = ${billion} nm`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert nm to m',
    paragraphs: [
      `Divide nanometers by one billion: m = nm ÷ ${billion} (or m = nm × 10⁻⁹).`,
      `Example; convert 250 nm: 250 ÷ ${billion} = ${formatLength(nanometersToMeters(250))} m.`,
      `Meters to nanometers: multiply by one billion: nm = m × ${billion}.`,
      `Example; convert 0.002 m: 0.002 × ${billion} = ${formatLength(metersToNanometers(0.002))} nm.`,
    ],
    formula: `m = nm ÷ ${billion}\nnm = m × ${billion}\n250 nm = ${formatLength(nanometersToMeters(250))} m`,
  },
  {
    id: 'examples',
    title: 'Examples of Conversion From Nanometers to Meters',
    paragraphs: [
      `Example 1: 14 nm: 14 × 10⁻⁹ = ${formatLength(nanometersToMeters(14))} m.`,
      `Example 2: 120 nm: 120 × 10⁻⁹ = ${formatLength(nanometersToMeters(120))} m.`,
      `Example 3: 500 nm: 500 × 10⁻⁹ = ${formatLength(nanometersToMeters(500))} m.`,
      `Example 4: 1.75 m: 1.75 × ${billion} = ${formatLength(metersToNanometers(1.75))} nm.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Nanometers to Meters Conversion Table',
    paragraphs: [
      'Verified nanometer values converted with the same SI factor as the calculator.',
    ],
    tableHeaders: ['Nanometers (nm)', 'Meters (m)'],
    table: TABLE_NM.map((nm) => [formatLength(nm), formatLength(nanometersToMeters(nm))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the nm to m Converter',
    paragraphs: [
      '1. Enter a value in the Nanometers field.',
      '2. Read the corresponding value in meters.',
      '3. Alternatively, enter a value in meters.',
      '4. The calculator updates nanometers automatically.',
      '5. Use Share Result to copy or share the conversion.',
      '6. Use Reload Calculator to restore the default (100 nm), or Clear All Changes to empty both fields.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include nm Converter, Micrometer Converter, Millimeter Calculator, mm Calculator, mm to m Conversion, mm to km Conversion, Length Converter, and Metric to Standard Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const NM_TO_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 120 Nanometers in Meters?',
    answer: `120 × 10⁻⁹ = ${formatLength(nanometersToMeters(120))} m.`,
  },
  {
    question: 'How Do I Convert nm to m?',
    answer: `Divide the number of nanometers by one billion: m = nm ÷ ${billion}.`,
  },
  {
    question: 'What Is the nm to m Conversion Factor?',
    answer: 'The factor is 10⁻⁹. Each nanometer equals one billionth of a meter.',
  },
  {
    question: 'How Many Nanometers Are in One Meter?',
    answer: `There are exactly ${billion} nanometers in one meter (1 m = 10⁹ nm).`,
  },
  {
    question: 'How Do I Convert 450 nm to Meters?',
    answer: `450 ÷ ${billion} = ${formatLength(nanometersToMeters(450))} m.`,
  },
  {
    question: 'Is a Nanometer Smaller Than a Micrometer?',
    answer: 'Yes. 1 µm = 1,000 nm, so a nanometer is one-thousandth of a micrometer.',
  },
];
