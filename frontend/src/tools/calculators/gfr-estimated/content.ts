import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GFR_ESTIMATED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GFR Calculator – Estimated Glomerular Filtration Rate' },
  { id: 'what-is-egfr', label: 'What is eGFR?' },
  { id: 'how-to-calculate', label: 'How to calculate GFR?' },
  { id: 'alarming-levels', label: 'What levels of estimated GFR are alarming?' },
  { id: 'ckd-context', label: 'How to deal with chronic kidney disease?' },
  { id: 'gfr-faq', label: 'Frequently Asked Questions' },
];

export const GFR_ESTIMATED_FAQS: readonly FAQItem[] = [
  {
    question: 'Which eGFR equation should I use?',
    answer:
      'For current adult creatinine reporting, NIDDK and NKF prefer the 2021 CKD-EPI creatinine equation (race-free). This tool still shows CKD-EPI 2009 and MDRD to match historical calculators that used a Black race coefficient. Combined creatinine–cystatin estimates are preferred when both markers are available.',
  },
  {
    question: 'Why does ethnicity appear on the form?',
    answer:
      'Only historical race-based equations (CKD-EPI 2009, MDRD, and 2012 creatinine–cystatin) use that choice. CKD-EPI 2021 race-free equations ignore ethnicity. Cystatin-only mode hides ethnicity because those equations have no race term.',
  },
  {
    question: 'Does one low eGFR mean I have CKD?',
    answer:
      'No. CKD staging needs sustained reduction (typically ≥3 months), urine findings, imaging or biopsy context, and clinical judgment. This worksheet labels eGFR bands for education only.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies a summary and the public page URL only — not your lab numbers in the URL.',
  },
];
