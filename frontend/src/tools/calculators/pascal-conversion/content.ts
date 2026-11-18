import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertPressure,
  formatPressure,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from './calculation';

export const PASCAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pascal Conversion Calculator' },
  { id: 'units', label: 'Pascal Unit Conversion' },
  { id: 'formulas', label: 'Pascal Conversion Formulas' },
  { id: 'conversion-table', label: 'Pascal Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Pascal Conversion Calculator' },
  { id: 'common-units', label: 'Understanding Common Pressure Units' },
  { id: 'related-tools', label: 'Related Pressure Conversion Calculators' },
  { id: 'pascal-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_PA = [1, 10, 100, 1_000, 10_000, 100_000, 101_325, 1_000_000] as const;

export const PASCAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pascal Conversion Calculator',
    paragraphs: [
      'Convert pascals (Pa) into bar, standard atmospheres (atm), pounds per square inch (psi), Torr, kilopascals (kPa), megapascals (MPa), millibars (mbar), and conventional millimeters of mercury (mmHg). Useful for physics, engineering, meteorology, hydraulics, pneumatics, industrial gauges, and laboratory work.',
      'Enter any supported unit — the calculator converts through pascals and updates every field. Signed gauge or differential readings are allowed; absolute pressure cannot be physically negative, and this tool does not add or subtract atmospheric pressure automatically.',
    ],
  },
  {
    id: 'units',
    title: 'Pascal Unit Conversion',
    paragraphs: [
      'The pascal is the SI derived unit of pressure and mechanical stress: 1 Pa = 1 N/m². Larger SI multiples such as kPa and MPa keep high-pressure values readable.',
      `Common equivalents from one pascal: 1 Pa = ${formatPressure(convertPressure(1, 'Pa', 'kPa'))} kPa = ${formatPressure(convertPressure(1, 'Pa', 'MPa'))} MPa = ${formatPressure(convertPressure(1, 'Pa', 'bar'))} bar ≈ ${formatPressure(convertPressure(1, 'Pa', 'atm'))} atm ≈ ${formatPressure(convertPressure(1, 'Pa', 'psi'))} psi ≈ ${formatPressure(convertPressure(1, 'Pa', 'Torr'))} Torr.`,
      `Exactly 1 atm = ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa and 1 bar = ${PASCALS_PER_BAR.toLocaleString('en-US')} Pa. Conventional mmHg (${formatPressure(PASCALS_PER_MMHG)} Pa) is distinct from Torr (1 atm ÷ 760 ≈ ${formatPressure(PASCALS_PER_TORR)} Pa).`,
    ],
    formula: `1 Pa = 1 N/m²\n1 atm = ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa\n1 bar = ${PASCALS_PER_BAR.toLocaleString('en-US')} Pa`,
  },
  {
    id: 'formulas',
    title: 'Pascal Conversion Formulas',
    paragraphs: [
      `Pa to bar: bar = Pa ÷ ${PASCALS_PER_BAR.toLocaleString('en-US')}. Bar to Pa: Pa = bar × ${PASCALS_PER_BAR.toLocaleString('en-US')}.`,
      `Pa to atmospheres: atm = Pa ÷ ${PASCALS_PER_ATM.toLocaleString('en-US')}. Atmospheres to Pa: Pa = atm × ${PASCALS_PER_ATM.toLocaleString('en-US')}.`,
      `Pa to psi: psi = Pa ÷ ${formatPressure(PASCALS_PER_PSI)}. psi to Pa: Pa = psi × ${formatPressure(PASCALS_PER_PSI)}.`,
      `Pa to Torr: Torr = Pa × 760 ÷ ${PASCALS_PER_ATM.toLocaleString('en-US')}. Torr to Pa: Pa = Torr × ${PASCALS_PER_ATM.toLocaleString('en-US')} ÷ 760.`,
      `Pa to kPa: kPa = Pa ÷ ${PASCALS_PER_KPA.toLocaleString('en-US')}. Pa to MPa: MPa = Pa ÷ ${PASCALS_PER_MPA.toLocaleString('en-US')}.`,
      'Displayed factors may be rounded for readability; the calculator uses exact pascal-based constants internally.',
    ],
    formula: `bar = Pa / ${PASCALS_PER_BAR}\natm = Pa / ${PASCALS_PER_ATM}\npsi = Pa / ${formatPressure(PASCALS_PER_PSI)}\nTorr = Pa × 760 / ${PASCALS_PER_ATM}\nkPa = Pa / ${PASCALS_PER_KPA}\nMPa = Pa / ${PASCALS_PER_MPA}`,
  },
  {
    id: 'conversion-table',
    title: 'Pascal Conversion Table',
    paragraphs: [
      'Common pascal values converted with the same engine as the calculator (kPa, bar, and atm columns).',
    ],
    tableHeaders: ['Pascals', 'kPa', 'bar', 'atm'],
    table: TABLE_PA.map((pa) => [
      formatPressure(pa),
      formatPressure(convertPressure(pa, 'Pa', 'kPa')),
      formatPressure(convertPressure(pa, 'Pa', 'bar')),
      formatPressure(convertPressure(pa, 'Pa', 'atm')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pascal Conversion Calculator',
    paragraphs: [
      '1. Enter the pressure in pascals, or open another unit field.',
      '2. View equivalent values in bar, atm, psi, and Torr.',
      '3. Expand More pressure units for kPa, MPa, mbar, and mmHg when needed.',
      '4. Type into any unit field to reverse the conversion; every field stays linked.',
      '5. Use Reload Calculator or Clear All Changes to start over.',
      '6. Share or copy the result with the built-in actions.',
    ],
  },
  {
    id: 'common-units',
    title: 'Understanding Common Pressure Units',
    paragraphs: [
      'Pascal (Pa): SI unit equal to one newton per square meter.',
      'Kilopascal (kPa) and megapascal (MPa): convenient SI multiples for medium and high pressures.',
      'Bar and millibar (mbar): metric pressure units; 1 bar = 100,000 Pa and 1 mbar = 100 Pa.',
      'Standard atmosphere (atm): fixed reference equal to 101,325 Pa.',
      'PSI: imperial pounds-force per square inch, derived from the international pound-force and inch.',
      'Torr: defined as 1/760 of a standard atmosphere.',
      'Millimeter of mercury (mmHg): conventional CIPM definition, slightly different from Torr.',
      'Atmospheric pressure is an absolute reference. Gauge pressure is relative to ambient air; differential pressure compares two points. Gauge or differential values may be negative; absolute pressure cannot.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Pressure Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Pressure Conversion, MPa Conversion, kPa Converter, kPa to PSI Conversion, MPa to PSI Conversion, ATM Conversion, Bar to atm Conversion, and mmHg to ATM Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PASCAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is a Pascal?',
    answer:
      'A pascal is the SI unit of pressure. One pascal equals one newton of force distributed over one square meter (1 Pa = 1 N/m²).',
  },
  {
    question: 'How Do I Convert Pascals to Bar?',
    answer: `Divide the pressure in pascals by ${PASCALS_PER_BAR.toLocaleString('en-US')}. Example: ${PASCALS_PER_BAR.toLocaleString('en-US')} Pa = 1 bar.`,
  },
  {
    question: 'How Many Pascals Are in One Atmosphere?',
    answer: `One standard atmosphere equals exactly ${PASCALS_PER_ATM.toLocaleString('en-US')} pascals.`,
  },
  {
    question: 'Can I Convert Pascals to Torr?',
    answer: `Yes. Multiply pascals by 760 and divide by ${PASCALS_PER_ATM.toLocaleString('en-US')}. Example: ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa = 760 Torr.`,
  },
  {
    question: 'How Many Pascals Are in One PSI?',
    answer: `One psi is approximately ${formatPressure(PASCALS_PER_PSI)} pascals (from the international pound-force and inch).`,
  },
  {
    question: 'How Many Kilopascals Are 41 Pascals?',
    answer: `41 Pa equals ${formatPressure(convertPressure(41, 'Pa', 'kPa'))} kPa.`,
  },
  {
    question: 'Is Pascal an SI Unit?',
    answer:
      'Yes. Pascal is the SI derived unit for pressure and stress.',
  },
  {
    question: 'Can Pressure Be Negative?',
    answer:
      'Gauge or differential pressure can be negative relative to a reference pressure, but absolute pressure cannot be physically negative.',
  },
];
