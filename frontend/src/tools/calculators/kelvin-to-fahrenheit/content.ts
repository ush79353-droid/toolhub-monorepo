import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { fahrenheitToKelvin, formatTemp, kelvinToFahrenheit } from './calculation';

export const KELVIN_TO_FAHRENHEIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-k-to-f', label: 'How to Convert Kelvin to Fahrenheit' },
  { id: 'how-to-f-to-k', label: 'How to Convert Fahrenheit to Kelvin' },
  { id: 'kf-formulas', label: 'Kelvin to Fahrenheit Formula' },
  { id: 'what-is-kelvin', label: 'What Is the Kelvin Scale?' },
  { id: 'what-is-fahrenheit', label: 'What Is the Fahrenheit Scale?' },
  { id: 'kelvin-vs-fahrenheit', label: 'Kelvin vs Fahrenheit' },
  { id: 'conversion-table', label: 'Kelvin to Fahrenheit Conversion Table' },
  { id: 'related-converters', label: 'Related Temperature Calculators' },
  { id: 'kelvin-to-fahrenheit-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_K = [0, 100, 200, 273.15, 293.15, 300, 310.15, 373.15, 500, 1000] as const;

export const KELVIN_TO_FAHRENHEIT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-k-to-f',
    title: 'How to Convert Kelvin to Fahrenheit',
    paragraphs: [
      'This calculator converts temperatures between Kelvin and Fahrenheit in real time. Edit either field — both directions are supported.',
      'Use °F = (K − 273.15) × 9/5 + 32. Subtract 273.15 to reach Celsius, scale by 9/5, then add 32 for Fahrenheit.',
      `Example — convert 300 K: 300 − 273.15 = 26.85; 26.85 × 1.8 = 48.33; 48.33 + 32 = ${formatTemp(kelvinToFahrenheit(300))}°F. Therefore 300 K = ${formatTemp(kelvinToFahrenheit(300))} °F.`,
      'Temperatures below absolute zero (0 K / −459.67 °F) are rejected. Ordinary negative Fahrenheit values above absolute zero remain valid.',
    ],
    formula: '°F = (K − 273.15) × 9/5 + 32',
  },
  {
    id: 'how-to-f-to-k',
    title: 'How to Convert Fahrenheit to Kelvin',
    paragraphs: [
      'Use K = (°F − 32) × 5/9 + 273.15. Subtract 32, scale by 5/9 to Celsius, then add 273.15 for kelvin.',
      `Example — convert 212 °F: (212 − 32) × 5/9 + 273.15 = ${formatTemp(fahrenheitToKelvin(212))} K. Therefore 212 °F = ${formatTemp(fahrenheitToKelvin(212))} K.`,
    ],
    formula: 'K = (°F − 32) × 5/9 + 273.15',
  },
  {
    id: 'kf-formulas',
    title: 'Kelvin to Fahrenheit Formula',
    paragraphs: [
      'An equivalent direct form is °F = 1.8K − 459.67. The reverse is K = (°F + 459.67) / 1.8, which is the same as multiplying by 5/9 after adding 459.67.',
      'K is kelvin (no degree symbol). °F is degrees Fahrenheit. The constants 273.15, 32, 9/5, 5/9, and 459.67 are exact for this converter.',
    ],
    formula: '°F = 1.8K − 459.67   ·   K = (°F + 459.67) / 1.8',
  },
  {
    id: 'what-is-kelvin',
    title: 'What Is the Kelvin Scale?',
    paragraphs: [
      'Kelvin is the SI base unit of thermodynamic temperature. Its symbol is K — write 300 K, not 300 °K.',
      'The scale starts at absolute zero (0 K). A change of 1 K equals a change of 1 °C; only the zero points differ (0 °C ≈ 273.15 K under standard pressure).',
      'Scientists use kelvin for thermodynamics, cryogenics, and any work that needs an absolute temperature reference.',
    ],
  },
  {
    id: 'what-is-fahrenheit',
    title: 'What Is the Fahrenheit Scale?',
    paragraphs: [
      'Fahrenheit is a common everyday temperature scale in the United States. Under standard pressure, water freezes near 32 °F and boils near 212 °F.',
      'Unlike kelvin, Fahrenheit uses a degree symbol (°F) and places zero well below water’s freezing point. Absolute zero on this scale is −459.67 °F.',
    ],
  },
  {
    id: 'kelvin-vs-fahrenheit',
    title: 'Kelvin vs Fahrenheit',
    paragraphs: [
      'Kelvin is absolute and preferred in science; Fahrenheit remains common for weather and household reporting in some countries.',
    ],
    tableHeaders: ['Property', 'Kelvin', 'Fahrenheit'],
    table: [
      ['Symbol', 'K', '°F'],
      ['Absolute zero', '0 K', '−459.67 °F'],
      ['Water freezing point', '273.15 K', '32 °F'],
      ['Water normal boiling point', '373.15 K', '212 °F'],
      ['Main usage', 'Scientific temperatures', 'Everyday temperatures in some countries'],
      ['Degree symbol', 'No', 'Yes'],
    ],
  },
  {
    id: 'conversion-table',
    title: 'Kelvin to Fahrenheit Conversion Table',
    paragraphs: [
      'Reference values generated with the same engine as the calculator (°F = (K − 273.15) × 9/5 + 32).',
    ],
    tableHeaders: ['Kelvin (K)', 'Fahrenheit (°F)'],
    table: TABLE_K.map((k) => [formatTemp(k), formatTemp(kelvinToFahrenheit(k))]),
  },
  {
    id: 'related-converters',
    title: 'Related Temperature Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Temperature Converter, Fahrenheit Converter, Kelvin Converter, Kelvin to Celsius Converter, Fahrenheit to Kelvin Converter, Celsius to Fahrenheit Converter, Fahrenheit to Celsius Converter, and Celsius to Kelvin Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KELVIN_TO_FAHRENHEIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 3 Kelvin Equal to in Fahrenheit?',
    answer: `°F = 1.8 × 3 − 459.67 = ${formatTemp(kelvinToFahrenheit(3))}. Therefore 3 K = ${formatTemp(kelvinToFahrenheit(3))} °F.`,
  },
  {
    question: 'Is 273 Kelvin Hot or Cold?',
    answer: `273 K ≈ ${formatTemp(kelvinToFahrenheit(273))} °F, slightly below the normal freezing point of water (32 °F / 273.15 K).`,
  },
  {
    question: 'How Hot Is 350 Kelvin?',
    answer: `°F = 1.8 × 350 − 459.67 = ${formatTemp(kelvinToFahrenheit(350))}. Therefore 350 K = ${formatTemp(kelvinToFahrenheit(350))} °F.`,
  },
  {
    question: 'What Is 0 Kelvin in Fahrenheit?',
    answer: `0 K = ${formatTemp(kelvinToFahrenheit(0))} °F. This is absolute zero.`,
  },
  {
    question: 'How Do I Convert Fahrenheit to Kelvin?',
    answer:
      'Subtract 32 from the Fahrenheit temperature, multiply by 5/9, then add 273.15: K = (°F − 32) × 5/9 + 273.15.',
  },
  {
    question: 'Why Is Kelvin Used in Science?',
    answer:
      'Kelvin provides an absolute thermodynamic temperature scale and is the SI base temperature unit, which simplifies thermodynamic equations.',
  },
  {
    question: 'Can Kelvin Temperatures Be Negative?',
    answer:
      'Not in the conventional thermodynamic temperature domain supported by this calculator. Specialized negative-temperature systems are outside its scope.',
  },
];
