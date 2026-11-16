import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DBM_TO_WATTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dbm', label: 'What Is dBm?' },
  { id: 'dbm-to-watts-formula', label: 'Formula for dBm to Watts Conversion' },
  { id: 'watts-to-dbm', label: 'How to Convert Watts to dBm' },
  { id: 'conversion-examples', label: 'dBm to Watts Conversion Examples' },
  { id: 'conversion-table', label: 'dBm to Watts Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the dBm to Watts Calculator' },
  { id: 'dbm-to-watts-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DBM_TO_WATTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-dbm',
    title: 'What Is dBm?',
    paragraphs: [
      'dBm means decibel-milliwatt. It expresses absolute radio-frequency (RF) or signal power on a logarithmic scale referenced to 1 milliwatt (1 mW). Zero dBm equals exactly 1 mW.',
      'Because the scale is logarithmic, each +10 dBm multiplies linear power by 10, and each −10 dBm divides linear power by 10. That makes large dynamic ranges easier to compare in telecommunications, Wi-Fi, cellular, and other RF work.',
      'Watts and milliwatts are linear power units. dBm is not a linear unit — it is a power level relative to 1 mW. A negative dBm value still represents a positive power that is less than 1 mW.',
      'dB (decibel) alone is a relative ratio between two quantities and has no absolute reference. dBm always means “dB relative to 1 mW,” so it names an absolute power level.',
    ],
    formula: 'P(dBm) = 10 × log10(P / 1 mW)   (requires P > 0)',
  },
  {
    id: 'dbm-to-watts-formula',
    title: 'Formula for dBm to Watts Conversion',
    paragraphs: [
      'To convert power in dBm to watts, use P(W) = 10^((dBm − 30) / 10). The “−30” term accounts for the 1,000 milliwatts in one watt (10 × log10(1000) = 30).',
      'Equivalently, P(W) = 10^(dBm / 10) / 1000. Examples: 0 dBm = 0.001 W, 10 dBm = 0.01 W, 20 dBm = 0.1 W, 30 dBm = 1 W, and 40 dBm = 10 W.',
    ],
    formula: 'P(W) = 10^((dBm − 30) / 10)',
  },
  {
    id: 'watts-to-dbm',
    title: 'How to Convert Watts to dBm',
    paragraphs: [
      'To convert watts to dBm, use dBm = 10 × log10(W) + 30, or equivalently dBm = 10 × log10(W × 1000). Power must be greater than zero; zero watts has no finite dBm value.',
      'Examples: 0.001 W = 0 dBm, 0.1 W = 20 dBm, 1 W = 30 dBm, and 10 W = 40 dBm. Milliwatts convert with dBm = 10 × log10(mW).',
    ],
    formula: 'dBm = 10 × log10(W) + 30',
  },
  {
    id: 'conversion-examples',
    title: 'dBm to Watts Conversion Examples',
    paragraphs: [
      'Example 1 — 30 dBm to watts: 10^((30 − 30) / 10) = 10^0 = 1 W.',
      'Example 2 — 20 dBm to watts: 10^((20 − 30) / 10) = 10^(−1) = 0.1 W.',
      'Example 3 — 50 dBm to watts: 10^((50 − 30) / 10) = 10^2 = 100 W.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'dBm to Watts Conversion Table',
    paragraphs: ['Common dBm levels with equivalent watts and milliwatts:'],
    tableHeaders: ['dBm', 'Watts', 'Milliwatts'],
    table: [
      ['−30', '0.000001 W', '0.001 mW'],
      ['−20', '0.00001 W', '0.01 mW'],
      ['−10', '0.0001 W', '0.1 mW'],
      ['0', '0.001 W', '1 mW'],
      ['10', '0.01 W', '10 mW'],
      ['20', '0.1 W', '100 mW'],
      ['30', '1 W', '1,000 mW'],
      ['40', '10 W', '10,000 mW'],
      ['50', '100 W', '100,000 mW'],
      ['60', '1,000 W', '1,000,000 mW'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the dBm to Watts Calculator',
    paragraphs: [
      '1. Select a conversion type (dBm to watts, dBm to milliwatts, watts to dBm, or milliwatts to dBm).',
      '2. Enter the power value in the input field. Negative dBm values are allowed.',
      '3. Read the converted result in the output field — it updates as you type.',
      '4. Switch modes when needed; input and output clear so values are not reinterpreted as a different unit.',
      '5. Use Share Result to copy the answer, Reload Calculator to restore defaults, or Clear All Changes to empty the fields.',
    ],
  },
];

export const DBM_TO_WATTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert dBm to Watts?',
    answer: 'Use W = 10^((dBm − 30) / 10). For example, 30 dBm → 1 W and 20 dBm → 0.1 W.',
  },
  {
    question: 'What Is the dBm Equivalent of 1 Watt?',
    answer: '1 watt equals 30 dBm.',
  },
  {
    question: 'How Many dBm Is 5 Watts?',
    answer: 'dBm = 10 × log10(5) + 30 ≈ 36.99 dBm.',
  },
  {
    question: 'What Is 0 dBm in Watts?',
    answer: '0 dBm equals 0.001 W, or 1 mW.',
  },
  {
    question: 'What Is 20 dBm in Watts?',
    answer: '20 dBm equals 0.1 W.',
  },
  {
    question: 'What Is 30 dBm in Watts?',
    answer: '30 dBm equals 1 W.',
  },
  {
    question: 'What Is the Difference Between dB and dBm?',
    answer:
      'dB expresses a logarithmic ratio between two quantities. dBm expresses an absolute power level relative to 1 milliwatt.',
  },
  {
    question: 'Can dBm Be Negative?',
    answer:
      'Yes. Negative dBm represents a positive power level below 1 milliwatt (for example, −30 dBm = 0.000001 W).',
  },
  {
    question: 'Can Zero Watts Be Converted to dBm?',
    answer:
      'No. Zero watts has no finite dBm value. As power approaches zero from above, dBm approaches negative infinity.',
  },
];
