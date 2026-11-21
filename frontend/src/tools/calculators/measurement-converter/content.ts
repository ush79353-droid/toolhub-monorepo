import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertMeasurement, formatWithPrecision } from './calculation';

export const MEASUREMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'units-of-measurement', label: 'Units of Measurement: The Scale of Reality' },
  { id: 'how-to-convert-measurement-units', label: 'How to Convert Measurement Units' },
  { id: 'chain-rule-measurement-conversion', label: 'The Chain Rule for Measurement Conversion' },
  { id: 'understanding-significant-figures', label: 'Understanding Significant Figures' },
  { id: 'how-to-use-measurement-converter', label: 'How to Use the Measurement Converter' },
  { id: 'related-measurement-tools', label: 'Related Measurement Tools' },
  { id: 'measurement-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  links?: readonly { href: string; label: string }[];
}

const mpsFromKmh = convertMeasurement({
  value: 100,
  category: 'speed',
  fromUnit: 'kmh',
  toUnit: 'mps',
});
const kmFromM = convertMeasurement({ value: 1500, category: 'length', fromUnit: 'm', toUnit: 'km' });
const fFromC = convertMeasurement({ value: 0, category: 'temperature', fromUnit: 'C', toUnit: 'F' });

export const MEASUREMENT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'units-of-measurement',
    title: 'Units of Measurement: The Scale of Reality',
    paragraphs: [
      'A measurement pairs a number with a unit. Without the unit, the number has no physical meaning. The International System of Units (SI) provides a coherent set of base units (meter, kilogram, second, ampere, kelvin, mole, and candela) plus derived units built from them.',
      'Metric prefixes (nano, micro, milli, kilo, mega, …) scale SI units by powers of ten. Scientific notation keeps very large or very small values readable. Every measured value also carries uncertainty; a converter can preserve arithmetic precision, but it cannot invent the uncertainty of an instrument reading.',
    ],
  },
  {
    id: 'how-to-convert-measurement-units',
    title: 'How to Convert Measurement Units: Technique and Examples',
    paragraphs: [
      'Choose a measurement category so both units share the same dimension. Identify the source and target units, apply the conversion factor (or temperature’s affine formulas), and check that dimensions cancel correctly.',
      `Example 1: length: 1,500 m → ${kmFromM.ok ? formatWithPrecision(kmFromM.value, 'auto'): '1.5'} km because 1 m = 0.001 km.`,
      `Example 2: speed: 100 km/h → ${mpsFromKmh.ok ? formatWithPrecision(mpsFromKmh.value, 'auto'): '27.777…'} m/s using (1000 m / 1 km) × (1 h / 3600 s).`,
      `Example 3: temperature: 0 °C = ${fFromC.ok ? formatWithPrecision(fFromC.value, 'auto'): '32'} °F. Temperature needs an offset as well as a scale.`,
    ],
    formula: 'Converted = Original × (Source factor / Target factor)',
  },
  {
    id: 'chain-rule-measurement-conversion',
    title: 'The Chain Rule for the Conversion of Measurement Units',
    paragraphs: [
      'You can route a conversion through intermediate units when a direct factor is not listed. Example: miles → feet → inches → centimeters.',
      '1 mile = 5280 feet, 1 foot = 12 inches, 1 inch = 2.54 centimeters. Therefore 1 mile = 5280 × 12 × 2.54 = 160,934.4 cm.',
      'Keep full precision until the final display. Rounding intermediate steps can accumulate error even when each factor is exact.',
    ],
    formula: '1 mi = 5280 × 12 × 2.54 cm = 160934.4 cm',
  },
  {
    id: 'understanding-significant-figures',
    title: 'Understanding Significant Figures',
    paragraphs: [
      'Mathematical precision is not the same as measurement uncertainty. Displayed decimal places and significant-figure settings only control formatting. The converter keeps full internal precision and rounds only for display.',
      'Choosing “3 significant figures” does not mean the original measurement was known to three figures; you must still interpret instrument limits yourself.',
    ],
  },
  {
    id: 'how-to-use-measurement-converter',
    title: "How to Use Omega's Measurement Converter",
    paragraphs: [
      '1. Select the measurement category (dimension). 2. Choose the source unit. 3. Choose the target unit. 4. Enter the measurement in either field. 5. Read the calculated result. 6. Adjust precision if needed. 7. Swap units or edit the other field to reverse the conversion. Reload restores length defaults; Clear empties the values for the current category.',
    ],
  },
  {
    id: 'dimensional-analysis',
    title: 'Dimensional Analysis',
    paragraphs: [
      'Base dimensions include length [L], mass [M], time [T], and thermodynamic temperature [Θ]. Compound quantities combine them: speed [L][T]⁻¹, acceleration [L][T]⁻², force [M][L][T]⁻², energy [M][L]²[T]⁻², power [M][L]²[T]⁻³, pressure [M][L]⁻¹[T]⁻².',
      'Conversion factors cancel units algebraically. Example: 100 km/h = 100 × (1000 m / 1 km) × (1 h / 3600 s) ≈ 27.7778 m/s.',
    ],
    formula: '100 km/h = 100 × (1000 m)/(1 km) × (1 h)/(3600 s) ≈ 27.7778 m/s',
  },
  {
    id: 'related-measurement-tools',
    title: 'Other Measurement Conversion Tools',
    paragraphs: ['Related Omega Calculators tools that already exist:'],
    links: [
      { href: '/tools/length-converter', label: 'Length Converter' },
      { href: '/tools/weight-converter', label: 'Weight Converter' },
      { href: '/tools/volume-conversion', label: 'Volume Conversion' },
      { href: '/tools/area-converter', label: 'Area Converter' },
      { href: '/tools/speed-conversion', label: 'Speed Conversion' },
      { href: '/tools/temperature-conversion', label: 'Temperature Conversion' },
      { href: '/tools/energy-conversion-calculator', label: 'Energy Conversion Calculator' },
      { href: '/tools/pressure-conversion', label: 'Pressure Conversion' },
      { href: '/tools/conversion-calculator', label: 'Conversion Calculator' },
    ],
  },
];

export const MEASUREMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Between Two Measurement Units?',
    answer:
      'For linear units: converted value = original value × (source factor / target factor), where factors express each unit in a shared SI base. Temperature also needs an offset (for example °C ↔ K adds or subtracts 273.15).',
  },
  {
    question: 'How Do I Convert Meters per Second to Feet per Hour?',
    answer:
      '1 m = 3.280839895 ft and 1 h = 3600 s, so 1 m/s = 3.280839895 × 3600 ≈ 11,811.023622 ft/h.',
  },
  {
    question: 'How Do I Find the Conversion Factor of a Compound Measurement Unit?',
    answer:
      'Convert numerator and denominator separately. Example: 1 km/h = (1000 m)/(3600 s) ≈ 0.2777778 m/s.',
  },
  {
    question: 'How Much Is 1 lb in Gallons per Day?',
    answer:
      'Pounds measure mass; gallons per day measure volumetric flow. Different dimensions cannot convert directly. You need density (and the time interval) to relate mass and volume flow.',
  },
  {
    question: 'What Are SI Base Units?',
    answer:
      'The seven SI base units are the meter, kilogram, second, ampere, kelvin, mole, and candela.',
  },
  {
    question: 'What Is the Difference Between Metric and Imperial Units?',
    answer:
      'Metric (SI) units scale by powers of ten and are the international scientific standard. Imperial and US customary units (inch, pound, gallon, …) remain common in some regions and industries; this converter keeps US and Imperial gallons distinct.',
  },
  {
    question: 'Can I Convert Units with Different Dimensions?',
    answer:
      'Not directly. Mass and volume, for example, require density. The converter rejects mismatched categories so kilograms cannot be turned into seconds without an additional physical relationship.',
  },
];
