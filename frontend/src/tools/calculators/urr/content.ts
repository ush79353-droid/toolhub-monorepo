import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const URR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What does URR stand for, and how to use it?' },
  { id: 'formula', label: 'How to calculate URR in dialysis?' },
  { id: 'urr-vs-ktv', label: 'URR versus Kt/V' },
  { id: 'urr-faq', label: 'FAQs' },
];

export const URR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is URR?',
    answer:
      'Urea reduction ratio (URR) is the percent drop in blood urea from before to after a hemodialysis session: 100 × (pre − post) / pre.',
  },
  {
    question: 'Which units can I enter?',
    answer:
      'mg/dL or mmol/L urea. Both samples must measure the same analyte; the calculator converts to mg/dL urea before dividing (mmol/L × 6.006).',
  },
  {
    question: 'Is URR the same as Kt/V?',
    answer:
      'No. URR is a simple percentage reduction. Kt/V models dialysis dose with volume and timing assumptions. Use the linked Kt/V (Daugirdas) calculator when you need that estimate.',
  },
  {
    question: 'What does URR ≥65% mean?',
    answer:
      'Historical thrice-weekly hemodialysis teaching often cites URR ≥65% as an adequacy target (KDOQI-style). It is educational only and does not replace clinical Kt/V or individualized care.',
  },
  {
    question: 'Are urea values stored?',
    answer:
      'No. Values stay in your browser; share uses the public page URL only — never the entered labs.',
  },
];
