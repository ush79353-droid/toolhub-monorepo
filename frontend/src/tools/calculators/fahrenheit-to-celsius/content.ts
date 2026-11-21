import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { fahrenheitToCelsius, formatTemp } from './calculation';

export const FAHRENHEIT_TO_CELSIUS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'fahrenheit-celsius-scales', label: 'Fahrenheit and Celsius Temperature Scales' },
  { id: 'f-to-c-formula', label: 'Formula for Conversion from Fahrenheit to Celsius' },
  { id: 'how-to-convert', label: 'How to Convert Fahrenheit to Celsius' },
  { id: 'f-to-c-chart', label: 'Fahrenheit to Celsius Conversion Chart' },
  { id: 'other-converters', label: 'Other Temperature Scale Converters' },
  { id: 'fahrenheit-to-celsius-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_F = [-40, 0, 32, 50, 68, 77, 98.6, 100, 122, 212] as const;

export const FAHRENHEIT_TO_CELSIUS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'fahrenheit-celsius-scales',
    title: 'Fahrenheit and Celsius Temperature Scales',
    paragraphs: [
      'This converter translates temperatures between Fahrenheit and Celsius in either direction; useful for weather, travel, science labs, cooking notes, and everyday measurements.',
      'Celsius: under standard atmospheric pressure, water freezes near 0°C and boils near 100°C: a 100-degree Celsius interval between those reference points.',
      'Fahrenheit: water freezes near 32°F and boils near 212°F under standard pressure: a 180-degree Fahrenheit interval between the same physical points.',
      'The proportional relationship C/100 = (F − 32)/180 simplifies to C = 5(F − 32)/9.',
    ],
    formula: 'C/100 = (F − 32)/180   ·   C = 5(F − 32)/9',
  },
  {
    id: 'f-to-c-formula',
    title: 'Formula for Conversion from Fahrenheit to Celsius',
    paragraphs: [
      'Subtract 32 from the Fahrenheit temperature, multiply by 5, then divide by 9 (equivalently multiply by 5/9).',
      'Example; convert 212°F: (212 − 32) × 5/9 = 180 × 5/9 = 100. Therefore 212°F = 100°C.',
      'Reverse conversion: °F = °C × 9/5 + 32. Example: 25 × 1.8 + 32 = 77, so 25°C = 77°F.',
    ],
    formula: '°C = (°F − 32) × 5/9   ·   °F = °C × 9/5 + 32',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Fahrenheit to Celsius',
    paragraphs: [
      '1. Enter a temperature into the Fahrenheit field.',
      '2. The equivalent Celsius temperature appears automatically.',
      '3. To convert in reverse, enter a temperature into the Celsius field.',
      '4. The Fahrenheit field updates immediately.',
      '5. Use Clear All Changes to reset the values, or Reload Calculator for a full empty reset.',
      'Temperatures below absolute zero (−459.67°F / −273.15°C) are rejected.',
    ],
  },
  {
    id: 'f-to-c-chart',
    title: 'Fahrenheit to Celsius Conversion Chart',
    paragraphs: [
      'Common reference points include −40°F = −40°C, water freezing (32°F / 0°C), room temperatures near 68–77°F, a conventional body-temperature reference near 98.6°F (37°C), and water boiling (212°F / 100°C) at standard pressure.',
    ],
    tableHeaders: ['°F', '°C'],
    table: CHART_F.map((f) => [formatTemp(f), formatTemp(fahrenheitToCelsius(f))]),
  },
  {
    id: 'other-converters',
    title: 'Other Temperature Scale Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Fahrenheit Converter, Celsius Converter, Celsius to Fahrenheit Converter, Centigrade to Celsius Converter, and Temperature Conversion. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const FAHRENHEIT_TO_CELSIUS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Fahrenheit to Celsius?',
    answer:
      'Subtract 32 from the Fahrenheit value, multiply by 5, and divide by 9: °C = (°F − 32) × 5/9.',
  },
  {
    question: 'Is There a Point Where Celsius and Fahrenheit Are Equal?',
    answer:
      'Yes. Both scales equal −40 at the same temperature (−40°F = −40°C). Solving C = (C − 32) × 5/9 yields C = −40.',
  },
  {
    question: 'What Is 100°F in Celsius?',
    answer: `(100 − 32) × 5/9 ≈ ${formatTemp(fahrenheitToCelsius(100))}°C. Therefore 100°F ≈ ${formatTemp(fahrenheitToCelsius(100))}°C.`,
  },
  {
    question: 'What Is 98.6°F in Celsius?',
    answer: `(98.6 − 32) × 5/9 = ${formatTemp(fahrenheitToCelsius(98.6))}°C. Therefore 98.6°F = ${formatTemp(fahrenheitToCelsius(98.6))}°C.`,
  },
  {
    question: 'How Do I Convert Celsius Back to Fahrenheit?',
    answer: `Use °F = °C × 9/5 + 32. For example, 20°C = ${formatTemp(20 * (9 / 5) + 32)}°F.`,
  },
];
