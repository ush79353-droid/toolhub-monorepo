import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTemp, fromCelsius } from './calculation';

export const CELSIUS_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-celsius-scale', label: 'What Is the Celsius Scale?' },
  {
    id: 'conversion-between-scales',
    label: 'Conversion Between Celsius and Other Temperature Scales',
  },
  { id: 'how-to-use-celsius-converter', label: 'How Do I Use the Celsius Converter?' },
  { id: 'common-temperature-reference', label: 'Common Temperature Reference Table' },
  { id: 'other-temperature-converters', label: 'Other Temperature Converters' },
  { id: 'celsius-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CELSIUS_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-celsius-scale',
    title: 'What Is the Celsius Scale?',
    paragraphs: [
      'The Celsius scale is a Celsius temperature scale used worldwide for weather, science, cooking, and medicine. It is named after Anders Celsius, who proposed a related centigrade thermometer scale in the 18th century.',
      'Under standard atmospheric pressure, water’s freezing point is approximately 0°C and its boiling point is approximately 100°C. Real freezing and boiling temperatures can shift with pressure and impurities.',
      'Celsius intervals match kelvin intervals: a change of 1°C equals a change of 1 K. Absolute zero is −273.15°C, which is exactly 0 K.',
    ],
  },
  {
    id: 'conversion-between-scales',
    title: 'Conversion Between Celsius and Other Temperature Scales',
    paragraphs: [
      'Temperature scales do not all share the same zero point, so conversions use ratios and offsets rather than a single multiplicative factor.',
      `Example: ${formatTemp(0)}°C = ${formatTemp(fromCelsius(0, 'fahrenheit'))}°F = ${formatTemp(fromCelsius(0, 'kelvin'))} K.`,
      `Example: ${formatTemp(100)}°C = ${formatTemp(fromCelsius(100, 'fahrenheit'))}°F = ${formatTemp(fromCelsius(100, 'kelvin'))} K.`,
      `Example: ${formatTemp(25)}°C = ${formatTemp(fromCelsius(25, 'fahrenheit'))}°F = ${formatTemp(fromCelsius(25, 'romer'))}°Rø.`,
      'Delisle is inverted relative to Celsius: higher Delisle readings correspond to colder Celsius temperatures.',
    ],
    formula: '°F = °C × 9/5 + 32 · K = °C + 273.15 · °R = (°C + 273.15) × 9/5',
    tableHeaders: ['Conversion', 'Formula'],
    table: [
      ['Celsius to Fahrenheit', '°F = °C × 9/5 + 32'],
      ['Celsius to Kelvin', 'K = °C + 273.15'],
      ['Celsius to Rankine', '°R = (°C + 273.15) × 9/5'],
      ['Celsius to Delisle', '°De = (100 − °C) × 3/2'],
      ['Celsius to Newton', '°N = °C × 33/100'],
      ['Celsius to Réaumur', '°Ré = °C × 4/5'],
      ['Celsius to Rømer', '°Rø = °C × 21/40 + 7.5'],
    ],
  },
  {
    id: 'how-to-use-celsius-converter',
    title: 'How Do I Use the Celsius Converter?',
    paragraphs: [
      '1. Enter a temperature in Celsius or any supported scale.',
      '2. The calculator converts through Celsius and updates every other field.',
      '3. Edit any result field to reverse the conversion.',
      '4. Use Reload or Clear to reset.',
      '5. Share the result when needed.',
      'Supported scales: Celsius, Fahrenheit, Kelvin, Rankine, Delisle, Newton, Réaumur, and Rømer.',
    ],
  },
  {
    id: 'common-temperature-reference',
    title: 'Common Temperature Reference Table',
    paragraphs: [
      'The table uses conventional reference points. Body temperature near 37°C is a common clinical reference, not a universal exact normal for every person.',
      'Absolute zero is a physical limit; values below it are rejected by this converter.',
    ],
    tableHeaders: ['Temperature', 'Celsius', 'Fahrenheit', 'Kelvin'],
    table: [
      [
        'Absolute zero',
        formatTemp(-273.15),
        formatTemp(fromCelsius(-273.15, 'fahrenheit')),
        formatTemp(fromCelsius(-273.15, 'kelvin')),
      ],
      [
        'Water freezing (standard conditions)',
        '0',
        formatTemp(fromCelsius(0, 'fahrenheit')),
        formatTemp(fromCelsius(0, 'kelvin')),
      ],
      [
        'Typical room temperature',
        '20',
        formatTemp(fromCelsius(20, 'fahrenheit')),
        formatTemp(fromCelsius(20, 'kelvin')),
      ],
      [
        'Warm room temperature',
        '25',
        formatTemp(fromCelsius(25, 'fahrenheit')),
        formatTemp(fromCelsius(25, 'kelvin')),
      ],
      [
        'Normal reference body temperature',
        '37',
        formatTemp(fromCelsius(37, 'fahrenheit')),
        formatTemp(fromCelsius(37, 'kelvin')),
      ],
      [
        'Water boiling (1 atm)',
        '100',
        formatTemp(fromCelsius(100, 'fahrenheit')),
        formatTemp(fromCelsius(100, 'kelvin')),
      ],
    ],
  },
  {
    id: 'other-temperature-converters',
    title: 'Other Temperature Converters',
    paragraphs: [
      'Related Omega Calculators pages include Temperature Conversion and Metric Converter. Only active catalog tools appear as live site links in the related-tools rail.',
    ],
  },
];

export const CELSIUS_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Celsius to Fahrenheit?',
    answer: `Multiply Celsius by 9/5 and add 32: °F = °C × 9/5 + 32. Example: 25°C = ${formatTemp(fromCelsius(25, 'fahrenheit'))}°F.`,
  },
  {
    question: 'What Is 100°C in Kelvin?',
    answer: `100 + 273.15 = ${formatTemp(fromCelsius(100, 'kelvin'))} K.`,
  },
  {
    question: 'What Is -40°C in Fahrenheit?',
    answer: '−40°C = −40°F.',
  },
  {
    question: 'What Is 0°C in Fahrenheit?',
    answer: `0°C = ${formatTemp(fromCelsius(0, 'fahrenheit'))}°F.`,
  },
  {
    question: 'How Do I Convert Fahrenheit to Celsius?',
    answer: '°C = (°F − 32) × 5/9.',
  },
  {
    question: 'What Is Absolute Zero in Celsius?',
    answer: 'Absolute zero equals −273.15°C (0 K).',
  },
  {
    question: 'Is Kelvin the Same as Celsius?',
    answer:
      'No. Both scales have equal-sized intervals, but their zero points differ by 273.15. Kelvin is an absolute thermodynamic scale.',
  },
  {
    question: 'Can Celsius Be Negative?',
    answer:
      'Yes. Celsius temperatures can be negative, but physically valid absolute temperatures cannot be below −273.15°C.',
  },
];
