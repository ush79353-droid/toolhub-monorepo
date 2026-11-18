import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  PASCALS_PER_PSI,
  PSI_PER_PA,
  formatPressure,
  pascalToPsi,
  psiToPascal,
} from './calculation';

export const PA_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pa to PSI Converter' },
  { id: 'how-to-use', label: 'How to Use the Pa to PSI Converter' },
  { id: 'units', label: 'Pascals and Pounds per Square Inch' },
  { id: 'conversion', label: 'Pa to PSI Conversion' },
  { id: 'conversion-table', label: 'Pa to PSI Conversion Table' },
  { id: 'related-converters', label: 'Other Pressure Converters' },
  { id: 'pa-to-psi-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_PA = [1, 10, 100, 1_000, 5_000, 10_000, 50_000, 100_000, 200_000, 1_000_000] as const;

export const PA_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pa to PSI Converter',
    paragraphs: [
      'Convert pressure between pascals (Pa) and pounds-force per square inch (psi) instantly. Useful for physics, engineering, tire pressure, hydraulic systems, pneumatic equipment, and industrial pressure measurements.',
      'Both fields stay linked through the exact international psi definition. Signed gauge or differential values are allowed; absolute pressure cannot be physically negative, and this tool does not add or subtract atmospheric pressure.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pa to PSI Converter',
    paragraphs: [
      '1. Enter the pressure in pascals.',
      '2. Read the equivalent pressure in psi.',
      '3. Alternatively, enter pressure in psi.',
      '4. The calculator automatically converts psi back to pascals.',
      '5. Use Share, Reload Calculator, or Clear All Changes when needed.',
      'No separate Calculate button is required — conversions update as you type.',
    ],
  },
  {
    id: 'units',
    title: 'Pascals and Pounds per Square Inch',
    paragraphs: [
      'The pascal is the SI unit of pressure: 1 Pa = 1 N/m². It is widely used in scientific and engineering measurements.',
      'PSI is pounds-force per square inch — one pound-force applied over one square inch. It is common for tire pressure, compressors, and industrial systems. PSI is not the same as pounds of mass.',
      'Both units measure force per unit area; one psi is much larger than one pascal.',
    ],
  },
  {
    id: 'conversion',
    title: 'Pa to PSI Conversion',
    paragraphs: [
      `psi = Pa × ${formatPressure(PSI_PER_PA)}, which is the same as psi = Pa ÷ ${formatPressure(PASCALS_PER_PSI)}.`,
      `Example — convert 240 Pa: 240 × ${formatPressure(PSI_PER_PA)} ≈ ${formatPressure(pascalToPsi(240))} psi.`,
      `Example — convert 122 psi: 122 × ${formatPressure(PASCALS_PER_PSI)} ≈ ${formatPressure(psiToPascal(122))} Pa.`,
      'Converting psi to pascals multiplies by the pascals-per-psi factor; converting pascals to psi divides by the same factor.',
    ],
    formula: `psi = Pa / ${formatPressure(PASCALS_PER_PSI)}\nPa = psi × ${formatPressure(PASCALS_PER_PSI)}`,
  },
  {
    id: 'conversion-table',
    title: 'Pa to PSI Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator. Displayed results are rounded for readability.',
    ],
    tableHeaders: ['Pascals (Pa)', 'PSI (approx.)'],
    table: TABLE_PA.map((v) => [formatPressure(v), formatPressure(pascalToPsi(v))]),
  },
  {
    id: 'related-converters',
    title: 'Other Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Pascal Conversion, Pressure Conversion, kPa to PSI Conversion, MPa to PSI Conversion, Bar to PSI Converter, mmHg to ATM Conversion, and ATM Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PA_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert PSI to Pascals?',
    answer: `Multiply the pressure in psi by approximately ${formatPressure(PASCALS_PER_PSI)}.`,
  },
  {
    question: 'How Many Pascals Is 30 PSI?',
    answer: `30 psi is approximately ${formatPressure(psiToPascal(30))} pascals.`,
  },
  {
    question: 'How Many PSI Is 1000 Pascals?',
    answer: `1000 pascals is approximately ${formatPressure(pascalToPsi(1000))} psi.`,
  },
  {
    question: 'Is Pascal a Unit of Pressure?',
    answer:
      'Yes. Pascal is the SI-derived unit of pressure, equivalent to one newton per square meter.',
  },
  {
    question: 'What Is the Difference Between Pa and PSI?',
    answer: `Pa is an SI pressure unit, while psi is based on pound-force per square inch. One psi equals approximately ${formatPressure(PASCALS_PER_PSI)} Pa, so psi represents a much larger pressure than one pascal.`,
  },
  {
    question: 'Can Pressure Values Be Negative?',
    answer:
      'Gauge and differential pressures can be negative relative to a reference pressure. Absolute pressure cannot be negative.',
  },
];
