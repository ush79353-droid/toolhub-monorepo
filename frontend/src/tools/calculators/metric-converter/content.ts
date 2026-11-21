import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMetricNumber } from './calculation';
import { convertLength } from './units';

export const METRIC_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-metric-system', label: 'What Is the Metric System?' },
  { id: 'how-to-convert-metric-units', label: 'How to Convert Metric Units' },
  { id: 'metric-prefix-tables', label: 'Metric Prefixes and Conversion Tables' },
  { id: 'example-converting-metric-units', label: 'Example of Converting Metric Units' },
  { id: 'other-measurement-converters', label: 'Other Measurement Unit Converters' },
  { id: 'metric-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const SUBMULTIPLES: readonly string[][] = [
  ['deci', 'd', '10⁻¹'],
  ['centi', 'c', '10⁻²'],
  ['milli', 'm', '10⁻³'],
  ['micro', 'µ', '10⁻⁶'],
  ['nano', 'n', '10⁻⁹'],
  ['pico', 'p', '10⁻¹²'],
  ['femto', 'f', '10⁻¹⁵'],
  ['atto', 'a', '10⁻¹⁸'],
  ['zepto', 'z', '10⁻²¹'],
  ['yocto', 'y', '10⁻²⁴'],
  ['ronto', 'r', '10⁻²⁷'],
  ['quecto', 'q', '10⁻³⁰'],
];

const MULTIPLES: readonly string[][] = [
  ['deca', 'da', '10¹'],
  ['hecto', 'h', '10²'],
  ['kilo', 'k', '10³'],
  ['mega', 'M', '10⁶'],
  ['giga', 'G', '10⁹'],
  ['tera', 'T', '10¹²'],
  ['peta', 'P', '10¹⁵'],
  ['exa', 'E', '10¹⁸'],
  ['zetta', 'Z', '10²¹'],
  ['yotta', 'Y', '10²⁴'],
  ['ronna', 'R', '10²⁷'],
  ['quetta', 'Q', '10³⁰'],
];

const ftFromM = convertLength(1, 'meter', 'foot');

export const METRIC_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-metric-system',
    title: 'What Is the Metric System?',
    paragraphs: [
      'The metric system is the decimal measurement framework that underpins the International System of Units (SI). Quantities are expressed with coherent base units and powers of ten, which makes scaling between sizes predictable.',
      'SI base units include the meter (length), kilogram (mass), second (time), and kelvin (thermodynamic temperature). Many everyday quantities (area, volume, speed, energy, power, and pressure) are derived from these bases.',
      'Metric prefixes such as milli, centi, kilo, and mega attach to unit names to form larger or smaller versions of the same quantity. The kilogram is the SI base unit of mass; the gram remains common when prefixes are applied.',
      'Imperial and US customary systems use different unit relationships (for example, 12 inches in a foot and 5280 feet in a statute mile). This converter bridges metric and customary units within each physical dimension without mixing incompatible quantities.',
    ],
  },
  {
    id: 'how-to-convert-metric-units',
    title: 'How to Convert Metric Units',
    paragraphs: [
      'Within a single dimension, convert by expressing the source value in a base unit, then dividing by the target unit’s base factor.',
      'Example 1: meters to centimeters: 1 m = 100 cm.',
      'Example 2: kilometers to meters: 1 km = 1000 m.',
      'Example 3: millimeters to meters: 1000 mm = 1 m.',
      'Generic linear formula: target = source × (source factor / target factor), where each factor is base units per unit. Temperature conversions use affine formulas with offsets and are not pure multiplications.',
    ],
    formula: 'target = source × (source factor / target factor)  ·  temperature uses affine scales',
  },
  {
    id: 'metric-prefix-tables',
    title: 'Metric Prefixes and Conversion Tables',
    paragraphs: [
      'SI prefixes span from quecto (10⁻³⁰) to quetta (10³⁰). The tables below are educational references. The calculator exposes the practical units needed for each conversion type rather than every possible prefix field.',
    ],
    tableHeaders: ['Prefix', 'Symbol', 'Multiplier'],
    table: [...SUBMULTIPLES, ...MULTIPLES],
  },
  {
    id: 'example-converting-metric-units',
    title: 'Example of Converting Metric Units',
    paragraphs: [
      'Start with 1 meter. Moving between metric length prefixes is a power-of-ten shift:',
      '1 meter = 10 decimeters',
      '1 meter = 100 centimeters',
      '1 meter = 1000 millimeters',
      '1 meter = 1,000,000 micrometers',
      '1 meter = 1,000,000,000 nanometers',
      '1 meter = 0.001 kilometers',
      `A metric-to-imperial check: 1 m ≈ ${formatMetricNumber(ftFromM)} ft (exact international foot: 1 ft = 0.3048 m).`,
    ],
    formula: `1 m = 100 cm = 1000 mm ≈ ${formatMetricNumber(ftFromM)} ft`,
  },
  {
    id: 'other-measurement-converters',
    title: 'Other Measurement Unit Converters',
    paragraphs: [
      'Related Omega Calculators pages include Length Converter, Meter Converter, Meters to Feet Converter, Meter to Mile Converter, Weight Converter, Area Converter, Volume Conversion, Temperature Conversion, and Measurement Converter. Only active catalog tools appear as live site links in the related-tools rail.',
    ],
  },
];

export const METRIC_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Millimeters to Kilometers?',
    answer: 'Divide millimeters by 1,000,000. Exactly 1,000,000 mm = 1 km.',
  },
  {
    question: 'How Many Milligrams Are in 2 Kilograms?',
    answer: '2 kg = 2,000,000 mg.',
  },
  {
    question: 'How Many Liters Are in a Cubic Meter?',
    answer: '1 m³ = 1000 L.',
  },
  {
    question: 'What Is the Difference Between Metric and Imperial Units?',
    answer:
      'The metric system uses decimal-based units and SI prefixes. Imperial and US customary systems use different relationships, such as 12 inches per foot and 5280 feet per statute mile.',
  },
  {
    question: 'How Do I Convert Meters to Feet?',
    answer: `Multiply meters by approximately ${formatMetricNumber(ftFromM)} (exact: divide by 0.3048).`,
  },
  {
    question: 'Is the Kelvin a Metric Unit?',
    answer: 'Yes. The kelvin is the SI base unit of thermodynamic temperature.',
  },
  {
    question: 'What Is the Difference Between MB and MiB?',
    answer:
      'One megabyte (MB) is 1,000,000 bytes. One mebibyte (MiB) is 1,048,576 bytes. This converter keeps decimal and binary prefixes distinct.',
  },
  {
    question: 'Can I Convert Length to Weight?',
    answer:
      'Not directly. Length and mass are different physical dimensions. You would need additional information and a meaningful physical relationship (for example density) before converting.',
  },
];
