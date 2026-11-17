import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertTemperature, formatTemp } from './calculation';

export const FAHRENHEIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fahrenheit', label: 'What Is the Fahrenheit Scale?' },
  {
    id: 'convert-fahrenheit',
    label: 'Convert Fahrenheit to Celsius, Kelvin, and Other Temperature Units',
  },
  { id: 'how-to-use', label: 'How to Use the Fahrenheit Converter' },
  { id: 'fahrenheit-chart', label: 'Fahrenheit Conversion Chart' },
  { id: 'other-converters', label: 'Other Temperature Converters' },
  { id: 'fahrenheit-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_F = [-40, 0, 32, 50, 68, 77, 98.6, 100, 212] as const;

export const FAHRENHEIT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-fahrenheit',
    title: 'What Is the Fahrenheit Scale?',
    paragraphs: [
      'The Fahrenheit scale was proposed by Daniel Gabriel Fahrenheit in 1724. Under standard atmospheric pressure, water freezes at 32°F and boils at about 212°F — a span of 180 Fahrenheit degrees between those points.',
      'Fahrenheit remains common for everyday weather and household temperatures in the United States. The relationship to Celsius is °F = °C × 9/5 + 32.',
    ],
    formula: '°F = °C × 9/5 + 32   ·   Absolute zero = −459.67°F = −273.15°C = 0 K',
  },
  {
    id: 'convert-fahrenheit',
    title: 'Convert Fahrenheit to Celsius, Kelvin, and Other Temperature Units',
    paragraphs: [
      'Temperature scales use different zeros and slopes, so conversions need offsets — not a single multiplicative length-style factor.',
      `Example: 32°F = ${formatTemp(convertTemperature(32, 'fahrenheit', 'celsius'))}°C = ${formatTemp(convertTemperature(32, 'fahrenheit', 'kelvin'))} K.`,
      `Example: 212°F = ${formatTemp(convertTemperature(212, 'fahrenheit', 'celsius'))}°C = ${formatTemp(convertTemperature(212, 'fahrenheit', 'kelvin'))} K.`,
      `Example: 0°F ≈ ${formatTemp(convertTemperature(0, 'fahrenheit', 'celsius'))}°C ≈ ${formatTemp(convertTemperature(0, 'fahrenheit', 'kelvin'))} K.`,
      'Delisle decreases as Fahrenheit (and Celsius) increase. Rankine, Réaumur, and Rømer use distinct identifiers so their similar symbols are not confused.',
    ],
    formula:
      '°C = (°F − 32) × 5/9 · K = (°F − 32) × 5/9 + 273.15 · °R = °F + 459.67',
    tableHeaders: ['Conversion', 'Formula'],
    table: [
      ['Fahrenheit to Celsius', '°C = (°F − 32) × 5/9'],
      ['Fahrenheit to Kelvin', 'K = (°F − 32) × 5/9 + 273.15'],
      ['Fahrenheit to Rankine', '°R = °F + 459.67'],
      ['Fahrenheit to Delisle', '°De = (212 − °F) × 5/6'],
      ['Fahrenheit to Newton', '°N = (°F − 32) × 11/60'],
      ['Fahrenheit to Réaumur', '°Ré = (°F − 32) × 4/9'],
      ['Fahrenheit to Rømer', '°Rø = (°F − 32) × 7/24 + 7.5'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Fahrenheit Converter',
    paragraphs: [
      '1. Enter the temperature in Fahrenheit.',
      '2. Equivalent values update automatically in every other supported scale.',
      '3. Or type into any other temperature field — all remaining fields update immediately.',
      '4. Use Clear All Changes to reset inputs, or Reload Calculator to restore the initial empty state.',
      `For 32°F: ${formatTemp(0)}°C, ${formatTemp(273.15)} K, ${formatTemp(491.67)}°R, ${formatTemp(150)}°De, ${formatTemp(0)}°N, ${formatTemp(0)}°Ré, ${formatTemp(7.5)}°Rø.`,
    ],
  },
  {
    id: 'fahrenheit-chart',
    title: 'Fahrenheit Conversion Chart',
    paragraphs: [
      'Common Fahrenheit reference points with Celsius and Kelvin equivalents. Body temperature near 98.6°F is a conventional clinical reference, not a universal exact normal for every person.',
    ],
    tableHeaders: ['Fahrenheit', 'Celsius', 'Kelvin'],
    table: CHART_F.map((f) => [
      `${formatTemp(f)}°F`,
      `${formatTemp(convertTemperature(f, 'fahrenheit', 'celsius'))}°C`,
      `${formatTemp(convertTemperature(f, 'fahrenheit', 'kelvin'))} K`,
    ]),
  },
  {
    id: 'other-converters',
    title: 'Other Temperature Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Celsius Converter, Celsius to Fahrenheit Converter, Centigrade to Celsius Converter, and Temperature Conversion. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const FAHRENHEIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 200 Fahrenheit to Celsius?',
    answer: `Use °C = (°F − 32) × 5/9. For 200°F: (200 − 32) × 5/9 ≈ ${formatTemp(convertTemperature(200, 'fahrenheit', 'celsius'))}°C.`,
  },
  {
    question: 'How Do I Convert 38 Celsius to Fahrenheit?',
    answer: `Use °F = °C × 9/5 + 32. 38 × 1.8 + 32 = ${formatTemp(convertTemperature(38, 'celsius', 'fahrenheit'))}°F.`,
  },
  {
    question: 'What Is the Freezing and Boiling Point of Water in Fahrenheit?',
    answer:
      'At standard atmospheric pressure, water freezes at 32°F and boils at about 212°F. Boiling point shifts with pressure and purity.',
  },
  {
    question: 'What Is Absolute Zero in Fahrenheit?',
    answer: 'Absolute zero equals −459.67°F, which is 0 K and −273.15°C.',
  },
  {
    question: 'Is −40°F the Same as −40°C?',
    answer: 'Yes. −40°F = −40°C — the intersection of the Fahrenheit and Celsius scales.',
  },
];
