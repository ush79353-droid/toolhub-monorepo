import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { angstromToNm, formatLength, nmToAngstrom } from './calculation';
import { ANGSTROMS_PER_NANOMETER, NANOMETERS_PER_MIL } from './types';

export const ANGSTROM_TO_NM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-angstroms-and-nanometers', label: 'What Are Angstroms and Nanometers?' },
  { id: 'how-to-convert-nm-to-angstrom', label: 'How Do I Convert nm to Angstrom?' },
  { id: 'examples-angstrom-to-nm', label: 'Examples of Conversion of Angstrom to nm' },
  { id: 'larger-than-atoms', label: 'Larger Than Atoms: Other Length Units' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'other-length-tools', label: 'Related Length Tools' },
  { id: 'angstrom-to-nm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ANGSTROMS = [0, 1, 2, 5, 10, 14, 20, 50, 100, 250, 500, 1000, 10_000] as const;

export const ANGSTROM_TO_NM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-angstroms-and-nanometers',
    title: 'What Are Angstroms and Nanometers?',
    paragraphs: [
      'Angstroms (Å) and nanometers (nm) are units of length used for very small scales. Angstroms are common for atomic radii and crystal lattice spacings. Nanometers are common for molecules, nanotechnology, and optical wavelengths.',
      'By definition, 1 Å = 10⁻¹⁰ m and 1 nm = 10⁻⁹ m. Ten angstroms make exactly one nanometer.',
    ],
    formula: '1 Å = 0.0000000001 m · 1 nm = 0.000000001 m · 1 nm = 10 Å',
  },
  {
    id: 'how-to-convert-nm-to-angstrom',
    title: 'How Do I Convert nm to Angstrom? What Is 1 nm in Angstrom?',
    paragraphs: [
      `Exactly 1 nm = ${ANGSTROMS_PER_NANOMETER} Å. Formula: angstroms = nanometers × ${ANGSTROMS_PER_NANOMETER}.`,
      `Example: 2.5 nm × ${ANGSTROMS_PER_NANOMETER} = ${formatLength(nmToAngstrom(2.5))} Å.`,
      `Reverse: nanometers = angstroms ÷ ${ANGSTROMS_PER_NANOMETER}. Example: 14 Å ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstromToNm(14))} nm.`,
      'Both directions use a pure factor of ten, so the conversion is exact and does not rely on experimental approximations.',
    ],
    formula: `Å = nm × ${ANGSTROMS_PER_NANOMETER} · nm = Å ÷ ${ANGSTROMS_PER_NANOMETER}`,
  },
  {
    id: 'examples-angstrom-to-nm',
    title: 'Examples of Conversion of Angstrom to nm',
    paragraphs: [
      `Atomic radius example: 1.4 Å ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstromToNm(1.4))} nm.`,
      `Molecular distance example: 5.29 Å ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstromToNm(5.29))} nm.`,
      `Larger nanoscale example: 250 Å ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstromToNm(250))} nm.`,
    ],
    formula: `nm = Å ÷ ${ANGSTROMS_PER_NANOMETER}`,
    tableHeaders: ['Angstroms (Å)', 'Nanometers (nm)'],
    table: TABLE_ANGSTROMS.map((a) => [formatLength(a), formatLength(angstromToNm(a))]),
  },
  {
    id: 'larger-than-atoms',
    title: 'Larger Than Atoms: Conversion of Lengths in Other Units',
    paragraphs: [
      'As lengths grow, larger SI prefixes become more convenient than angstroms.',
      `Useful exact SI relations include 1 nm = ${ANGSTROMS_PER_NANOMETER} Å, 1 µm = 1,000 nm, 1 mm = 1,000,000 nm, and 1 m = 1,000,000,000 nm.`,
      `For imperial work, this converter also syncs thousandths of an inch (mil): 1 mil = ${NANOMETERS_PER_MIL.toLocaleString('en-US')} nm = ${(NANOMETERS_PER_MIL * ANGSTROMS_PER_NANOMETER).toLocaleString('en-US')} Å. A mil is not a millimeter.`,
      'Choose the unit that keeps numbers near a readable magnitude for your application.',
    ],
    formula: `1 mil = ${NANOMETERS_PER_MIL.toLocaleString('en-US')} nm = ${(NANOMETERS_PER_MIL * ANGSTROMS_PER_NANOMETER).toLocaleString('en-US')} Å`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Angstrom to nm Converter',
    paragraphs: [
      '1. Enter a length in angstroms. nanometers and mils update instantly.',
      '2. Or enter nanometers to calculate angstroms and mils.',
      '3. Or enter mils (thousandths of an inch) to update the metric fields.',
      '4. Change any field for another conversion; no Calculate button is required.',
      '5. Share or copy the current result when needed.',
      '6. Reload restores the default (14 Å); Clear empties all three fields.',
    ],
  },
  {
    id: 'other-length-tools',
    title: 'Related Length Tools',
    paragraphs: [
      'Depending on your dataset you may also need meters, millimeters, or mixed imperial lengths.',
      'Related Omega Calculators pages that already exist include Length Converter, Decimeter to Meter Converter, and Feet and Inches Calculator.',
    ],
  },
];

export const ANGSTROM_TO_NM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Angstroms to nm?',
    answer: `Divide angstroms by ${ANGSTROMS_PER_NANOMETER}. Example: 50 ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstromToNm(50))} nm.`,
  },
  {
    question: 'How Much Is 1 Angstrom in nm?',
    answer: `1 Å = ${formatLength(angstromToNm(1))} nm.`,
  },
  {
    question: 'How Many Angstroms Are in 1 nm?',
    answer: `1 nm = ${formatLength(nmToAngstrom(1))} Å.`,
  },
  {
    question: 'Which Is Smaller, an Angstrom or a Nanometer?',
    answer: `An angstrom is ${ANGSTROMS_PER_NANOMETER} times smaller than a nanometer.`,
  },
  {
    question: 'How Do I Convert Nanometers to Angstroms?',
    answer: `Multiply nanometers by ${ANGSTROMS_PER_NANOMETER}. Example: 3.5 × ${ANGSTROMS_PER_NANOMETER} = ${formatLength(nmToAngstrom(3.5))} Å.`,
  },
  {
    question: 'Why Are Angstroms Used in Atomic Measurements?',
    answer:
      'Atomic dimensions and interatomic distances are often conveniently expressed as a few angstroms rather than fractions of a nanometer.',
  },
  {
    question: 'Is an Angstrom an SI Unit?',
    answer:
      'No. The angstrom is a non-SI unit of length. The nanometer is a decimal submultiple of the SI meter.',
  },
];
