import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TEMP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-temperature', label: 'What Is Temperature?' },
  { id: 'celsius-fahrenheit-kelvin', label: 'Celsius, Fahrenheit, and Kelvin' },
  { id: 'formulas', label: 'Temperature Conversion Formulas' },
  { id: 'other-scales', label: 'Other Temperature Scales' },
  { id: 'absolute-zero', label: 'Absolute Zero' },
  { id: 'how-to-use', label: 'How to Use the Temperature Converter' },
  { id: 'reference-points', label: 'Common Temperature Reference Points' },
  { id: 'temperature-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const TEMP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-temperature',
    title: 'What Is Temperature?',
    paragraphs: [
      'Temperature describes how hot or cold a system is relative to a defined scale. It relates to the average kinetic energy of particles and to thermal equilibrium: two bodies in contact exchange heat until their temperatures match.',
      'Temperature is not the same as heat. Heat is energy transferred because of a temperature difference; temperature is the intensive property that drives that transfer. Different historical and scientific scales exist for weather, cooking, engineering, and thermodynamics.',
    ],
  },
  {
    id: 'celsius-fahrenheit-kelvin',
    title: 'Celsius, Fahrenheit, and Kelvin',
    paragraphs: [
      'Celsius (°C) is widely used for everyday measurements. Under standard atmospheric pressure, water freezes near 0°C and boils near 100°C.',
      'Fahrenheit (°F) remains common for weather and daily life in the United States. Water freezes near 32°F and boils near 212°F under standard atmospheric pressure.',
      'Kelvin (K) is the SI base unit of thermodynamic temperature. It starts at absolute zero and does not use a degree symbol. Scientists and engineers prefer Kelvin for absolute temperature calculations.',
    ],
  },
  {
    id: 'formulas',
    title: 'Temperature Conversion Formulas',
    paragraphs: [
      'Convert through Kelvin (or use the direct formulas below). Offsets matter — temperature conversion is not a simple multiply-only unit change like meters to kilometers.',
    ],
    tableHeaders: ['Conversion', 'Formula'],
    table: [
      ['°C to °F', '°F = (°C × 9/5) + 32'],
      ['°F to °C', '°C = (°F − 32) × 5/9'],
      ['°C to K', 'K = °C + 273.15'],
      ['K to °C', '°C = K − 273.15'],
      ['°F to K', 'K = (°F − 32) × 5/9 + 273.15'],
      ['K to °F', '°F = (K − 273.15) × 9/5 + 32'],
    ],
  },
  {
    id: 'other-scales',
    title: 'Other Temperature Scales',
    paragraphs: [
      'Rankine (°R) is an absolute scale related to Fahrenheit: R = K × 9/5. Réaumur (°Ré) sets the water interval to 0–80. Rømer (°Rø) is an early scale with an offset of 7.5 at the ice point. Delisle (°De) decreases as temperature rises. Newton (°N) uses a 0–33 interval for the water freezing–boiling range.',
      'These scales appear mainly in history, specialized literature, or niche engineering contexts. Expand More temperature scales in the calculator to convert them.',
    ],
  },
  {
    id: 'absolute-zero',
    title: 'Absolute Zero',
    paragraphs: [
      'Absolute zero is 0 K — equivalent to −273.15°C or −459.67°F. It is the lower bound of the thermodynamic temperature scale for ordinary systems. This converter rejects inputs that map below 0 K (with a small floating-point tolerance at the boundary).',
      'Delisle runs “backwards,” so large Delisle values can correspond to temperatures below absolute zero and are rejected. Negative Celsius or Fahrenheit values remain valid when they are still above absolute zero.',
    ],
    formula: '0 K = −273.15°C = −459.67°F = 0°R',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Temperature Converter',
    paragraphs: [
      '1. Enter a temperature in Celsius, Fahrenheit, or Kelvin.',
      '2. Read the converted values instantly.',
      '3. Expand More temperature scales for Rankine, Réaumur, Rømer, Delisle, and Newton.',
      '4. Edit any scale to convert in the other direction.',
      '5. Use Share Result, Reload Calculator, or Clear All Changes as needed.',
    ],
  },
  {
    id: 'reference-points',
    title: 'Common Temperature Reference Points',
    paragraphs: [
      'These simplified reference points assume standard atmospheric pressure for water phase changes. Body and indoor temperatures vary with context.',
    ],
    tableHeaders: ['Reference', 'Celsius', 'Fahrenheit', 'Kelvin'],
    table: [
      ['Absolute zero', '−273.15', '−459.67', '0'],
      ['Water freezing point*', '0', '32', '273.15'],
      ['Typical indoor temperature', '20', '68', '293.15'],
      ['Typical human body temperature', '37', '98.6', '310.15'],
      ['Water boiling point*', '100', '212', '373.15'],
    ],
  },
];

export const TEMP_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Celsius to Fahrenheit?',
    answer: 'Multiply Celsius by 9/5 and add 32.',
  },
  {
    question: 'How do I convert Fahrenheit to Celsius?',
    answer: 'Subtract 32 from Fahrenheit and multiply by 5/9.',
  },
  {
    question: 'What is 100°C in Fahrenheit?',
    answer: '100°C equals 212°F.',
  },
  {
    question: 'What is 0°C in Fahrenheit?',
    answer: '0°C equals 32°F.',
  },
  {
    question: 'What is 98.6°F in Celsius?',
    answer: '98.6°F equals approximately 37°C.',
  },
  {
    question: 'How do I convert Celsius to Kelvin?',
    answer: 'Add 273.15 to the Celsius temperature.',
  },
  {
    question: 'What is 300 Kelvin in Celsius?',
    answer: '300 K equals 26.85°C.',
  },
  {
    question: 'What is absolute zero?',
    answer: 'Absolute zero is 0 K, equivalent to −273.15°C or −459.67°F.',
  },
  {
    question: 'Can Kelvin be negative?',
    answer:
      'Ordinary thermodynamic temperatures cannot be below 0 K. Certain specialized physical systems can exhibit negative absolute temperatures, but these do not represent temperatures colder than absolute zero.',
  },
  {
    question: 'Is Kelvin written with a degree symbol?',
    answer: 'No. The correct unit symbol is K, not °K.',
  },
];
