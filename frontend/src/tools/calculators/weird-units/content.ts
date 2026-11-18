import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertToWeirdUnits, formatWeird } from './calculation';

export const WEIRD_UNITS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'numbers-meaningless', label: 'Numbers Get Meaningless Pretty Quickly' },
  { id: 'change-unit', label: 'Change the Unit of Measurement' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'examples', label: 'Examples of Weird Unit Conversions' },
  { id: 'why-useful', label: 'Why Unusual Units Are Useful' },
  { id: 'scientifically-accurate', label: 'Are Weird Units Scientifically Accurate?' },
  { id: 'weird-units-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  tableNote?: string;
}

const lego100 = convertToWeirdUnits(100, 'm', 'lego-brick-height');
const ggb10 = convertToWeirdUnits(10, 'km', 'golden-gate-bridge');
const pool1km = convertToWeirdUnits(1, 'km', 'olympic-pool-length');
const episodes1h = convertToWeirdUnits(1, 'h', 'episode', 'time');
const workdays1d = convertToWeirdUnits(1, 'd', 'workday', 'time');

export const WEIRD_UNITS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'numbers-meaningless',
    title: 'Numbers Get Meaningless Pretty Quickly',
    paragraphs: [
      'Very large and very small numbers are hard to feel. Saying a tower is 8,848.86 meters tall is precise, but comparing that height to Mount Everest can make the scale click faster for many readers.',
      'Weird-unit comparisons turn abstract magnitudes into stories about familiar objects. They illustrate size; they do not replace standardized scientific units for engineering or laboratory work.',
    ],
  },
  {
    id: 'change-unit',
    title: 'Change the Unit of Measurement',
    paragraphs: [
      'A measurement is a number multiplied by a unit size. Changing the unit changes the number while leaving the physical quantity the same.',
      'Length, mass, time, area, and volume each need their own base unit. This converter never mixes incompatible dimensions — meters cannot become kilograms without an extra physical model such as density.',
    ],
    formula: 'Measurement = Number × Unit size',
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Weird Units of Measurement Calculator',
    paragraphs: [
      '1. Select the measurement category (height/length, mass, time, area, or volume).',
      '2. Enter the measurement value.',
      '3. Choose the regular unit.',
      '4. Select an unusual reference unit.',
      '5. Read the converted value and the short visual comparison.',
      '6. Switch direction to go from weird units back to regular units if needed.',
      '7. Copy or share the result, or reload/clear to restore defaults (100 m → LEGO brick heights).',
    ],
  },
  {
    id: 'examples',
    title: 'Examples of Weird Unit Conversions',
    paragraphs: [
      'These examples use the same reference factors configured in the calculator.',
    ],
    tableHeaders: ['Input', 'Weird reference', 'Result'],
    table: [
      ['100 m', 'LEGO brick heights (9.6 mm)', `${formatWeird(lego100)}`],
      ['10 km', 'Golden Gate Bridge lengths', `${formatWeird(ggb10)}`],
      ['1 km', 'Olympic pool lengths (50 m)', `${formatWeird(pool1km)}`],
      ['1 hour', '30-minute episodes', `${formatWeird(episodes1h)}`],
      ['1 day', '8-hour workdays', `${formatWeird(workdays1d)}`],
    ],
    tableNote:
      'Years use a Julian year (365.25 days). Biological masses and lifestyle durations are labeled approximate in the tool.',
  },
  {
    id: 'why-useful',
    title: 'Why Are Unusual Measurement Units Useful?',
    paragraphs: [
      'Educators use comparisons to build intuition. Journalists and presenters use them to make statistics memorable. Designers and communicators use them in data storytelling.',
      'They also work as icebreakers: converting your height into LEGO bricks is rarely the final answer you need, but it can open a conversation about scale and units.',
    ],
  },
  {
    id: 'scientifically-accurate',
    title: 'Are Weird Units Scientifically Accurate?',
    paragraphs: [
      'Accuracy depends on the reference. A 50 m Olympic pool length is a defined sporting standard. An “average adult cat” mass is an illustrative estimate.',
      'Standardized SI and customary units remain the right choice for formal calculations. Weird units shine when you need intuition, not when you need metrology.',
    ],
  },
];

export const WEIRD_UNITS_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is a Weird Unit of Measurement?',
    answer:
      'A weird unit is an unconventional reference — an object, landmark, or event — used to describe a quantity in familiar terms.',
  },
  {
    question: 'How Do You Convert Meters Into LEGO Bricks?',
    answer:
      'Divide the length in meters by 0.0096 m (9.6 mm brick height including studs, studs-up). Example: 100 ÷ 0.0096 ≈ 10,416.67 brick heights.',
  },
  {
    question: 'How Tall Is Mount Everest?',
    answer:
      'This tool uses the commonly cited official height of approximately 8,848.86 meters above sea level.',
  },
  {
    question: 'Why Do People Compare Measurements to Everyday Objects?',
    answer:
      'Everyday comparisons help people grasp abstract or unfamiliar quantities more quickly than raw SI figures alone.',
  },
  {
    question: 'Can Weird Units Be Used in Scientific Calculations?',
    answer:
      'They are useful for illustration and teaching. Formal scientific work generally prefers standardized units.',
  },
  {
    question: 'Can I Convert Between Weird Units?',
    answer:
      'Yes when both references share the same dimension. Convert through the category base (for example meters) using each reference’s documented size.',
  },
  {
    question: 'Are All Weird Unit Conversions Exact?',
    answer:
      'No. Some references are defined standards; others are approximate real-world averages and are labeled accordingly.',
  },
];
