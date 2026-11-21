import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRIR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-trir', label: 'What is TRIR/TRIFR?' },
  { id: 'why-trir-important', label: 'Why is TRIR important?' },
  { id: 'how-to-use', label: 'How to use the TRIR calculator' },
  { id: 'recordable-incidents', label: 'List of recordable incidents' },
  { id: 'how-to-calculate', label: 'How to calculate TRIR' },
  { id: 'interpret-trir', label: 'How to interpret TRIR results' },
  { id: 'improve-safety', label: 'How to improve workplace safety' },
  { id: 'trir-vs-other', label: 'TRIR vs. other safety metrics' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'trir-faq', label: 'Frequently asked questions' },
];

export const TRIR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good TRIR?',
    answer:
      'A lower TRIR generally means fewer OSHA-recordable cases relative to hours worked. What counts as “good” depends on industry, work activities, workforce size, and reporting context; not a universal cutoff.',
  },
  {
    question: 'What is the TRIR formula?',
    answer:
      'TRIR = (Recordable Cases × 200,000) / Total Hours Worked. The 200,000 factor normalizes results to roughly 100 full-time employees working 2,000 hours each.',
  },
  {
    question: 'Why is 200,000 used in TRIR?',
    answer:
      '200,000 ≈ 100 employees × 40 hours/week × 50 weeks. It lets organizations of different sizes compare rates on a common scale.',
  },
  {
    question: 'Can TRIR be zero?',
    answer:
      'Yes. Zero means no OSHA-recordable cases were counted for the period with valid hours worked. It does not mean the workplace has no hazards or that no incidents occurred.',
  },
  {
    question: 'Can TRIR be greater than 100?',
    answer:
      'Yes. TRIR is a normalized incident rate, not a percentage, so it can exceed 100 when incident counts are very high relative to hours worked.',
  },
  {
    question: 'Are first-aid cases included in TRIR?',
    answer:
      'Generally, first-aid-only cases are not OSHA-recordable unless another recordability criterion applies. Consult OSHA’s first-aid list and current recordkeeping rules.',
  },
  {
    question: 'Are part-time employee hours included?',
    answer:
      'Yes: include applicable hours worked by part-time employees when totaling employee hours under the relevant OSHA methodology.',
  },
  {
    question: 'Should overtime hours be included?',
    answer:
      'Yes. Use actual hours worked, including overtime, for the same period as the recordable cases.',
  },
  {
    question: 'What is the difference between TRIR and DART?',
    answer:
      'TRIR covers all OSHA-recordable injury and illness cases. DART covers only cases involving days away, restricted work, or job transfer. See the DART Rate Calculator for that metric.',
  },
  {
    question: 'How often should TRIR be calculated?',
    answer:
      'Many organizations track TRIR monthly, quarterly, and annually depending on internal reporting and contractor or client requirements.',
  },
  {
    question: 'Does a low TRIR guarantee a safe workplace?',
    answer:
      'No. TRIR is a lagging indicator. Pair it with leading indicators such as inspections, hazard reporting, training, and corrective actions.',
  },
  {
    question: 'What is the difference between TRIR and TRIFR?',
    answer:
      'Terminology and formulas can vary across OSHA-based reporting and other international frameworks. Verify the methodology before comparing figures across jurisdictions.',
  },
];
