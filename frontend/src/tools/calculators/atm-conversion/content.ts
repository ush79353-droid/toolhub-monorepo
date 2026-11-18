import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertPressure, formatPressure } from './calculation';
import { PA_PER_ATM, PA_PER_BAR, PA_PER_PSI } from './types';

export const ATM_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-atm-conversion', label: 'What Is ATM Conversion?' },
  { id: 'how-atm-conversion-works', label: 'How Does ATM Conversion Work?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'other-pressure-tools', label: 'Other Related Pressure Calculators' },
  { id: 'atm-conversion-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const ATM_TABLE = [1, 2, 5] as const;

export const ATM_CONVERSION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-atm-conversion',
    title: 'What Is ATM Conversion? Atmospheric Pressure Converter',
    paragraphs: [
      'Atmospheric pressure is the force from the weight of air per unit area. The standard atmosphere (atm) is a defined reference pressure used in science and engineering — not the instantaneous outdoor pressure at every location.',
      `By definition, 1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa exactly, which equals ${formatPressure(convertPressure(1, 'atm', 'bar'))} bar and about ${formatPressure(convertPressure(1, 'atm', 'psi'))} psi.`,
      'Bar is a convenient near-atmosphere metric unit (1 bar = 100,000 Pa). Pascals are the SI unit. PSI (pound-force per square inch) is common in US customary engineering.',
      'Converting among these units helps compare weather maps, aircraft altimetry references, tank ratings, and laboratory instruments that report different symbols.',
    ],
    formula: `1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa = ${formatPressure(convertPressure(1, 'atm', 'bar'))} bar ≈ ${formatPressure(convertPressure(1, 'atm', 'psi'))} psi`,
  },
  {
    id: 'how-atm-conversion-works',
    title: 'How Does ATM Conversion Work?',
    paragraphs: [
      'All of these units measure force per unit area. This calculator converts through pascals:',
      'Target = Source × (source factor in Pa) ÷ (target factor in Pa).',
      `ATM to bar: bar = atm × ${formatPressure(PA_PER_ATM / PA_PER_BAR)}. Bar to ATM: atm = bar ÷ ${formatPressure(PA_PER_ATM / PA_PER_BAR)}.`,
      `ATM to Pa: Pa = atm × ${PA_PER_ATM.toLocaleString('en-US')}. Pa to ATM: atm = Pa ÷ ${PA_PER_ATM.toLocaleString('en-US')}.`,
      `ATM to PSI: psi = atm × (${PA_PER_ATM} / ${PA_PER_PSI}). PSI to ATM: atm = psi × (${PA_PER_PSI} / ${PA_PER_ATM}).`,
      `Example: 2 atm = ${formatPressure(convertPressure(2, 'atm', 'Pa'))} Pa = ${formatPressure(convertPressure(2, 'atm', 'bar'))} bar ≈ ${formatPressure(convertPressure(2, 'atm', 'psi'))} psi.`,
    ],
    formula: 'P_target = P_source × f_source / f_target  (factors in Pa)',
    tableHeaders: ['atm', 'bar', 'psi', 'Pa'],
    table: ATM_TABLE.map((atm) => [
      formatPressure(atm),
      formatPressure(convertPressure(atm, 'atm', 'bar')),
      formatPressure(convertPressure(atm, 'atm', 'psi')),
      formatPressure(convertPressure(atm, 'atm', 'Pa')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the ATM Conversion Calculator',
    paragraphs: [
      '1. Open the ATM Conversion Calculator.',
      '2. Enter a pressure in atmospheres, or open Other units and edit bar, psi, or Pa.',
      '3. Read the automatically calculated equivalents.',
      '4. Change any field to convert in another direction.',
      '5. Reload restores 1 atm; Clear empties all fields.',
      'Results update instantly — you do not need to look up conversion factors.',
    ],
  },
  {
    id: 'other-pressure-tools',
    title: 'Other Related Pressure Calculators',
    paragraphs: [
      'Related Omega Calculators pages that already exist include Pressure Conversion, Torr to ATM Conversion, and Lbs to PSI Converter.',
    ],
  },
];

export const ATM_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the ATM If the Pressure Is 200,000 Pa?',
    answer: `atm = Pa ÷ ${PA_PER_ATM.toLocaleString('en-US')} = 200,000 ÷ ${PA_PER_ATM.toLocaleString('en-US')} ≈ ${formatPressure(convertPressure(200_000, 'Pa', 'atm'))} atm.`,
  },
  {
    question: 'How Do I Convert PSI to ATM?',
    answer: `atm = psi × (${PA_PER_PSI} / ${PA_PER_ATM}). Example: 30 psi ≈ ${formatPressure(convertPressure(30, 'psi', 'atm'))} atm.`,
  },
  {
    question: 'Is the Conversion from ATM to Other Units Linear?',
    answer:
      'Yes. Between consistent absolute pressure units the conversion is a constant multiplicative factor. Keep gauge and absolute references consistent — do not mix them without stating the reference.',
  },
  {
    question: 'Does Elevation Affect ATM Conversion?',
    answer:
      'Elevation changes the actual outdoor air pressure, but it does not change the defined relationship between the standard atmosphere and Pa, bar, or psi.',
  },
  {
    question: 'How Many PSI Are in One ATM?',
    answer: `1 atm ≈ ${formatPressure(convertPressure(1, 'atm', 'psi'))} psi.`,
  },
  {
    question: 'What Is the Difference Between ATM and Bar?',
    answer: `1 atm = ${formatPressure(convertPressure(1, 'atm', 'bar'))} bar exactly from the Pa definitions, and 1 bar ≈ ${formatPressure(convertPressure(1, 'bar', 'atm'))} atm.`,
  },
  {
    question: 'Can Atmospheric Pressure Be Negative?',
    answer:
      'Absolute pressure is not negative in ordinary usage. Gauge pressure can be negative relative to a reference (for example vacuum below ambient). This calculator flags negative inputs as gauge-relative rather than absolute.',
  },
];
