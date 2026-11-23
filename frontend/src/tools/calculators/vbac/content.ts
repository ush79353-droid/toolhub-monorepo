import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VBAC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'VBAC Calculator' },
  { id: 'what-is', label: 'What This Model Estimates' },
  { id: 'race-neutral', label: 'Race-Neutral Update' },
  { id: 'predictors', label: 'Model Predictors' },
  { id: 'formula', label: 'Logistic Formula' },
  { id: 'departure', label: 'Legacy Screenshot Differences' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Eligibility and Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'vbac-faq', label: 'Frequently Asked Questions' },
];

export const VBAC_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Grobman model does this calculator use?',
    answer:
      'The 2021 MFMU Network early-pregnancy logistic model without race or ethnicity (Grobman et al., Am J Obstet Gynecol. 2022;227(4):626.e1-626.e12; doi: 10.1016/j.ajog.2021.05.021). It uses variables ascertainable at an initial prenatal visit — not the separate 2024 admission-time model.',
  },
  {
    question: 'Why is ethnicity not included?',
    answer:
      'The validated race-neutral update deliberately removes socially constructed race/ethnicity variables. Legacy consumer calculators that asked for African American / Hispanic / White are outdated relative to current MFMU guidance.',
  },
  {
    question: 'Why pre-pregnancy weight and height instead of BMI?',
    answer:
      'The published regression includes pre-pregnancy weight (per kg) and height (per cm) as separate predictors. BMI alone is not a coefficient in this version.',
  },
  {
    question: 'What is the Grobman VBAC score?',
    answer:
      'This 2021 model outputs a predicted probability of successful VBAC (%). The linear predictor (log-odds w) is shown for transparency; there is no separate integer point score and no probability cutoff restricts viewing the estimate.',
  },
  {
    question: 'Is patient data stored or shared in the URL?',
    answer:
      'No. Reproductive history and measurements stay in your browser session. Copy and share actions use the public calculator page URL only.',
  },
  {
    question: 'When does a result appear?',
    answer:
      'After you enter valid age, height, and pre-pregnancy weight. Obstetric history radios have defaults (no arrest indication, no prior vaginal birth, no treated chronic hypertension) matching a blank counseling form.',
  },
];