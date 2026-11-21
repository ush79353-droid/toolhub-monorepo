import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertPressure,
  formatPressure,
  PASCALS_PER_ATM,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from './calculation';

export const MPA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'MPa Conversion' },
  { id: 'units', label: 'Megapascal Conversion and MPa Units' },
  { id: 'formulas', label: 'Megapascal Conversion Formulas' },
  { id: 'examples', label: 'MPa Conversion Examples' },
  { id: 'how-to-use', label: 'How to Use the MPa Conversion Calculator' },
  { id: 'conversion-table', label: 'MPa Conversion Table' },
  { id: 'related-tools', label: 'Other Pressure Conversion Tools' },
  { id: 'mpa-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MPA = [0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100] as const;

const BAR_PER_MPA = 10;
const PSI_PER_MPA = PASCALS_PER_MPA / PASCALS_PER_PSI;
const MPA_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_MPA;
const ATM_PER_MPA = PASCALS_PER_MPA / PASCALS_PER_ATM;
const MPA_PER_ATM = PASCALS_PER_ATM / PASCALS_PER_MPA;
const TORR_PER_MPA = PASCALS_PER_MPA / PASCALS_PER_TORR;
const MPA_PER_TORR = PASCALS_PER_TORR / PASCALS_PER_MPA;

export const MPA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'MPa Conversion',
    paragraphs: [
      'Convert megapascals (MPa) into bar, pounds per square inch (psi), standard atmospheres (atm), and Torr. Useful for mechanical engineering, hydraulic systems, material testing, industrial equipment, pressure gauges, fluid mechanics, and manufacturing.',
      'One megapascal equals one million pascals. Enter any supported unit: the calculator converts through pascals and updates every field. Signed gauge readings are allowed; absolute-versus-gauge adjustments are not applied automatically.',
    ],
  },
  {
    id: 'units',
    title: 'Megapascal Conversion and MPa Units',
    paragraphs: [
      `The pascal is the SI unit of pressure: 1 Pa = 1 N/m². Exactly 1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa = 10⁶ Pa.`,
      `Primary factors: 1 MPa = ${BAR_PER_MPA} bar; 1 MPa ≈ ${formatPressure(PSI_PER_MPA)} psi; 1 MPa ≈ ${formatPressure(ATM_PER_MPA)} atm; 1 MPa ≈ ${formatPressure(TORR_PER_MPA)} Torr.`,
      'MPa is commonly used for high pressures in materials science, hydraulics, and structural engineering where kilopascals would produce large numeric values.',
    ],
    formula: `1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa\n1 Pa = 1 N/m²\n1 MPa = ${BAR_PER_MPA} bar`,
  },
  {
    id: 'formulas',
    title: 'Megapascal Conversion Formulas',
    paragraphs: [
      `MPa to bar: bar = MPa × ${BAR_PER_MPA}. Bar to MPa: MPa = bar ÷ ${BAR_PER_MPA}.`,
      `MPa to psi: psi ≈ MPa × ${formatPressure(PSI_PER_MPA)}. psi to MPa: MPa ≈ psi × ${formatPressure(MPA_PER_PSI)}.`,
      `MPa to atmospheres: atm = MPa ÷ ${formatPressure(MPA_PER_ATM)}. Atmospheres to MPa: MPa = atm × ${formatPressure(MPA_PER_ATM)}.`,
      `MPa to Torr: Torr ≈ MPa × ${formatPressure(TORR_PER_MPA)}. Torr to MPa: MPa ≈ Torr × ${formatPressure(MPA_PER_TORR)}.`,
      'Displayed factors may be rounded for readability; the calculator uses exact pascal-based constants (1 Torr = 1 atm ÷ 760).',
    ],
    formula: `bar = MPa × ${BAR_PER_MPA}\npsi ≈ MPa × ${formatPressure(PSI_PER_MPA)}\natm = MPa ÷ ${formatPressure(MPA_PER_ATM)}\nTorr ≈ MPa × ${formatPressure(TORR_PER_MPA)}`,
  },
  {
    id: 'examples',
    title: 'MPa Conversion Examples',
    paragraphs: [
      `Example 1: 5 MPa to bar: 5 × ${BAR_PER_MPA} = ${formatPressure(convertPressure(5, 'MPa', 'bar'))} bar.`,
      `Example 2: 5 MPa to psi: 5 × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(convertPressure(5, 'MPa', 'psi'))} psi.`,
      `Example 3: 2 MPa to atm: 2 ÷ ${formatPressure(MPA_PER_ATM)} ≈ ${formatPressure(convertPressure(2, 'MPa', 'atm'))} atm.`,
      `Example 4: 100 bar to MPa: 100 ÷ ${BAR_PER_MPA} = ${formatPressure(convertPressure(100, 'bar', 'MPa'))} MPa.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the MPa Conversion Calculator',
    paragraphs: [
      '1. Enter pressure in MPa or another supported unit.',
      '2. The calculator converts the input to pascals internally.',
      '3. Read the equivalent values in the remaining fields.',
      '4. Edit any field to reverse the conversion.',
      '5. Use Reload Calculator or Clear All Changes to start over.',
      '6. Share or copy the result with the built-in actions.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'MPa Conversion Table',
    paragraphs: [
      'Common megapascal values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['MPa', 'bar', 'psi (approx.)', 'atm (approx.)'],
    table: TABLE_MPA.map((mpa) => [
      formatPressure(mpa),
      formatPressure(convertPressure(mpa, 'MPa', 'bar')),
      formatPressure(convertPressure(mpa, 'MPa', 'psi')),
      formatPressure(convertPressure(mpa, 'MPa', 'atm')),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Pressure Conversion, kPa Converter, kPa to atm Conversion, kPa to psi Conversion, PSI Converter, Bar to atm Conversion, mmHg to atm Conversion, and KSI to MPa Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MPA_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I Convert MPa to N/m²?',
    answer: `Yes. One megapascal equals one million newtons per square meter: 1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} N/m².`,
  },
  {
    question: 'How Can I Convert 5 MPa to PSI?',
    answer: `Multiply by approximately ${formatPressure(PSI_PER_MPA)}. 5 × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(convertPressure(5, 'MPa', 'psi'))} psi.`,
  },
  {
    question: 'How Many Bar Are in 1 MPa?',
    answer: `Exactly 1 MPa = ${BAR_PER_MPA} bar.`,
  },
  {
    question: 'How Many Atmospheres Are in 1 MPa?',
    answer: `1 MPa ≈ ${formatPressure(ATM_PER_MPA)} atm.`,
  },
  {
    question: 'Is MPa the Same as N/mm²?',
    answer:
      'Yes. 1 MPa = 1 N/mm², because 1 Pa = 1 N/m² and 1 mm² = 10⁻⁶ m², so 1 N/mm² = 10⁶ Pa = 1 MPa.',
  },
  {
    question: 'How Do I Convert 100 MPa to PSI?',
    answer: `100 × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(convertPressure(100, 'MPa', 'psi'))} psi.`,
  },
  {
    question: 'What Is the Difference Between MPa and kPa?',
    answer:
      'Both are SI pressure units. Exactly 1 MPa = 1000 kPa. MPa is more convenient for larger pressure values.',
  },
];
