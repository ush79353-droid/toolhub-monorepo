import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  KPA_PER_MMHG,
  MMHG_PER_KPA,
  formatPressure,
  kPaToMmHg,
  mmHgToKPa,
} from './calculation';

export const KPA_TO_MMHG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-kpa-to-mmhg', label: 'Convert kPa to mmHg' },
  { id: 'conversion-examples', label: 'kPa to mmHg Conversion Examples' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'conversion-table', label: 'kPa to mmHg Conversion Table' },
  { id: 'understanding-units', label: 'Understanding kPa and mmHg' },
  { id: 'related-converters', label: 'Other Related Pressure Conversion Tools' },
  { id: 'kpa-to-mmhg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KPA = [0, 1, 2, 5, 7, 10, 20, 50, 100, 101.325, 200, 300, 500, 1000] as const;

export const KPA_TO_MMHG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-kpa-to-mmhg',
    title: 'Convert kPa to mmHg',
    paragraphs: [
      `Convert pressure from kilopascals (kPa) to millimeters of mercury (mmHg) using the conventional standard relationship 101.325 kPa = 760 mmHg. One kilopascal equals 1,000 pascals; one conventional standard millimeter of mercury equals 101,325/760 pascals.`,
      `Multiply kilopascals by ${formatPressure(MMHG_PER_KPA)} to obtain mmHg. Example — 7 kPa × ${formatPressure(MMHG_PER_KPA)} ≈ ${formatPressure(kPaToMmHg(7))}. Therefore 7 kPa ≈ ${formatPressure(kPaToMmHg(7))} mmHg.`,
      'This tool changes numerical pressure units only. It does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
    formula: `mmHg = kPa × ${formatPressure(MMHG_PER_KPA)} · kPa = mmHg × ${formatPressure(KPA_PER_MMHG)}`,
  },
  {
    id: 'conversion-examples',
    title: 'kPa to mmHg Conversion Examples',
    paragraphs: [
      `Example 1 — convert 10 kPa: 10 × ${formatPressure(MMHG_PER_KPA)} ≈ ${formatPressure(kPaToMmHg(10))}. Result: 10 kPa ≈ ${formatPressure(kPaToMmHg(10))} mmHg.`,
      `Example 2 — convert 20 kPa: 20 × ${formatPressure(MMHG_PER_KPA)} ≈ ${formatPressure(kPaToMmHg(20))}. Result: 20 kPa ≈ ${formatPressure(kPaToMmHg(20))} mmHg.`,
      `Example 3 — convert 760 mmHg: 760 × ${formatPressure(KPA_PER_MMHG)} = ${formatPressure(mmHgToKPa(760))}. Result: 760 mmHg = ${formatPressure(mmHgToKPa(760))} kPa.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This kPa to mmHg Conversion Calculator',
    paragraphs: [
      '1. Enter your pressure value into the kPa field.',
      '2. The calculator instantly displays the equivalent pressure in mmHg.',
      '3. You can also type a pressure value into the mmHg field to convert back into kPa.',
      '4. Both fields update automatically.',
      '5. Use Reload Calculator or Clear All Changes to reset the converter.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kPa to mmHg Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator. Displayed results are rounded for readability; internal math uses full JavaScript precision.',
    ],
    tableHeaders: ['kPa', 'mmHg'],
    table: TABLE_KPA.map((v) => [formatPressure(v), formatPressure(kPaToMmHg(v))]),
  },
  {
    id: 'understanding-units',
    title: 'Understanding kPa and mmHg',
    paragraphs: [
      'Kilopascal (kPa) is a multiple of the SI pressure unit pascal. Millimeter of mercury (mmHg) is a conventional pressure unit historically related to the height of a mercury column.',
      'Both appear in atmospheric pressure, laboratory measurements, vacuum systems, engineering, and medical pressure contexts. Under the conventional standard used here, 760 mmHg equals 1 atm equals 101.325 kPa.',
      'Unit conversion does not depend on whether the original reading is gauge or absolute, provided both values share the same pressure reference. Switching reference bases requires an ambient value and is not performed automatically.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include kPa Converter, kPa to atm Conversion, Pressure Converter, PSI Converter, kPa to PSI Converter, PSI to kPa Converter, Bar Converter, Bar to kPa Converter, mmHg Converter, and mmHg to kPa Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KPA_TO_MMHG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many mmHg Is 101.325 kPa?',
    answer: `One standard atmosphere is exactly 101.325 kPa and corresponds to 760 conventional mmHg. Therefore 101.325 kPa = ${formatPressure(kPaToMmHg(101.325))} mmHg.`,
  },
  {
    question: 'How Can I Convert mmHg to kPa?',
    answer: `Multiply mmHg by ${formatPressure(KPA_PER_MMHG)} (exactly 101325/760000). For example, 30 mmHg ≈ ${formatPressure(mmHgToKPa(30))} kPa.`,
  },
  {
    question: 'How Many mmHg Are in 1 kPa?',
    answer: `One kilopascal is approximately ${formatPressure(MMHG_PER_KPA)} mmHg.`,
  },
  {
    question: 'How Do I Convert 7 kPa to mmHg?',
    answer: `Multiply 7 by approximately ${formatPressure(MMHG_PER_KPA)}. 7 × ${formatPressure(MMHG_PER_KPA)} ≈ ${formatPressure(kPaToMmHg(7))}. Therefore 7 kPa ≈ ${formatPressure(kPaToMmHg(7))} mmHg.`,
  },
  {
    question: 'What Is the Difference Between kPa and mmHg?',
    answer:
      'Both units measure pressure. The kilopascal belongs to the SI-based pressure measurement system, while the millimeter of mercury is a conventional pressure unit used in several scientific and medical contexts.',
  },
  {
    question: 'Is 760 mmHg Equal to 1 atm?',
    answer:
      'Yes, under the conventional standard pressure definition used here: 760 mmHg = 101.325 kPa = 1 atm.',
  },
];
