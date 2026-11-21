import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_KGFCM2,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  convertPressure,
  formatPressure,
} from './calculation';
import { PASCALS_PER_HPA } from './types';

export const PRESSURE_UNIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pressure Unit Conversion' },
  { id: 'understanding', label: 'Understanding Pressure Units' },
  { id: 'how-to-use', label: 'Using the Pressure Unit Converter' },
  { id: 'conversion-chart', label: 'Pressure Unit Conversion Chart' },
  { id: 'how-to-convert', label: 'How to Convert Between Pressure Units' },
  { id: 'related-converters', label: 'More Pressure Converters' },
  { id: 'pressure-unit-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const PRESSURE_UNIT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pressure Unit Conversion',
    paragraphs: [
      'Pressure is force distributed over an area. Science, engineering, weather, and industry use many pressure units, so converting between them is a frequent task.',
      'This calculator converts a pressure value into equivalent readings in Pa, kPa, bar, psi, atm, Torr, mmHg, and more. Enter any supported unit and the rest update instantly. It converts units only; it does not change absolute vs gauge reference.',
    ],
  },
  {
    id: 'understanding',
    title: 'Understanding Pressure Units',
    paragraphs: [
      `Pascal (Pa): the SI unit of pressure. 1 Pa = 1 N/m²; one newton of force over one square meter.`,
      `Kilopascal (kPa): 1 kPa = ${formatPressure(PASCALS_PER_KPA)} Pa. Common in engineering and meteorology.`,
      `Bar: 1 bar = ${formatPressure(PASCALS_PER_BAR)} Pa. Common in industrial and mechanical applications.`,
      'Pounds per square inch (psi): one pound-force over one square inch. Common for tire pressure and hydraulics.',
      `Standard atmosphere (atm): 1 atm = ${formatPressure(PASCALS_PER_ATM)} Pa exactly: a standard reference pressure.`,
      `Torr and mmHg: often used in vacuum work, laboratories, and medical pressure measurements. One Torr is exactly 1/760 atm (≈ ${formatPressure(PASCALS_PER_TORR)} Pa). Conventional mmHg is ${formatPressure(PASCALS_PER_MMHG)} Pa; very close to Torr but not identical by definition.`,
    ],
    formula: `1 Pa = 1 N/m²\n1 bar = ${formatPressure(PASCALS_PER_BAR)} Pa\n1 atm = ${formatPressure(PASCALS_PER_ATM)} Pa`,
  },
  {
    id: 'how-to-use',
    title: 'Using the Pressure Unit Converter',
    paragraphs: [
      '1. Locate the pressure unit you know among the primary fields (bar, psi, atm, Pa).',
      '2. Enter the pressure value into that field.',
      '3. All other visible units update automatically.',
      '4. Expand More pressure units for kPa, MPa, hPa, mbar, mmHg, Torr, inHg, and kgf/cm².',
      '5. Enter a value into any other field to change the conversion source.',
      '6. Use Reload Calculator to restore 1 bar, or Clear All Changes to empty every field.',
      `Example; 0.5 bar: 0.5 × ${formatPressure(PASCALS_PER_BAR)} = ${formatPressure(convertPressure(0.5, 'bar', 'Pa'))} Pa ≈ ${formatPressure(convertPressure(0.5, 'bar', 'psi'))} psi.`,
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Pressure Unit Conversion Chart',
    paragraphs: [
      'Reference values in pascals for one unit of each common pressure measure. Rounded display values use the same constants as the calculator.',
    ],
    tableHeaders: ['Pressure unit', 'Equivalent in Pa'],
    table: [
      ['1 Pa', '1'],
      ['1 hPa', formatPressure(PASCALS_PER_HPA)],
      ['1 kPa', formatPressure(PASCALS_PER_KPA)],
      ['1 MPa', formatPressure(PASCALS_PER_MPA)],
      ['1 mbar', formatPressure(PASCALS_PER_MBAR)],
      ['1 bar', formatPressure(PASCALS_PER_BAR)],
      ['1 atm', formatPressure(PASCALS_PER_ATM)],
      ['1 psi', `≈ ${formatPressure(PASCALS_PER_PSI)}`],
      ['1 Torr', `≈ ${formatPressure(PASCALS_PER_TORR)}`],
      ['1 mmHg', `≈ ${formatPressure(PASCALS_PER_MMHG)}`],
      ['1 inHg', `≈ ${formatPressure(PASCALS_PER_INHG)}`],
      ['1 kgf/cm²', formatPressure(PASCALS_PER_KGFCM2)],
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Between Pressure Units',
    paragraphs: [
      'Convert the source pressure to pascals, then convert that Pascal value into the target unit.',
      `Pascal to kilopascal: kPa = Pa ÷ ${formatPressure(PASCALS_PER_KPA)}. Example: 250000 Pa = ${formatPressure(convertPressure(250000, 'Pa', 'kPa'))} kPa.`,
      `Bar to psi: psi = bar × ${formatPressure(convertPressure(1, 'bar', 'psi'))}. Example: 3 bar ≈ ${formatPressure(convertPressure(3, 'bar', 'psi'))} psi.`,
      `Atm to Pascal: Pa = atm × ${formatPressure(PASCALS_PER_ATM)}. Example: 2 atm = ${formatPressure(convertPressure(2, 'atm', 'Pa'))} Pa.`,
      `Pascal to bar: bar = Pa ÷ ${formatPressure(PASCALS_PER_BAR)}. Example: 500000 Pa = ${formatPressure(convertPressure(500000, 'Pa', 'bar'))} bar.`,
    ],
    formula: 'P_Pa = P_input × F_input\nP_output = P_Pa ÷ F_output',
  },
  {
    id: 'related-converters',
    title: 'More Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages include Pressure Conversion, Pascal Conversion, Pa to PSI Converter, MPa Conversion, MPa to PSI Conversion, MPa to psig Conversion, mmHg to atm Conversion, mm to ATM Converter, Bar to PSI Conversion, and kPa to PSI Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PRESSURE_UNIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What Are Five Common Units of Pressure?',
    answer:
      'Five commonly used pressure units are Pascal (Pa), kilopascal (kPa), bar, pounds per square inch (psi), and standard atmosphere (atm). Pascals and kilopascals appear in SI science and engineering; bar is common industrially; psi is common in US customary equipment; atm is a standard reference pressure.',
  },
  {
    question: 'How Can I Convert Pascals to kPa?',
    answer: `Divide the pressure in Pascals by ${formatPressure(PASCALS_PER_KPA)}: kPa = Pa ÷ ${formatPressure(PASCALS_PER_KPA)}. For example, 5000 Pa = ${formatPressure(convertPressure(5000, 'Pa', 'kPa'))} kPa.`,
  },
  {
    question: 'How Much Is 25 Torr in mmHg?',
    answer: `Using the calculator definitions, 25 Torr ≈ ${formatPressure(convertPressure(25, 'Torr', 'mmHg'))} mmHg. Torr and conventional mmHg are almost equal, but Torr is exactly 1/760 atm while conventional mmHg uses ${formatPressure(PASCALS_PER_MMHG)} Pa.`,
  },
  {
    question: 'How Many PSI Are in One Bar?',
    answer: `One bar equals approximately ${formatPressure(convertPressure(1, 'bar', 'psi'))} psi.`,
  },
  {
    question: 'Is One Atmosphere Equal to One Bar?',
    answer: `No. 1 atm = ${formatPressure(convertPressure(1, 'atm', 'bar'))} bar.`,
  },
  {
    question: 'What Is the SI Unit of Pressure?',
    answer:
      'The SI unit of pressure is the Pascal (Pa). One Pascal equals one newton per square meter.',
  },
  {
    question: 'Can Pressure Be Negative?',
    answer:
      'Gauge pressure can be negative relative to a reference pressure. Absolute pressure cannot be negative under ordinary physical definitions. This calculator converts numerical pressure values between units without changing the pressure reference type.',
  },
];
