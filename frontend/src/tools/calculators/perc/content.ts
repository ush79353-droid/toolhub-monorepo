import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PERC Calculator' },
  { id: 'criteria', label: 'Eight PERC Criteria' },
  { id: 'prerequisite', label: 'Low Pretest Probability' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'perc-faq', label: 'Frequently Asked Questions' },
];

export const PERC_FAQS: readonly FAQItem[] = [
  {
    question: 'When can PERC rule out pulmonary embolism?',
    answer:
      'Only when the clinician judges pretest PE probability low (<15%), every PERC criterion is explicitly absent, and the count of positive criteria is zero. This tool requires you to confirm both the low-risk prerequisite and that unchecked boxes mean absent, not unknown.',
  },
  {
    question: 'What does the number in the result mean?',
    answer:
      'It is the count of PERC criteria you marked present (0–8). Any positive criterion means PERC is insufficient to exclude PE. A count of 0 still does not rule out PE unless low pretest probability and full assessment are confirmed.',
  },
  {
    question: 'What are the age, heart rate, and oxygen cutoffs?',
    answer:
      'Age ≥50 years, heart rate ≥100 bpm (100 counts), and room-air oxygen saturation below 95% (95% does not count). Tick the box when the clinical finding meets the threshold.',
  },
  {
    question: 'Does this calculator order a D-dimer or CT?',
    answer:
      'No. It is an educational checklist aligned with published PERC validation — not imaging or treatment advice.',
  },
];