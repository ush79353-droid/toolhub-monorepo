import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QTC_SOURCE_NOTE =
  'Bazett QTc = QT/√RR (RR in seconds). Also Fridericia QT/∛RR; Framingham QT+0.154×(1−RR); Hodges QT+1.75×(HR−60). Bazett 1920; Fridericia 1920; Sagie 1992; Hodges 1983.';

export const QTC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'QTc Calculator' },
  { id: 'formula', label: 'Bazett Formula' },
  { id: 'other-methods', label: 'Other Correction Methods' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'qtc-faq', label: 'Frequently Asked Questions' },
];

export const QTC_FAQS: readonly FAQItem[] = [
  {
    question: 'How does Bazett QTc work?',
    answer:
      'With QT in milliseconds and RR in seconds, Bazett QTc = QT ÷ √RR. RR can come from a measured interval or from heart rate via RR (s) = 60 ÷ bpm.',
  },
  {
    question: 'Why are heart rate and RR linked?',
    answer:
      'For a regular rhythm, RR and heart rate describe the same cycle length. Editing either field updates the other so the correction uses a consistent rate.',
  },
  {
    question: 'Which other formulas appear in the panel?',
    answer:
      'Fridericia (cube-root), Framingham/Sagie (linear), and Hodges (rate-linear). They are educational comparisons — this page does not choose a clinical cut-off.',
  },
  {
    question: 'Is an isolated QTc a diagnosis?',
    answer:
      'No. Bazett is rate-sensitive, measurement technique matters, and clinical decisions need context. This tool is educational only.',
  },
  {
    question: 'Are my ECG values stored?',
    answer:
      'No. Entries stay in your browser. Share and copy use the public page URL only.',
  },
];
