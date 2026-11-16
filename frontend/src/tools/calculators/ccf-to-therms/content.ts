import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CCF_TO_THERMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-ccf-therms', label: 'What Are CCF and Therms?' },
  { id: 'how-to-use', label: 'How to Use the CCF to Therms Calculator' },
  { id: 'formula', label: 'CCF to Therms Formula' },
  { id: 'ccf-to-therms', label: 'How to Convert CCF to Therms' },
  { id: 'therms-to-ccf', label: 'How to Convert Therms to CCF' },
  { id: 'significance', label: 'Significance of CCF and Therms Conversion' },
  { id: 'why-factor-varies', label: 'Why Does the CCF to Therms Conversion Factor Vary?' },
  { id: 'conversion-table', label: 'CCF to Therms Conversion Table' },
  { id: 'bill-example', label: 'Practical Example: Understanding a Natural Gas Bill' },
  { id: 'ccf-to-therms-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CCF_TO_THERMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-ccf-therms',
    title: 'What Are CCF and Therms?',
    paragraphs: [
      'CCF and therms describe different aspects of natural gas use. CCF is a volume measure; therms are an energy measure. Utilities often meter volume but bill for energy so customers pay for heat content rather than cubic feet alone.',
      'CCF means one hundred cubic feet: 1 CCF = 100 ft³. A therm is defined as 100,000 BTU of energy. Because natural gas composition varies, the energy in one CCF is not fixed worldwide.',
    ],
    formula: '1 CCF = 100 ft³ · 1 therm = 100,000 BTU',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the CCF to Therms Calculator',
    paragraphs: [
      '1. Enter gas consumption in CCF.',
      '2. Review the calculated therms.',
      '3. Open Custom Conversion Factor if your utility uses a different therm factor.',
      '4. Enter therms per CCF, or enter heating value in BTU/ft³ (they stay synchronized).',
      '5. Review the updated conversion.',
      '6. Or enter therms to solve for CCF.',
      '7. Share or copy the result; use Reload or Clear to reset.',
      'Example: 100 CCF at the illustrative factor 1.038 → 103.8 therms.',
    ],
  },
  {
    id: 'formula',
    title: 'CCF to Therms Formula',
    paragraphs: [
      'Therms equal CCF multiplied by a conversion factor (therms per CCF). That factor can be derived from heating value: factor = (BTU/ft³) ÷ 1000, because 1 CCF = 100 ft³ and 1 therm = 100,000 BTU.',
      'Example: heating value 1038 BTU/ft³ → factor 1.038. Then 100 CCF × 1.038 = 103.8 therms. This heating value is an illustrative default in the calculator, not a guaranteed billing rate.',
    ],
    formula: 'Therms = CCF × Factor · Factor = (BTU/ft³) / 1000',
  },
  {
    id: 'ccf-to-therms',
    title: 'How to Convert CCF to Therms',
    paragraphs: [
      'Multiply CCF by the applicable therms-per-CCF factor. Example 1: 25 × 1.038 = 25.95 therms. Example 2: 75 × 1.05 = 78.75 therms when heating value is 1050 BTU/ft³. Results change whenever the heating value changes.',
    ],
  },
  {
    id: 'therms-to-ccf',
    title: 'How to Convert Therms to CCF',
    paragraphs: [
      'Divide therms by the same conversion factor: CCF = Therms ÷ Factor. Example: 207.6 ÷ 1.038 = 200 CCF.',
    ],
    formula: 'CCF = Therms / Factor',
  },
  {
    id: 'significance',
    title: 'Significance of CCF and Therms Conversion',
    paragraphs: [
      'Converting between volume and energy helps interpret residential and commercial gas bills, compare heating periods, support energy audits, and estimate efficiency. Volume-to-energy conversion depends on heating value and measurement conditions. Do not assume every utility uses the same factor.',
    ],
  },
  {
    id: 'why-factor-varies',
    title: 'Why Does the CCF to Therms Conversion Factor Vary?',
    paragraphs: [
      'Natural gas composition, regional supply, pressure and temperature reference conditions, and utility billing practices all affect energy content. Prefer the therm factor or heating value printed on your own utility statement for billing-related work.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'CCF to Therms Conversion Table',
    paragraphs: [
      'The table below uses the illustrative conversion factor of 1.038 therms/CCF (1038 BTU/ft³). Your utility’s factor may differ.',
    ],
    tableHeaders: ['CCF', 'Therms'],
    table: [
      ['1', '1.038'],
      ['5', '5.19'],
      ['10', '10.38'],
      ['25', '25.95'],
      ['50', '51.9'],
      ['75', '77.85'],
      ['100', '103.8'],
      ['150', '155.7'],
      ['200', '207.6'],
      ['250', '259.5'],
      ['500', '519'],
      ['1,000', '1,038'],
    ],
  },
  {
    id: 'bill-example',
    title: 'Practical Example: Understanding a Natural Gas Bill',
    paragraphs: [
      'Suppose metered use is 120 CCF and the bill lists a heating value of 1038 BTU/ft³ (factor 1.038). Therms = 120 × 1.038 = 124.56. A utility may also apply other billing adjustments or a different energy-content value, so treat calculator output as a transparent energy estimate, not a final invoice.',
    ],
    formula: '120 CCF × 1.038 = 124.56 therms',
  },
];

export const CCF_TO_THERMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Therms Are in 75 CCF?',
    answer:
      'Using the illustrative conversion factor of 1.038: 75 × 1.038 = 77.85 therms. Use your utility factor for billing.',
  },
  {
    question: 'Can I Convert 100 CCF to Therms?',
    answer: 'Yes. With factor 1.038: 100 × 1.038 = 103.8 therms.',
  },
  {
    question: 'Is 90 Therms Equal to 200 CCF?',
    answer:
      'No. With factor 1.038: 90 ÷ 1.038 ≈ 86.71 CCF, so 90 therms is about 86.71 CCF under that assumption.',
  },
  {
    question: 'How Do I Convert CCF to Therms?',
    answer: 'Multiply CCF by the applicable therms-per-CCF conversion factor.',
  },
  {
    question: 'What Is the Difference Between CCF and Therms?',
    answer: 'CCF measures natural gas volume. Therms measure energy content.',
  },
  {
    question: 'How Many BTU Are in One Therm?',
    answer: 'One therm equals 100,000 BTU.',
  },
  {
    question: 'Is One CCF Always Equal to 1.038 Therms?',
    answer:
      'No. The conversion depends on the gas heating value and billing conventions. 1.038 is only an illustrative default.',
  },
  {
    question: "How Can I Find My Utility's Conversion Factor?",
    answer:
      'Check the natural gas bill for a therm factor, heating value, or energy-content adjustment. Contact the utility if it is unclear.',
  },
  {
    question: 'Can I Convert Therms Back to CCF?',
    answer: 'Yes. Divide therms by the therms-per-CCF conversion factor.',
  },
  {
    question: 'Why Do Natural Gas Bills Use Therms?',
    answer:
      'Therms represent energy content, so utilities can account for differences in the heating value of supplied gas.',
  },
];
