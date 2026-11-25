import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Real ratio: Tiffeneau index = 100 × FEV1/FVC. Predicted ratio (American): Hankinson et al. NHANES III FEV1/FVC% equations (Am J Respir Crit Care Med 1999;159:179–187). Predicted ratio (European): Falaschetti et al. Health Survey for England multiplicative ln(FEV1/FVC) equations (Eur Respir J 2004;23:456–463).';

export const DISCLAIMER =
  'Educational spirometry worksheet only. Not a diagnosis of obstruction, COPD staging, or a substitute for supervised spirometry and clinical interpretation.';

export const FEV1_FVC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'FEV1/FVC Ratio Calculator' },
  { id: 'ratio-explained', label: 'FEV1/FVC Ratio Explained' },
  { id: 'normal-values', label: 'Normal Values' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'copd', label: 'Values in COPD' },
  { id: 'predicted', label: 'Predicted Values' },
  { id: 'fev1-fvc-faq', label: 'Frequently Asked Questions' },
];

export const FEV1_FVC_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the real-ratio mode compute?',
    answer:
      'The measured Tiffeneau index as a percentage: 100 × FEV1 / FVC using matching volume units. Example: 3 L / 4 L → 75%.',
  },
  {
    question: 'Is the predicted ratio the same as percent of predicted?',
    answer:
      'No. Prediction mode returns the population predicted FEV1/FVC ratio (%) from published equations. It does not divide a measured ratio by that prediction to form “percent of predicted.”',
  },
  {
    question: 'Which prediction cohorts are used?',
    answer:
      'American (Hankinson/NHANES III, 1999): sex, age, and ethnicity. European (Falaschetti/HSE, 2004): sex, age, and height for White English adults.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
