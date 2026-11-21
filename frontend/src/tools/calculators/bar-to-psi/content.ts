import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { barToPsi, formatPressure, psiToBar } from './calculation';
import { PASCALS_PER_BAR, PASCALS_PER_PSI, PSI_PER_BAR } from './types';

export const BAR_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'pressure-units-psi-and-bar', label: 'Pressure units: PSI and bar' },
  { id: 'bar-into-psi-conversion-rate', label: 'Bar into PSI conversion rate' },
  { id: 'how-to-use-bar-to-psi', label: 'How to use this bar to PSI converter' },
  { id: 'other-pressure-converters', label: 'Other pressure converters' },
  { id: 'bar-to-psi-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  links?: readonly { href: string; label: string }[];
}

const TABLE_BAR = [0.5, 1, 2, 2.5, 3, 5, 10, 12.5, 45, 100] as const;

export const BAR_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'pressure-units-psi-and-bar',
    title: 'Pressure Units: PSI and Bar',
    paragraphs: [
      'Pressure measures force per unit area. Engineers, tire shops, pneumatic systems, hydraulic equipment, and pressure gauges often need the same reading in more than one unit.',
      `A bar is a metric-derived pressure unit equal to exactly ${PASCALS_PER_BAR.toLocaleString('en-US')} pascals. PSI (pounds per square inch) is an imperial unit based on the pound-force and the international inch; about ${formatPressure(PASCALS_PER_PSI)} Pa per psi.`,
      `Therefore 1 bar ≈ ${formatPressure(barToPsi(1))} psi, and 1 psi ≈ ${formatPressure(psiToBar(1))} bar. Tire pressures, compressor ratings, and process gauges commonly mix these systems, so accurate conversion matters.`,
    ],
    formula: `1 bar = ${PASCALS_PER_BAR.toLocaleString('en-US')} Pa · 1 bar ≈ ${formatPressure(barToPsi(1))} psi · 1 psi ≈ ${formatPressure(psiToBar(1))} bar`,
  },
  {
    id: 'bar-into-psi-conversion-rate',
    title: 'Bar into PSI Conversion Rate',
    paragraphs: [
      `Use psi = bar × ${PSI_PER_BAR}. Example: 12.5 bar × ${PSI_PER_BAR} ≈ ${formatPressure(barToPsi(12.5))} psi.`,
      `Reverse: bar = psi ÷ ${PSI_PER_BAR} (equivalently bar = psi × ${PASCALS_PER_PSI / PASCALS_PER_BAR}). Example: 232 psi ÷ ${PSI_PER_BAR} ≈ ${formatPressure(psiToBar(232))} bar.`,
      'All values in this calculator convert through pascals so forward and reverse paths stay consistent.',
    ],
    formula: `psi = bar × ${PSI_PER_BAR} · bar = psi / ${PSI_PER_BAR}`,
    tableHeaders: ['Bar', 'PSI'],
    table: TABLE_BAR.map((bar) => [formatPressure(bar), formatPressure(barToPsi(bar))]),
  },
  {
    id: 'how-to-use-bar-to-psi',
    title: 'How to Use This Bar to PSI Converter',
    paragraphs: [
      '1. Enter the pressure in bar (or change the left unit). 2. The equivalent PSI (or right-hand unit) updates automatically. 3. Enter a PSI value to calculate bar instead. 4. Change supported pressure units when needed. the physical pressure is preserved. 5. Use Reload Calculator to restore defaults (1 bar). 6. Use Clear All Changes to empty both fields. Results update without a Calculate button.',
    ],
  },
  {
    id: 'other-pressure-converters',
    title: 'Other Pressure Converters',
    paragraphs: ['Related Omega Calculators tools that already exist for pressure work:'],
    links: [
      { href: '/tools/pressure-conversion', label: 'Pressure Conversion' },
      { href: '/tools/atm-conversion', label: 'ATM Conversion' },
      { href: '/tools/bar-to-atm-conversion', label: 'Bar to ATM Conversion' },
      { href: '/tools/atm-to-pascals-conversion', label: 'ATM to Pascals Conversion' },
      { href: '/tools/barometric-pressure-conversion', label: 'Barometric Pressure Conversion' },
      { href: '/tools/lbs-to-psi-converter', label: 'Lbs to PSI Converter' },
    ],
  },
];

export const BAR_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Pressure from Bar to PSI?',
    answer: `PSI = bar × ${PSI_PER_BAR}. Example: 3 bar ≈ ${formatPressure(barToPsi(3))} psi.`,
  },
  {
    question: 'What Is 45 Bar in PSI?',
    answer: `45 × ${PSI_PER_BAR} ≈ ${formatPressure(barToPsi(45))} psi.`,
  },
  {
    question: 'How Many PSI Are in One Bar?',
    answer: `1 bar ≈ ${formatPressure(barToPsi(1))} psi.`,
  },
  {
    question: 'Is Bar the Same as PSI?',
    answer: `No. Both measure pressure, but one bar equals about ${formatPressure(barToPsi(1))} psi; roughly 14.5 times larger than one psi.`,
  },
  {
    question: 'How Do I Convert PSI Back to Bar?',
    answer: `bar = psi × ${PASCALS_PER_PSI / PASCALS_PER_BAR}. Example: 100 psi ≈ ${formatPressure(psiToBar(100))} bar.`,
  },
  {
    question: 'What Is 2.5 Bar in PSI?',
    answer: `2.5 × ${PSI_PER_BAR} ≈ ${formatPressure(barToPsi(2.5))} psi.`,
  },
];
