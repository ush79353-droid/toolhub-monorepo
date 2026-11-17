import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  MPA_PER_KSI,
  formatPressure,
  ksiToMPa,
  mPaToKsi,
} from './calculation';

export const KSI_TO_MPA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-conversion-works', label: 'How Does the KSI to MPa Conversion Work?' },
  { id: 'worked-examples', label: 'Convert KSI to MPa — Worked Examples' },
  { id: 'mpa-to-ksi', label: 'How to Convert MPa to KSI' },
  { id: 'conversion-table', label: 'KSI to MPa Conversion Table' },
  { id: 'where-used', label: 'Where Are KSI and MPa Used?' },
  { id: 'related-converters', label: 'Other Related Pressure Converters' },
  { id: 'ksi-to-mpa-faq', label: 'Frequently Asked Questions' },
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
  0, 0.1, 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 75, 100, 150,
] as const;

export const KSI_TO_MPA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-conversion-works',
    title: 'How Does the KSI to MPa Conversion Work?',
    paragraphs: [
      'KSI means kilopounds-force per square inch (1 ksi = 1,000 psi). MPa means megapascals (1 MPa = 1,000,000 pascals). Both measure pressure or mechanical stress.',
      `Via the international pound-force and inch, 1 psi equals the shared pascal factor used across Omega Calculators pressure tools. Therefore 1 ksi = ${formatPressure(MPA_PER_KSI)} MPa exactly under that definition.`,
      'This converter changes numerical units only. It does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
    formula: `MPa = ksi × ${formatPressure(MPA_PER_KSI)} · ksi = MPa ÷ ${formatPressure(MPA_PER_KSI)}`,
  },
  {
    id: 'worked-examples',
    title: 'Convert KSI to MPa — Worked Examples',
    paragraphs: [
      `Example 1 — convert 5 ksi: 5 × ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(ksiToMPa(5))}. Therefore 5 ksi ≈ ${formatPressure(ksiToMPa(5))} MPa.`,
      `Example 2 — convert 10 ksi: 10 × ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(ksiToMPa(10))}. Therefore 10 ksi ≈ ${formatPressure(ksiToMPa(10))} MPa.`,
      `Example 3 — convert 150 ksi: 150 × ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(ksiToMPa(150))}. Therefore 150 ksi ≈ ${formatPressure(ksiToMPa(150))} MPa.`,
    ],
  },
  {
    id: 'mpa-to-ksi',
    title: 'How to Convert MPa to KSI',
    paragraphs: [
      `Divide the megapascal value by ${formatPressure(MPA_PER_KSI)}.`,
      `Example — convert 100 MPa: 100 ÷ ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(mPaToKsi(100))}. Therefore 100 MPa ≈ ${formatPressure(mPaToKsi(100))} ksi.`,
    ],
    formula: `ksi = MPa ÷ ${formatPressure(MPA_PER_KSI)}`,
  },
  {
    id: 'conversion-table',
    title: 'KSI to MPa Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator. Displayed results are rounded for readability.',
    ],
    tableHeaders: ['ksi', 'MPa'],
    table: TABLE_KSI.map((v) => [formatPressure(v), formatPressure(ksiToMPa(v))]),
  },
  {
    id: 'where-used',
    title: 'Where Are KSI and MPa Used?',
    paragraphs: [
      'KSI and MPa appear in steel tensile strength, yield strength measurements, structural engineering, mechanical testing, material specifications, industrial equipment design, and high-pressure hydraulic systems.',
      'Material stress and fluid pressure share the same dimensions, although their engineering applications differ. US customary engineering contexts often list ksi; SI contexts often list MPa.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include MPa Conversion, kPa Converter, kPa to psi Conversion, kPa to atm Conversion, kPa to mmHg Conversion, PSI Converter, Pressure Converter, Bar to PSI Converter, MPa to PSI Converter, and PSI to MPa Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KSI_TO_MPA_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert KSI to MPa?',
    answer: `Multiply the value in ksi by ${formatPressure(MPA_PER_KSI)}. For example, 5 ksi ≈ ${formatPressure(ksiToMPa(5))} MPa.`,
  },
  {
    question: 'What Is the MPa Value of 150 KSI?',
    answer: `Multiply 150 by ${formatPressure(MPA_PER_KSI)}. 150 × ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(ksiToMPa(150))}. Therefore 150 ksi ≈ ${formatPressure(ksiToMPa(150))} MPa.`,
  },
  {
    question: 'What Is the Difference Between KSI and MPa?',
    answer:
      'KSI represents kilopounds-force per square inch, while MPa represents megapascals. Both measure pressure or mechanical stress, but they belong to different measurement systems.',
  },
  {
    question: 'How Many MPa Are in 1 KSI?',
    answer: `One ksi equals ${formatPressure(MPA_PER_KSI)} MPa.`,
  },
  {
    question: 'How Many KSI Are in 100 MPa?',
    answer: `100 MPa is approximately ${formatPressure(mPaToKsi(100))} ksi.`,
  },
  {
    question: 'Why Is KSI to MPa Conversion Important?',
    answer:
      'It allows engineers and researchers to compare material properties, pressure measurements, and engineering specifications expressed in different unit systems.',
  },
  {
    question: 'Is KSI Used for Tensile Strength?',
    answer:
      'Yes. KSI is frequently used to express tensile strength and yield strength in material specifications, particularly in US customary engineering contexts.',
  },
];
