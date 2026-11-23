import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BREAST_CANCER_RECURRENCE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Breast Cancer Recurrence Risk' },
    { id: 'how-to', label: 'How to Use' },
    { id: 'scoring', label: 'Scoring & Risk Table' },
    { id: 'limits', label: 'Limits & Safety' },
    { id: 'bcr-faq', label: 'Frequently Asked Questions' },
  ];

export const BREAST_CANCER_RECURRENCE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational lookup of a 1994 local-recurrence index after simple mastectomy. It does not diagnose, stage, or recommend radiation or systemic therapy. Discuss pathology with a qualified clinician.',
  },
  {
    question: 'Which study does the score use?',
    answer:
      "O'Rourke et al., British Journal of Surgery 1994 (966 patients; simple mastectomy without postoperative irradiation or systemic adjuvant therapy). Factor weights: grade I/II/III = 6/12/18; nodes negative/positive = 6/12; LVI none/present = 4/8. Published totals map to local flap recurrence percentages.",
  },
  {
    question: 'Does this predict distant metastasis?',
    answer:
      'No. The endpoint is local recurrence in or deep to the mastectomy skin flaps. Distant (metastatic) risk is not estimated.',
  },
  {
    question: 'Does Share send my answers?',
    answer:
      'No. Share/copy uses only the public calculator page URL so selections stay out of share payloads, URLs, and logs.',
  },
];
