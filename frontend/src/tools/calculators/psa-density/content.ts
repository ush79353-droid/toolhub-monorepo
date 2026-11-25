import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'PSA density = serum PSA (ng/mL) ÷ prostate volume (cc). Ellipsoid volume V = L × W × H × (π/6). Same relationship as ultrasound/MRI worksheets; not a biopsy or treatment decision.';

export const DISCLAIMER =
  'Educational PSA density worksheet only. It does not diagnose prostate cancer, recommend biopsy, or replace urology follow-up. Do not use a single density cutoff as a diagnosis.';

export const PSA_DENSITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'prostate-cancer-bph', label: 'Prostate cancer and benign prostatic hyperplasia' },
  { id: 'what-is-psa', label: 'What is PSA?' },
  { id: 'psa-density-calculator', label: 'PSA density calculator' },
  { id: 'prostate-size', label: 'Prostate size calculator' },
  { id: 'how-to-calculate', label: 'How to calculate PSA density and its meaning' },
  { id: 'psa-density-faq', label: 'FAQs' },
];

export const PSA_DENSITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is PSA density?',
    answer:
      'PSA density divides serum PSA (ng/mL) by estimated prostate volume (cc). Larger glands can carry higher PSA without the same cancer concern as a small gland. This is one adjunct to risk assessment, not a standalone diagnosis.',
  },
  {
    question: 'How is prostate volume estimated here?',
    answer:
      'Default prolate ellipsoid: volume = length × width × height × (π/6), with dimensions in centimeters. You may enter volume directly from imaging when you already have it.',
  },
  {
    question: 'What PSA density means clinically?',
    answer:
      'Literature has used various density cutoffs in screening discussions. This calculator reports the numeric ratio only — it does not label results as cancer or benign.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];