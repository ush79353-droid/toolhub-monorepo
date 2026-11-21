import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { celsiusToFahrenheit, formatTemp } from './calculation';

export const CELSIUS_TO_FAHRENHEIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-celsius-and-fahrenheit', label: 'What Are Celsius and Fahrenheit?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'celsius-to-fahrenheit-formula', label: 'Celsius to Fahrenheit Formula' },
  { id: 'fahrenheit-to-celsius-formula', label: 'Fahrenheit to Celsius Formula' },
  { id: 'conversion-chart', label: 'Celsius to Fahrenheit Conversion Chart' },
  { id: 'common-examples', label: 'Common Temperature Conversion Examples' },
  { id: 'related-temperature-converters', label: 'Related Temperature Converters' },
  { id: 'celsius-to-fahrenheit-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}

const CHART_C = [-40, -20, 0, 10, 20, 25, 30, 37, 50, 75, 100, 150, 200] as const;

export const CELSIUS_TO_FAHRENHEIT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-celsius-and-fahrenheit',
    title: 'What Are Celsius and Fahrenheit?',
    paragraphs: [
      'Celsius and Fahrenheit are the two temperature scales people encounter most often in daily life and science communication. This converter translates between them instantly in either direction.',
    ],
    subsections: [
      {
        id: 'celsius-scale',
        title: 'Celsius Scale',
        paragraphs: [
          'The Celsius scale is named after Anders Celsius. Under standard atmospheric pressure, water freezes near 0°C and boils near 100°C. It is widely used in science, weather reporting outside the United States, medicine, and cooking.',
        ],
      },
      {
        id: 'fahrenheit-scale',
        title: 'Fahrenheit Scale',
        paragraphs: [
          'The Fahrenheit scale is associated with Daniel Gabriel Fahrenheit. Water freezes near 32°F and boils near 212°F at standard atmospheric pressure. Fahrenheit remains common for weather and everyday temperatures in the United States. Boiling points shift with pressure.',
        ],
      },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Celsius to Fahrenheit Converter',
    paragraphs: [
      '1. Enter a temperature in the Celsius field. Fahrenheit updates immediately.',
      '2. Or enter a Fahrenheit value. Celsius updates immediately.',
      '3. Negative temperatures and decimals are supported.',
      '4. Use Share, Reload, or Clear as needed.',
      'Values below absolute zero (−273.15°C / −459.67°F) are rejected.',
    ],
  },
  {
    id: 'celsius-to-fahrenheit-formula',
    title: 'How to Convert Celsius to Fahrenheit',
    paragraphs: [
      'Multiply Celsius by 9/5 (or 1.8) and add 32.',
      'Example; convert 100°C: 100 × 1.8 = 180; 180 + 32 = 212. Result: 100°C = 212°F.',
    ],
    formula: '°F = (°C × 9/5) + 32  ·  or  °F = (°C × 1.8) + 32',
  },
  {
    id: 'fahrenheit-to-celsius-formula',
    title: 'How to Convert Fahrenheit to Celsius',
    paragraphs: [
      'Subtract 32 from Fahrenheit, then multiply by 5/9.',
      'Example; convert 98.6°F: 98.6 − 32 = 66.6; 66.6 × 5/9 = 37. Result: 98.6°F = 37°C.',
    ],
    formula: '°C = (°F − 32) × 5/9',
  },
  {
    id: 'conversion-chart',
    title: 'Celsius to Fahrenheit Conversion Chart',
    paragraphs: [
      'Common reference points include water freezing (0°C / 32°F), typical room temperature near 20–25°C, a commonly cited body-temperature reference near 37°C (≈ 98.6°F; not a universal fixed normal), and water boiling at 100°C / 212°F under standard pressure.',
    ],
    tableHeaders: ['Celsius (°C)', 'Fahrenheit (°F)'],
    table: CHART_C.map((c) => [formatTemp(c), formatTemp(celsiusToFahrenheit(c))]),
  },
  {
    id: 'common-examples',
    title: 'Common Temperature Conversion Examples',
    paragraphs: [
      `Weather: 20°C = ${formatTemp(celsiusToFahrenheit(20))}°F; 30°C = ${formatTemp(celsiusToFahrenheit(30))}°F; 40°C = ${formatTemp(celsiusToFahrenheit(40))}°F.`,
      `Freezing range: 0°C = 32°F; −10°C = ${formatTemp(celsiusToFahrenheit(-10))}°F; −20°C = ${formatTemp(celsiusToFahrenheit(-20))}°F.`,
      `Heating references: 100°C = 212°F; 180°C = ${formatTemp(celsiusToFahrenheit(180))}°F; 200°C = ${formatTemp(celsiusToFahrenheit(200))}°F.`,
      'These are scale conversions only; not cooking-time recommendations.',
    ],
  },
  {
    id: 'related-temperature-converters',
    title: 'Other Related Temperature Converters',
    paragraphs: [
      'Related Omega Calculators pages include Celsius Converter, Temperature Conversion, and Metric to Imperial Converter. Only active catalog tools appear as live site links in the related-tools rail.',
    ],
  },
];

export const CELSIUS_TO_FAHRENHEIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 200 Celsius in Fahrenheit?',
    answer: `200°C equals ${formatTemp(celsiusToFahrenheit(200))}°F. Formula: (200 × 1.8) + 32 = 392.`,
  },
  {
    question: 'How Do I Convert Celsius to Fahrenheit?',
    answer: 'Multiply Celsius by 1.8 (or 9/5) and add 32.',
  },
  {
    question: 'How Do I Convert Fahrenheit to Celsius?',
    answer: 'Subtract 32 from Fahrenheit and multiply by 5/9.',
  },
  {
    question: 'What Is the Lowest Possible Temperature in Celsius?',
    answer: 'Absolute zero is −273.15°C.',
  },
  {
    question: 'What Is 180 Celsius in Fahrenheit?',
    answer: `180°C equals ${formatTemp(celsiusToFahrenheit(180))}°F.`,
  },
  {
    question: 'Is −40°C Equal to −40°F?',
    answer: 'Yes. The Celsius and Fahrenheit scales intersect at −40°.',
  },
  {
    question: 'What Is 37°C in Fahrenheit?',
    answer: `37°C equals ${formatTemp(celsiusToFahrenheit(37))}°F.`,
  },
  {
    question: 'What Is 25°C in Fahrenheit?',
    answer: `25°C equals ${formatTemp(celsiusToFahrenheit(25))}°F.`,
  },
];
