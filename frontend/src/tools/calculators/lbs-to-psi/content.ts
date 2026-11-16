import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatPressure, psfToPsi, psiToPsf } from './calculation';
import { SQUARE_INCHES_PER_SQUARE_FOOT } from './types';

export const LBS_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'what-is-psf', label: 'What Is PSF?' },
  { id: 'how-converter-works', label: 'How Does the Converter Work?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'applications', label: 'Applications of PSF and PSI' },
  { id: 'related-pressure', label: 'Other Related Pressure Converters' },
  { id: 'lbs-to-psi-faq', label: 'FAQs' },
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

const TABLE_PSF = [1, 10, 25, 50, 100, 144, 150, 200, 500, 1000, 1440, 5000] as const;

export const LBS_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-psi',
    title: 'What Is PSI?',
    paragraphs: [
      'PSI stands for pounds-force per square inch (lbf/in²). It is a unit of pressure — force distributed over area — not a unit of force by itself.',
      'PSI appears in tire inflation, hydraulic systems, compressed air, and many industrial specifications. Absolute and gauge readings may both be reported in psi depending on the instrument.',
    ],
    formula: '1 psi = 1 lbf/in²',
  },
  {
    id: 'what-is-psf',
    title: 'What Is PSF?',
    paragraphs: [
      'PSF stands for pounds-force per square foot (lbf/ft²). It also measures pressure (or distributed load) over area, using a larger reference area than the square inch.',
      'Engineers often use psf for floor live loads, roof loads, and wind pressure on building surfaces, where square-foot thinking is convenient.',
    ],
    formula: '1 psf = 1 lbf/ft²',
  },
  {
    id: 'how-converter-works',
    title: 'How Does the Lbs to PSI Converter Work?',
    paragraphs: [
      'This tool converts pressure expressed in pounds-force per square foot into pounds-force per square inch. Because one square foot contains exactly 144 square inches, one psi equals exactly 144 psf.',
      `Example 1: 100 psf ÷ 144 ≈ ${formatPressure(psfToPsi(100))} psi.`,
      `Example 2: 150 psf ÷ 144 ≈ ${formatPressure(psfToPsi(150))} psi.`,
      `Example 3: 10 psi × 144 = ${formatPressure(psiToPsf(10))} psf.`,
      'It does not convert bare pounds-force into psi. Force alone needs an area before pressure is defined.',
    ],
    formula: `1 ft² = ${SQUARE_INCHES_PER_SQUARE_FOOT} in² · PSI = PSF ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} · PSF = PSI × ${SQUARE_INCHES_PER_SQUARE_FOOT}`,
    tableHeaders: ['Pressure (psf)', 'Pressure (psi)'],
    table: TABLE_PSF.map((psf) => [formatPressure(psf), formatPressure(psfToPsi(psf))]),
    tableNote: 'Display values are rounded for readability; internal math uses exact ÷144.',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Lbs to PSI Converter',
    paragraphs: [
      '1. Enter the pressure in pounds-force per square foot (psf).',
      '2. Read the automatically calculated PSI value.',
      '3. Or enter PSI to calculate PSF.',
      '4. Edit either field for additional conversions — updates are instant.',
      '5. Share or copy the result when needed.',
      '6. Reload restores 144 psf = 1 psi; Clear empties both fields.',
    ],
  },
  {
    id: 'applications',
    title: 'Applications of PSF and PSI',
    paragraphs: [
      'Structural engineering and construction often quote distributed loads in psf. Hydraulics, pneumatics, and tire inflation commonly use psi.',
      'Keep total force (lbf) separate from pressure (lbf per unit area). Converting between those requires the contact or loaded area.',
    ],
  },
  {
    id: 'related-pressure',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related pressure units include the pascal (Pa), kilopascal (kPa), bar, atmosphere (atm), torr, and millimeters of mercury (mmHg).',
      'Use Omega Calculators pressure tools that already exist in the catalog — for example Pressure Conversion or Torr to atm — when you need those units. Related links appear in the page sidebar when available.',
    ],
  },
];

export const LBS_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Pounds per Square Foot into PSI?',
    answer: `Divide the pressure in psf by ${SQUARE_INCHES_PER_SQUARE_FOOT}. Example: 288 psf ÷ 144 = 2 psi.`,
  },
  {
    question: 'What Is the PSI if the Pressure Is 150 Pounds per Square Foot?',
    answer: `150 ÷ 144 ≈ ${formatPressure(psfToPsi(150))} psi (about 1.042 psi when rounded to three decimals).`,
  },
  {
    question: 'How Many PSF Are in 1 PSI?',
    answer: `Exactly ${SQUARE_INCHES_PER_SQUARE_FOOT} pounds-force per square foot.`,
  },
  {
    question: 'Why Is the Conversion from PSF to PSI Important?',
    answer:
      'Structural and mechanical work often mix square-foot and square-inch pressure units. Converting keeps calculations consistent across documents and instruments.',
  },
  {
    question: 'What Are Pounds per Square Foot and Pounds per Square Inch?',
    answer:
      'Both are pressure units: force divided by area. PSF uses a square-foot area; PSI uses a square-inch area. They differ by the exact factor 144.',
  },
  {
    question: 'Can I Convert Pounds Directly to PSI?',
    answer:
      'No. Pounds-force alone is force, not pressure. To get PSI you also need the area in square inches: PSI = lbf ÷ in².',
  },
  {
    question: 'How Do I Convert 500 Pounds of Force to PSI?',
    answer:
      'It depends on the contact area. Example: 500 lbf on 50 in² → 500 ÷ 50 = 10 psi. Without area, there is no unique PSI answer.',
  },
];
