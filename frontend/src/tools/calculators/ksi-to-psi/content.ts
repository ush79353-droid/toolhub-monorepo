import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  PSI_PER_KSI,
  formatPressure,
  ksiToPsi,
  psiToKsi,
} from './calculation';

export const KSI_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-ksi-to-psi', label: 'How to Convert KSI to PSI' },
  { id: 'convert-psi-to-ksi', label: 'How to Convert PSI to KSI' },
  { id: 'examples', label: 'KSI to PSI Conversion Examples' },
  { id: 'conversion-table', label: 'KSI to PSI Conversion Table' },
  { id: 'difference', label: 'What Is the Difference Between KSI and PSI?' },
  { id: 'where-used', label: 'Where Are KSI and PSI Used?' },
  { id: 'related-converters', label: 'Other Related Pressure Converters' },
  { id: 'ksi-to-psi-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KSI = [
  0, 0.01, 0.1, 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 75, 100, 150, 200,
] as const;

export const KSI_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-ksi-to-psi',
    title: 'How to Convert KSI to PSI',
    paragraphs: [
      'KSI and PSI use the same area denominator (square inch) but different force magnitudes. One kilopound-force equals 1,000 pounds-force, so the conversion factor is exactly 1,000.',
      `Example; convert 5 ksi: 5 × ${PSI_PER_KSI} = ${formatPressure(ksiToPsi(5))}. Therefore 5 ksi = ${formatPressure(ksiToPsi(5))} psi.`,
      'This tool changes numerical units only. It does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
    formula: `psi = ksi × ${PSI_PER_KSI}`,
  },
  {
    id: 'convert-psi-to-ksi',
    title: 'How to Convert PSI to KSI',
    paragraphs: [
      `Divide the psi value by ${PSI_PER_KSI}.`,
      `Example; convert 25,000 psi: 25,000 ÷ ${PSI_PER_KSI} = ${formatPressure(psiToKsi(25_000))}. Therefore 25,000 psi = ${formatPressure(psiToKsi(25_000))} ksi.`,
    ],
    formula: `ksi = psi ÷ ${PSI_PER_KSI}`,
  },
  {
    id: 'examples',
    title: 'KSI to PSI Conversion Examples',
    paragraphs: [
      `Example 1: 3 ksi = ${formatPressure(ksiToPsi(3))} psi.`,
      `Example 2: 10 ksi = ${formatPressure(ksiToPsi(10))} psi.`,
      `Example 3: 50 ksi = ${formatPressure(ksiToPsi(50))} psi.`,
      `Example 4: 150 ksi = ${formatPressure(ksiToPsi(150))} psi.`,
      `Example 5: 0.75 ksi = ${formatPressure(ksiToPsi(0.75))} psi.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'KSI to PSI Conversion Table',
    paragraphs: [
      `Values generated with the same conversion engine as the calculator. The factor of ${PSI_PER_KSI} is exact; no approximation is required.`,
    ],
    tableHeaders: ['ksi', 'psi'],
    table: TABLE_KSI.map((v) => [formatPressure(v), formatPressure(ksiToPsi(v))]),
  },
  {
    id: 'difference',
    title: 'What Is the Difference Between KSI and PSI?',
    paragraphs: [
      'PSI measures pounds-force per square inch. KSI measures thousands of pounds-force per square inch. Both can describe pressure and mechanical stress.',
      'KSI is convenient for high stress values. PSI is frequently used in pressure systems and everyday engineering contexts.',
    ],
  },
  {
    id: 'where-used',
    title: 'Where Are KSI and PSI Used?',
    paragraphs: [
      'Applications include tensile strength testing, yield strength specifications, structural steel design, mechanical engineering, manufacturing, hydraulic systems, industrial pressure equipment, and aerospace engineering.',
      'KSI is particularly common in material stress specifications expressed in US customary units.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include PSI Converter, KSI to MPa Converter, kPa to PSI Conversion, kPa Converter, Pressure Converter, PSI to Bar Converter, Bar to PSI Converter, PSI to MPa Converter, PSI to ATM Conversion, and PSI to KSI Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KSI_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert KSI to PSI?',
    answer: `Multiply the pressure value in ksi by ${PSI_PER_KSI}. For example, 5 × ${PSI_PER_KSI} = ${formatPressure(ksiToPsi(5))} psi.`,
  },
  {
    question: 'What Is the PSI Value of 150 KSI?',
    answer: `150 × ${PSI_PER_KSI} = ${formatPressure(ksiToPsi(150))}. Therefore 150 ksi = ${formatPressure(ksiToPsi(150))} psi.`,
  },
  {
    question: 'How Many PSI Are in 1 KSI?',
    answer: `There are exactly ${PSI_PER_KSI} psi in 1 ksi.`,
  },
  {
    question: 'How Many KSI Are in 10,000 PSI?',
    answer: `Divide the psi value by ${PSI_PER_KSI}. 10,000 ÷ ${PSI_PER_KSI} = ${formatPressure(psiToKsi(10_000))}. Therefore 10,000 psi = ${formatPressure(psiToKsi(10_000))} ksi.`,
  },
  {
    question: 'Why Is KSI to PSI Conversion Important?',
    answer:
      'The conversion allows engineers to compare pressure and stress measurements expressed at different scales. It is particularly useful in structural engineering, material specifications, and industrial testing.',
  },
  {
    question: 'Which Industries Commonly Use KSI and PSI?',
    answer:
      'Both units are used in mechanical engineering, construction, automotive engineering, aerospace engineering, manufacturing, and material testing.',
  },
  {
    question: 'Is KSI the Same as 1,000 PSI?',
    answer: `Yes. One ksi is exactly equal to ${PSI_PER_KSI} psi.`,
  },
];
