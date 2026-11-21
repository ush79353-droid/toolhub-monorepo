import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { celsiusToKelvin, formatTemp, kelvinToCelsius } from './calculation';

export const KELVIN_TO_CELSIUS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Kelvin to Celsius Converter' },
  { id: 'k-to-c-formula', label: 'Kelvin to Celsius Conversion Formula' },
  { id: 'c-to-k-formula', label: 'Celsius to Kelvin Conversion Formula' },
  { id: 'what-is-kelvin', label: 'What Is the Kelvin Scale?' },
  { id: 'kelvin-vs-celsius', label: 'Kelvin vs Celsius' },
  { id: 'conversion-table', label: 'Kelvin to Celsius Conversion Table' },
  { id: 'related-converters', label: 'Related Temperature Calculators' },
  { id: 'kelvin-to-celsius-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_K = [0, 100, 200, 250, 273.15, 293.15, 300, 310.15, 373.15, 500, 1000] as const;

export const KELVIN_TO_CELSIUS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Kelvin to Celsius Converter',
    paragraphs: [
      'This calculator converts temperature values between Kelvin and Celsius instantly. Both conversion directions are supported; edit either field and the other updates in real time.',
      '1. Enter a temperature in Kelvin.',
      '2. The equivalent Celsius temperature appears automatically.',
      '3. To convert Celsius to Kelvin, enter a value in the Celsius field.',
      '4. Read the corresponding Kelvin result.',
      '5. Use Share Result to share the calculation.',
      `Example: 300 K = ${formatTemp(kelvinToCelsius(300))} °C.`,
      'Temperatures below absolute zero (0 K / −273.15 °C) are rejected. Negative Celsius values above absolute zero remain valid.',
    ],
  },
  {
    id: 'k-to-c-formula',
    title: 'Kelvin to Celsius Conversion Formula',
    paragraphs: [
      'Kelvin (K) is an absolute thermodynamic temperature. Celsius (°C) shares the same degree size but places zero at the freezing point of water under standard pressure.',
      'Subtract 273.15 from the kelvin value to obtain Celsius. The relationship is an offset, not a scale factor: a change of 1 K equals a change of 1 °C.',
      `Example 1: convert 300 K: 300 − 273.15 = ${formatTemp(kelvinToCelsius(300))} °C.`,
      `Example 2: convert 100 K: 100 − 273.15 = ${formatTemp(kelvinToCelsius(100))} °C.`,
      `Example 3: convert 0 K: 0 − 273.15 = ${formatTemp(kelvinToCelsius(0))} °C (absolute zero).`,
    ],
    formula: '°C = K − 273.15',
  },
  {
    id: 'c-to-k-formula',
    title: 'Celsius to Kelvin Conversion Formula',
    paragraphs: [
      'Add 273.15 to the Celsius temperature to obtain kelvin.',
      `Example 1: convert 0 °C: 0 + 273.15 = ${formatTemp(celsiusToKelvin(0))} K.`,
      `Example 2: convert 100 °C: 100 + 273.15 = ${formatTemp(celsiusToKelvin(100))} K.`,
      `Example 3: convert −40 °C: −40 + 273.15 = ${formatTemp(celsiusToKelvin(-40))} K.`,
    ],
    formula: 'K = °C + 273.15',
  },
  {
    id: 'what-is-kelvin',
    title: 'What Is the Kelvin Scale?',
    paragraphs: [
      'Kelvin is the SI base unit of thermodynamic temperature. Its symbol is K (not °K) because kelvin is a base unit, not a derived “degree” unit in modern SI usage.',
      'The scale begins at absolute zero: 0 K is the lowest thermodynamic temperature in the conventional sense used by this converter.',
      'A change of 1 K equals a change of 1 °C. Only the zero points differ: Celsius places 0 °C at water’s freezing point (approximately 273.15 K under standard pressure).',
    ],
  },
  {
    id: 'kelvin-vs-celsius',
    title: 'Kelvin vs Celsius',
    paragraphs: [
      'Both scales use the same interval size. Scientists often prefer kelvin for thermodynamic work; everyday weather and cooking usually use Celsius.',
    ],
    tableHeaders: ['Property', 'Kelvin', 'Celsius'],
    table: [
      ['Unit symbol', 'K', '°C'],
      ['Absolute zero', '0 K', '−273.15 °C'],
      ['Water freezing (approx., standard pressure)', '273.15 K', '0 °C'],
      ['Water boiling (approx., normal)', '373.15 K', '100 °C'],
      ['Main usage', 'Scientific measurements', 'Everyday temperatures'],
      ['Degree symbol', 'No', 'Yes'],
    ],
  },
  {
    id: 'conversion-table',
    title: 'Kelvin to Celsius Conversion Table',
    paragraphs: [
      'Reference values generated with the same conversion engine used by the calculator (°C = K − 273.15).',
    ],
    tableHeaders: ['Kelvin (K)', 'Celsius (°C)'],
    table: TABLE_K.map((k) => [formatTemp(k), formatTemp(kelvinToCelsius(k))]),
  },
  {
    id: 'related-converters',
    title: 'Related Temperature Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Kelvin Converter, Celsius Converter, Fahrenheit Converter, Kelvin to Fahrenheit Converter, Celsius to Kelvin Converter, Celsius to Fahrenheit Converter, Fahrenheit to Celsius Converter, and Temperature Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KELVIN_TO_CELSIUS_FAQS: readonly FAQItem[] = [
  {
    question: 'Why Is the Kelvin Scale Not Measured in Degrees?',
    answer:
      'Kelvin is an SI base unit of thermodynamic temperature. Its symbol is K, without a degree sign. Write temperatures as 300 K, not 300 °K.',
  },
  {
    question: 'How Do I Convert 100 Degrees Celsius to Kelvin?',
    answer: `Add 273.15. 100 + 273.15 = ${formatTemp(celsiusToKelvin(100))} K.`,
  },
  {
    question: 'What Is 0 Celsius in Kelvin?',
    answer: `0 + 273.15 = ${formatTemp(celsiusToKelvin(0))} K.`,
  },
  {
    question: 'What Is 300 Kelvin in Celsius?',
    answer: `300 − 273.15 = ${formatTemp(kelvinToCelsius(300))} °C.`,
  },
  {
    question: 'What Is Absolute Zero in Celsius?',
    answer: 'Absolute zero is exactly −273.15 °C (0 K).',
  },
  {
    question: 'Is 1 Kelvin Equal to 1 Celsius?',
    answer:
      'A temperature change of 1 K is equal in magnitude to a change of 1 °C. The temperature values themselves are not numerically equal because the zero points differ by 273.15.',
  },
  {
    question: 'Can Kelvin Be Negative?',
    answer:
      'Ordinary thermodynamic temperatures cannot be below 0 K. Specialized negative-temperature states in certain bounded physical systems are beyond this converter’s scope.',
  },
];
