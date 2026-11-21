import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-conversion', label: 'What Is a Conversion Calculator?' },
  { id: 'measurement-systems', label: 'Different Measurement Systems' },
  { id: 'common-units', label: 'Common Conversion Units' },
  { id: 'how-to-use', label: 'How to Use the Conversion Calculator' },
  { id: 'length', label: 'Length Conversion' },
  { id: 'mass', label: 'Weight and Mass Conversion' },
  { id: 'temperature', label: 'Temperature Conversion' },
  { id: 'volume', label: 'Volume Conversion' },
  { id: 'area', label: 'Area Conversion' },
  { id: 'speed', label: 'Speed Conversion' },
  { id: 'data-storage', label: 'Data Storage and Digital Units' },
  { id: 'length-table', label: 'Common Length Conversions' },
  { id: 'time-table', label: 'Common Time Conversions' },
  { id: 'conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CONVERSION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-conversion',
    title: 'What Is a Conversion Calculator?',
    paragraphs: [
      'A conversion calculator transforms a numerical measurement from one unit into another equivalent unit of the same physical quantity. It is useful for metric and imperial everyday tasks, SI scientific work, cooking, travel, engineering, and digital storage estimates.',
      'This tool converts within a selected category; length, mass, temperature, and so on. It does not convert incompatible quantities (for example, meters into kilograms).',
    ],
  },
  {
    id: 'measurement-systems',
    title: 'Different Measurement Systems',
    paragraphs: [
      'The International System of Units (SI) is the modern metric standard used in science and most countries. U.S. customary and imperial systems remain common for everyday length, volume, and mass in some regions.',
      'Some unit names look similar across systems but differ in definition, for example, the U.S. liquid gallon and the imperial gallon. This calculator labels those distinctions explicitly.',
    ],
  },
  {
    id: 'common-units',
    title: 'Common Conversion Units',
    paragraphs: [
      'Frequently used categories include length (m, cm, in, ft, mi), mass (kg, g, lb, oz), volume (L, mL, gallons), temperature (°C, °F, K), time, speed, area, pressure, energy, and data storage.',
    ],
    tableHeaders: ['Category', 'Example units'],
    table: [
      ['Length', 'mm, cm, m, km, in, ft, yd, mi'],
      ['Mass', 'mg, g, kg, t, oz, lb'],
      ['Volume', 'mL, L, m³, tsp, tbsp, cup, gal (US/UK)'],
      ['Temperature', '°C, °F, K'],
      ['Time', 'ms, s, min, h, d, wk, mo, yr'],
      ['Speed', 'm/s, km/h, mph, kn'],
      ['Area', 'm², ft², acre, ha'],
      ['Pressure', 'Pa, kPa, bar, atm, psi, torr'],
      ['Energy', 'J, kJ, cal, kcal, Wh, kWh, BTU'],
      ['Data storage', 'bit, B, kB, MB, GB, KiB, MiB, GiB'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Conversion Calculator',
    paragraphs: [
      '1. Select a measurement category.',
      '2. Enter the value to convert.',
      '3. Choose the source unit.',
      '4. Choose the destination unit.',
      '5. View the converted value instantly.',
      '6. Use Swap Units to reverse the pair.',
      '7. Edit the converted field for reverse conversion.',
      '8. Share the result or reload/clear when you need a reset.',
    ],
  },
  {
    id: 'length',
    title: 'Length Conversion',
    paragraphs: [
      'Length conversions use exact international definitions where available. One meter equals 100 centimeters. One international inch equals exactly 2.54 centimeters. One foot equals 12 inches. One mile equals 1.609344 kilometers.',
    ],
    formula: '1 m = 100 cm · 1 in = 2.54 cm · 1 mi = 1.609344 km',
  },
  {
    id: 'mass',
    title: 'Weight and Mass Conversion',
    paragraphs: [
      'In everyday speech people often say “weight” when they mean mass. This calculator converts mass units such as kilograms, grams, pounds, and ounces. It does not convert force (newtons) in the mass category. Use the Force category for that.',
    ],
    formula: '1 kg = 1,000 g · 1 lb = 0.45359237 kg',
  },
  {
    id: 'temperature',
    title: 'Temperature Conversion',
    paragraphs: [
      'Temperature is not a simple scale-factor conversion. Celsius, Fahrenheit, and Kelvin use affine formulas with offsets.',
    ],
    formula: '°F = (°C × 9/5) + 32 · °C = (°F − 32) × 5/9 · K = °C + 273.15',
  },
  {
    id: 'volume',
    title: 'Volume Conversion',
    paragraphs: [
      'Liters and milliliters are metric. A cubic meter equals 1,000 liters. U.S. liquid gallons and imperial gallons differ: 1 U.S. liquid gallon = 3.785411784 L; 1 imperial gallon = 4.54609 L.',
    ],
  },
  {
    id: 'area',
    title: 'Area Conversion',
    paragraphs: [
      'Area units include square meters, square feet, hectares, and acres. One hectare equals 10,000 square meters. One acre equals 4,046.8564224 square meters.',
    ],
  },
  {
    id: 'speed',
    title: 'Speed Conversion',
    paragraphs: [
      'Common speed units include meters per second, kilometers per hour, miles per hour, and knots. One meter per second equals 3.6 kilometers per hour.',
    ],
    formula: '1 m/s = 3.6 km/h',
  },
  {
    id: 'data-storage',
    title: 'Data Storage and Digital Units',
    paragraphs: [
      'Decimal SI prefixes (kB, MB, GB, TB) use powers of 1,000. Binary IEC prefixes (KiB, MiB, GiB, TiB) use powers of 1,024. One MB is 1,000,000 bytes; one MiB is 1,048,576 bytes.',
    ],
  },
  {
    id: 'length-table',
    title: 'Common Length Conversions',
    paragraphs: ['Quick reference values:'],
    tableHeaders: ['From', 'To', 'Value'],
    table: [
      ['1 meter', 'centimeters', '100'],
      ['1 kilometer', 'meters', '1,000'],
      ['1 inch', 'centimeters', '2.54'],
      ['1 foot', 'inches', '12'],
      ['1 mile', 'kilometers', '1.609344'],
    ],
  },
  {
    id: 'time-table',
    title: 'Common Time Conversions',
    paragraphs: [
      'Calendar-derived units use a Julian-year convention: 1 year = 365.25 days; 1 month = 1/12 of that average year.',
    ],
    tableHeaders: ['From', 'To', 'Value'],
    table: [
      ['1 minute', 'seconds', '60'],
      ['1 hour', 'minutes', '60'],
      ['1 day', 'hours', '24'],
      ['1 week', 'days', '7'],
    ],
  },
];

export const CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is a Unit Conversion Calculator?',
    answer:
      'A unit conversion calculator transforms a numerical measurement from one supported unit into another equivalent unit of the same physical quantity.',
  },
  {
    question: 'How Do I Convert Meters to Feet?',
    answer: 'Multiply meters by approximately 3.28084, or select Length → Meter → Foot in this calculator.',
  },
  {
    question: 'How Many Centimeters Are in One Inch?',
    answer: 'One international inch equals exactly 2.54 centimeters.',
  },
  {
    question: 'How Do I Convert Celsius to Fahrenheit?',
    answer: 'Multiply Celsius by 9/5 and add 32. Example: 0 °C → 32 °F; 100 °C → 212 °F.',
  },
  {
    question: 'How Many Liters Are in a U.S. Gallon?',
    answer: 'One U.S. liquid gallon equals exactly 3.785411784 liters.',
  },
  {
    question: 'Can I Convert Metric Units to Imperial Units?',
    answer:
      'Yes. Select the relevant measurement category, then choose the source and destination units.',
  },
  {
    question: 'What Is the Difference Between MB and MiB?',
    answer: 'MB represents one million bytes (1,000,000), while MiB represents 1,048,576 bytes.',
  },
  {
    question: 'Can I Convert Multiple Types of Units?',
    answer:
      'Yes, but each conversion must take place within a compatible measurement category. Changing the category updates the available units.',
  },
];
