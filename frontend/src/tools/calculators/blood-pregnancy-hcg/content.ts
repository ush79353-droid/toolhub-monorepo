import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLOOD_PREGNANCY_HCG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Blood Pregnancy Test & hCG' },
  { id: 'when-to-test', label: 'When to Take a Pregnancy Test' },
  { id: 'natural-vs-ivf', label: 'Natural Conception vs IVF' },
  { id: 'hcg-meaning', label: 'What hCG Results Mean' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'hcg-faq', label: 'Frequently Asked Questions' },
];

export const BLOOD_PREGNANCY_HCG_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this interpret my lab hCG number?',
    answer:
      'No. It estimates when urine or blood testing is commonly timed and explains hCG qualitatively. It does not classify numeric levels or viability.',
  },
  {
    question: 'How is ovulation estimated?',
    answer:
      'From last period plus (cycle length − 14) days. You can override ovulation day manually.',
  },
  {
    question: 'Why can blood testing be earlier than urine?',
    answer:
      'Serum assays often detect lower hCG concentrations than many home urine strips. Timing still varies by assay and individual.',
  },
  {
    question: 'What does embryo age change for IVF?',
    answer:
      'Educational beta schedules are anchored near a day-5 blastocyst calendar; earlier embryos shift suggested dates later from the transfer day.',
  },
  {
    question: 'Is my cycle data shared?',
    answer:
      'No. Share/copy uses only the public page URL so dates stay out of share payloads.',
  },
];
