import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertLength, formatLength } from './calculation';

export const NM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'nm Converter' },
  { id: 'what-are-nm', label: 'What Are Nanometers?' },
  { id: 'how-to-convert', label: 'How Do I Convert Nanometers to Other Units?' },
  { id: 'metric', label: 'Nanometer Conversion Between Metric Units' },
  { id: 'nm-to-mm', label: 'Converting Nanometers to Millimeters' },
  { id: 'km-to-nm', label: 'Converting Kilometers to Nanometers' },
  { id: 'other-conversions', label: 'Other Nanometer Conversions' },
  { id: 'how-to-use', label: 'How to Use the nm Converter' },
  { id: 'related-tools', label: 'More Than the Conversion of Nanometers' },
  { id: 'nm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_NM = [1, 10, 100, 1000, 10_000, 100_000, 1_000_000, 1_000_000_000] as const;

export const NM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'nm Converter',
    paragraphs: [
      'Convert nanometers (nm) into metric, imperial, and scientific length units such as micrometers, millimeters, meters, inches, feet, and ångströms. Useful for nanotechnology, semiconductor manufacturing, optics, materials science, microscopy, molecular measurements, and research.',
      'Exact SI definition: 1 nm = 10⁻⁹ m. Edit any field — all values stay linked through meters.',
    ],
  },
  {
    id: 'what-are-nm',
    title: 'What Are Nanometers?',
    paragraphs: [
      'A nanometer is one billionth of a meter: 1 nm = 10⁻⁹ m. Nanometers describe extremely small lengths such as nanoscale structures, thin films, and wavelengths of visible light (commonly hundreds of nanometers).',
      `Also: 1 nm = ${formatLength(convertLength(1, 'nm', 'um'))} µm = ${formatLength(convertLength(1, 'nm', 'angstrom'))} Å.`,
    ],
    formula: `1 nm = 10⁻⁹ m\n1 nm = 0.001 µm\n1 nm = 10 Å`,
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Nanometers to Other Units?',
    paragraphs: [
      'Convert through meters: Result = (input × meters per input unit) ÷ (meters per output unit).',
      `µm = nm ÷ 1000. Example: 100 nm = ${formatLength(convertLength(100, 'nm', 'um'))} µm.`,
      `mm = nm ÷ 1,000,000. Example: 100 nm = ${formatLength(convertLength(100, 'nm', 'mm'))} mm.`,
      `m = nm ÷ 1,000,000,000. Example: 100 nm = ${formatLength(convertLength(100, 'nm', 'm'))} m.`,
      `Å = nm × 10. Example: 100 nm = ${formatLength(convertLength(100, 'nm', 'angstrom'))} Å.`,
    ],
    formula: `µm = nm ÷ 1000\nmm = nm ÷ 1,000,000\nm = nm ÷ 1,000,000,000\nÅ = nm × 10`,
  },
  {
    id: 'metric',
    title: 'Nanometer Conversion Between Metric Units',
    paragraphs: [
      'Metric prefixes are powers of ten. Common nanometer equivalents:',
    ],
    tableHeaders: ['Nanometers', 'Micrometers', 'Millimeters', 'Meters'],
    table: TABLE_NM.map((nm) => [
      formatLength(nm),
      formatLength(convertLength(nm, 'nm', 'um')),
      formatLength(convertLength(nm, 'nm', 'mm')),
      formatLength(convertLength(nm, 'nm', 'm')),
    ]),
    formula: `1 pm = 0.001 nm\n1 µm = 1000 nm\n1 mm = 1,000,000 nm\n1 m = 1,000,000,000 nm\n1 km = 1,000,000,000,000 nm`,
  },
  {
    id: 'nm-to-mm',
    title: 'Converting Nanometers to Millimeters',
    paragraphs: [
      'Divide nanometers by 1,000,000.',
      `Example — 500,000 nm: 500000 ÷ 1000000 = ${formatLength(convertLength(500_000, 'nm', 'mm'))} mm.`,
      `Result: 500,000 nm = ${formatLength(convertLength(500_000, 'nm', 'mm'))} mm.`,
    ],
  },
  {
    id: 'km-to-nm',
    title: 'Converting Kilometers to Nanometers',
    paragraphs: [
      `1 km = ${formatLength(convertLength(1, 'km', 'nm'))} nm = 10¹² nm.`,
      `Therefore 0.001 km = ${formatLength(convertLength(0.001, 'km', 'nm'))} nm = 10⁹ nm.`,
    ],
    formula: `1 km = 10¹² nm\n0.001 km = 10⁹ nm`,
  },
  {
    id: 'other-conversions',
    title: 'Other Nanometer Conversions',
    paragraphs: [
      `Ångströms: 1 nm = 10 Å. Micrometers: 1 µm = 1000 nm. Millimeters: 1 mm = 1,000,000 nm.`,
      `Inches: 1 in = ${formatLength(convertLength(1, 'in', 'nm'))} nm. Feet: 1 ft = ${formatLength(convertLength(1, 'ft', 'nm'))} nm.`,
      'Use the Imperial / US and Others sections to convert in either direction without separate tools.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the nm Converter',
    paragraphs: [
      '1. Enter a value in the Nanometers field.',
      '2. View automatically calculated equivalents in the summary.',
      '3. Open Metric to select picometers through kilometers.',
      '4. Open Imperial / US for inches, feet, yards, or miles.',
      '5. Open Others for ångströms.',
      '6. Edit any unit field to reverse the conversion.',
      '7. Share, reload, or clear with the calculator actions.',
    ],
  },
  {
    id: 'related-tools',
    title: 'More Than the Conversion of Nanometers',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter / Meter Converter, Millimeter Calculator, mm Calculator, mm to m Conversion, mm to km Conversion, and Mil Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const NM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 100 nm to mm?',
    answer: `100 ÷ 1,000,000 = ${formatLength(convertLength(100, 'nm', 'mm'))}. Result: 100 nm = ${formatLength(convertLength(100, 'nm', 'mm'))} mm.`,
  },
  {
    question: 'How Many Nanometers Are in One Millimeter?',
    answer: `1 mm = ${formatLength(convertLength(1, 'mm', 'nm'))} nm.`,
  },
  {
    question: 'How Many Nanometers Are in One Meter?',
    answer: `1 m = ${formatLength(convertLength(1, 'm', 'nm'))} nm.`,
  },
  {
    question: 'How Many Nanometers Are in 450 nm?',
    answer: `450 nm is already in nanometers. Equivalents: ${formatLength(convertLength(450, 'nm', 'um'))} µm, ${formatLength(convertLength(450, 'nm', 'mm'))} mm, ${formatLength(convertLength(450, 'nm', 'm'))} m.`,
  },
  {
    question: 'How Do I Convert Nanometers to Angstroms?',
    answer: `Multiply nanometers by 10. 1 nm = 10 Å. Example: 5 nm = ${formatLength(convertLength(5, 'nm', 'angstrom'))} Å.`,
  },
  {
    question: 'What Is the Difference Between a Nanometer and a Micrometer?',
    answer: `One micrometer is 1000 nanometers: 1 µm = 1000 nm.`,
  },
  {
    question: 'What Is Smaller Than a Nanometer?',
    answer: `A picometer is smaller: 1 nm = 1000 pm.`,
  },
];
