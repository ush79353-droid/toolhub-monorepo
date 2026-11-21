import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  MPA_PER_PSI,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PSI_PER_MPA,
  formatPressure,
  mpaToPsi,
  psiToMpa,
} from './calculation';

export const MPA_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'MPa to PSI Conversion' },
  { id: 'units', label: 'Megapascals and Pounds per Square Inch' },
  { id: 'examples', label: 'Example Calculation; MPa to PSI' },
  { id: 'how-to-use', label: 'Using the MPa to PSI Conversion Tool' },
  { id: 'conversion-table', label: 'MPa to PSI Conversion Chart' },
  { id: 'related-tools', label: 'Similar Pressure Conversion Tools' },
  { id: 'mpa-to-psi-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MPA = [0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 22, 50, 100] as const;

export const MPA_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'MPa to PSI Conversion',
    paragraphs: [
      'Convert pressure between megapascals (MPa) and pounds-force per square inch (psi). Useful for hydraulic systems, automotive applications, industrial equipment, and engineering pressure specifications.',
      'Both fields update each other instantly. The calculator converts numerical pressure units only; it does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
  },
  {
    id: 'units',
    title: 'Megapascals and Pounds per Square Inch',
    paragraphs: [
      `A megapascal is one million pascals: 1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa = 10⁶ Pa. The pascal is force per area (1 Pa = 1 N/m²).`,
      `Psi is pounds-force per square inch. Exactly 1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa from the international pound-force and inch.`,
      `Therefore 1 MPa ≈ ${formatPressure(PSI_PER_MPA)} psi, and 1 psi ≈ ${formatPressure(MPA_PER_PSI)} MPa. Pressure units are distinct from force units (N or lbf alone).`,
    ],
    formula: `1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa\n1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa\n1 MPa ≈ ${formatPressure(PSI_PER_MPA)} psi`,
  },
  {
    id: 'examples',
    title: 'Example Calculation; MPa to PSI',
    paragraphs: [
      `Convert 22 MPa to psi: psi = MPa × ${formatPressure(PSI_PER_MPA)}. 22 × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(mpaToPsi(22))} psi.`,
      `Convert 150 psi to MPa: MPa = psi × ${formatPressure(MPA_PER_PSI)}. 150 × ${formatPressure(MPA_PER_PSI)} ≈ ${formatPressure(psiToMpa(150))} MPa.`,
      'Displayed answers are rounded for readability; the calculator keeps full internal precision via pascals.',
    ],
    formula: `psi = MPa × ${formatPressure(PSI_PER_MPA)}\nMPa = psi × ${formatPressure(MPA_PER_PSI)}`,
  },
  {
    id: 'how-to-use',
    title: 'Using the MPa to PSI Conversion Tool',
    paragraphs: [
      '1. Enter a pressure value in megapascals.',
      '2. The calculator automatically displays the equivalent pressure in psi.',
      '3. Alternatively, enter a value in psi.',
      '4. The MPa field updates instantly.',
      '5. Use Reload Calculator or Clear All Changes for a new calculation.',
      '6. Share or copy the current result when needed.',
      'You can convert in either direction without switching tools. Signed gauge readings are allowed; absolute pressure cannot be negative.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'MPa to PSI Conversion Chart',
    paragraphs: [
      'Common megapascal values converted with the same engine as the calculator. Use the chart for quick reference, then refine with the interactive fields.',
    ],
    tableHeaders: ['MPa', 'psi (approx.)'],
    table: TABLE_MPA.map((v) => [formatPressure(v), formatPressure(mpaToPsi(v))]),
  },
  {
    id: 'related-tools',
    title: 'Similar Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include MPa Conversion, kPa Converter, kPa to PSI Conversion, kPa to atm Conversion, KSI to MPa Converter, Pressure Conversion, Bar to PSI Conversion, and PSI Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MPA_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Pressure from Megapascals to Pounds per Square Inch?',
    answer: `Multiply the pressure in MPa by approximately ${formatPressure(PSI_PER_MPA)}. For example, 2 MPa ≈ ${formatPressure(mpaToPsi(2))} psi.`,
  },
  {
    question: 'What Is 240 PSI in Megapascals?',
    answer: `MPa = psi × ${formatPressure(MPA_PER_PSI)}. 240 psi ≈ ${formatPressure(psiToMpa(240))} MPa.`,
  },
  {
    question: 'How Many PSI Are in 1 MPa?',
    answer: `1 MPa ≈ ${formatPressure(PSI_PER_MPA)} psi.`,
  },
  {
    question: 'How Much Is 5 MPa in PSI?',
    answer: `5 × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(mpaToPsi(5))} psi.`,
  },
  {
    question: 'Is MPa the Same as N/mm²?',
    answer:
      'Yes. 1 MPa = 1 N/mm², because 1 Pa = 1 N/m² and 1 mm² = 10⁻⁶ m², so 1 N/mm² = 10⁶ Pa = 1 MPa.',
  },
  {
    question: 'What Is the Difference Between MPa and PSI?',
    answer:
      'MPa is a metric pressure unit based on the pascal, while psi is pounds-force per square inch. Both measure pressure and convert with a fixed pascal-based factor.',
  },
];
