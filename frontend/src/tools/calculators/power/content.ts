import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const POWER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'power-units', label: 'Power Units' },
  { id: 'power-conversions', label: 'Power Conversions' },
  { id: 'what-is-a-watt', label: 'What Is a Watt?' },
  { id: 'si-multiples', label: 'SI Multiples for Watt (W)' },
  { id: 'horsepower-types', label: 'Horsepower and Its Types' },
  { id: 'how-to-use', label: 'Power Converter: How to Use' },
  { id: 'power-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const POWER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'power-units',
    title: 'Power Units',
    paragraphs: [
      'Power is the rate at which energy is transferred or work is done. In other words, power tells you how quickly energy moves over time.',
      'The SI unit of power is the watt (W). Engineers also use milliwatts and kilowatts for electronics and electrical loads, horsepower for engines and machinery, and BTU per hour for heating and cooling systems.',
      'Power and energy are related but not the same. Energy is a quantity of work or heat; power is how fast that energy is delivered. One watt for one hour equals one watt-hour of energy.',
    ],
    formula: 'P = E / t   (P = power, E = energy, t = elapsed time)',
  },
  {
    id: 'power-conversions',
    title: 'Power Conversions',
    paragraphs: [
      'This converter uses watts as the internal base unit. Convert any input to watts by multiplying by that unit’s watts factor, then divide by the target unit’s factor.',
      'Examples: W to kW divides by 1,000; kW to W multiplies by 1,000; W to mW multiplies by 1,000. Mechanical horsepower uses 745.6998715822702 W per hp(I). International-table BTU/h uses 1055.05585262 J per BTU, so 1 BTU/h ≈ 0.29307107 W.',
      'Worked example: 1000 W → 1 kW, 1,000,000 mW, ≈ 1.34102209 hp(I), ≈ 1.35962162 PS, and ≈ 3412.14163 BTU/h.',
    ],
    formula: 'Result = (Input × Source Factor) / Target Factor',
  },
  {
    id: 'what-is-a-watt',
    title: 'What Is a Watt?',
    paragraphs: [
      'A watt is the SI unit of power. One watt equals one joule of energy per second. Watt-hours measure energy (power × time), not instantaneous power.',
      'In a simple DC circuit, electrical power is the product of voltage and current. In AC circuits, real power also depends on the power factor between voltage and current.',
    ],
    formula: '1 W = 1 J/s · P = V I (DC)',
  },
  {
    id: 'si-multiples',
    title: 'SI Multiples for Watt (W)',
    paragraphs: [
      'SI prefixes scale the watt from tiny sensor signals (nanowatts and microwatts) to utility and industrial levels (megawatts, gigawatts, and beyond).',
    ],
    tableHeaders: ['Prefix', 'Symbol', 'Watts'],
    table: [
      ['nano', 'nW', '10⁻⁹'],
      ['micro', 'µW', '10⁻⁶'],
      ['milli', 'mW', '10⁻³'],
      ['centi', 'cW', '10⁻²'],
      ['deci', 'dW', '10⁻¹'],
      ['base unit', 'W', '1'],
      ['deca', 'daW', '10¹'],
      ['hecto', 'hW', '10²'],
      ['kilo', 'kW', '10³'],
      ['mega', 'MW', '10⁶'],
      ['giga', 'GW', '10⁹'],
      ['tera', 'TW', '10¹²'],
      ['peta', 'PW', '10¹⁵'],
    ],
  },
  {
    id: 'horsepower-types',
    title: 'Horsepower and Its Types',
    paragraphs: [
      'Horsepower is not a single universal constant. Historical and regional definitions differ, so mechanical horsepower and metric horsepower must stay distinct.',
      'Mechanical horsepower (imperial, often written hp(I)) is defined as exactly 550 ft·lbf/s, which equals 745.6998715822702 W. It is commonly used for engines and machinery in customary-unit contexts.',
      'Metric horsepower (Pferdestärke, PS) is defined as 735.49875 W. Vehicle specifications in some countries still quote metric horsepower rather than mechanical horsepower.',
    ],
    formula: '1 hp(I) ≈ 745.6998716 W · 1 PS = 735.49875 W',
  },
  {
    id: 'how-to-use',
    title: 'Power Converter: How to Use',
    paragraphs: [
      '1. Open the Power Converter on this page.',
      '2. Expand the SI Units, Horsepower, or Other Power Units group you need.',
      '3. Choose any input field (mW, W, kW, hp(I), PS, ft·lbf rates, or BTU/h).',
      '4. Enter a numeric value — decimals, negatives, and scientific notation are supported.',
      '5. Read the synchronized values across all supported units.',
      '6. Use Share Result to copy the conversion, Reload Calculator to restore defaults, or Clear All Changes to empty the fields while keeping accordion state.',
    ],
  },
];

export const POWER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Watts to Kilowatts?',
    answer: 'Divide watts by 1,000. Example: 2500 W = 2.5 kW.',
  },
  {
    question: 'How Many Watts Are in One Horsepower?',
    answer:
      'One mechanical horsepower equals approximately 745.7 watts (exactly 745.6998715822702 W in this converter).',
  },
  {
    question: 'How Do I Convert Kilowatts to Horsepower?',
    answer:
      'Convert kilowatts to watts (× 1,000), then divide by the horsepower factor. For mechanical horsepower: hp = (kW × 1000) / 745.6998715822702.',
  },
  {
    question: 'How Many Watts Are in One BTU per Hour?',
    answer:
      'One international-table BTU per hour equals approximately 0.29307107 watts.',
  },
  {
    question: 'What Is the Difference Between Watts and Watt-Hours?',
    answer:
      'Watts measure power (energy per unit time). Watt-hours measure energy (power accumulated over time).',
  },
  {
    question: 'How Many Watts Are in One Megawatt?',
    answer: 'One megawatt equals 1,000,000 watts.',
  },
  {
    question: 'Is One Mechanical Horsepower Equal to One Metric Horsepower?',
    answer:
      'No. Mechanical horsepower is about 745.70 W, while metric horsepower (PS) is 735.49875 W.',
  },
];
