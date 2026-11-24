import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STILLBIRTH_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Stillbirth Risk Calculator' },
  { id: 'what-is', label: 'What This Model Estimates' },
  { id: 'yerke', label: 'Yerke 2017 Model' },
  { id: 'predictors', label: 'Model Predictors' },
  { id: 'screenshot', label: 'Screenshot Parity Fields' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits' },
  { id: 'stillbirth-faq', label: 'Frequently Asked Questions' },
];

export const STILLBIRTH_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'Which stillbirth model does this calculator use?',
    answer:
      'The Yerke et al. 2017 US population logistic model for stillbirth from 32 weeks onward, excluding pregnancies with major fetal anomaly or aneuploidy (PLoS ONE. 2017;12(8):e0182874).',
  },
  {
    question: 'Why is there no editable 0.2197% baseline?',
    answer:
      'Some legacy tools multiplied isolated odds ratios by an adjustable population baseline. This calculator uses the published intercept and coefficients in a single calibrated logistic model — probabilities come directly from the logit, not OR × baseline.',
  },
  {
    question: 'Why are ART, SLE, and APS on the form?',
    answer:
      'Those fields mirror common intake screenshots for usability. They are not Yerke 2017 predictors in this implementation and do not change the computed probability.',
  },
  {
    question: 'Is patient data stored or shared in the URL?',
    answer:
      'No. The share action copies or shares only the public tool page URL. Entries stay in your browser session.',
  },
];