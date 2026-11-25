import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Hankinson JL et al. Spirometric reference values from NHANES III. Am J Respir Crit Care Med. 1999;159:179–187 (Caucasian / African-American / Mexican-American PEF L/s). Nunn AJ, Gregg I. BMJ. 1989;298:1068–1070 (Other ethnicity, PEF L/min). Diurnal variability = (max−min)/((max+min)/2)×100.';

export const DISCLAIMER =
  'Educational peak-flow worksheet only. Not a diagnosis, asthma action-plan order, or substitute for clinician-interpreted spirometry or personal best guidance.';

export const PEAK_FLOW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Peak Flow Calculator' },
  { id: 'prediction', label: 'Predicted PEF equations' },
  { id: 'ratios', label: 'Ratios and variability' },
  { id: 'limits', label: 'Limits' },
  { id: 'peak-flow-faq', label: 'Frequently Asked Questions' },
];

export const PEAK_FLOW_FAQS: readonly FAQItem[] = [
  {
    question: 'Which prediction equation is used?',
    answer:
      'NHANES III / Hankinson 1999 PEF (L/s) for Caucasian, African-American, and Mexican-American groups (ages 8–80). “Other” uses Nunn & Gregg 1989 adult equations (PEF in L/min, ages 15–85), converted to L/s for display.',
  },
  {
    question: 'How is diurnal variability calculated?',
    answer:
      'Amplitude percent mean: (PEFmax − PEFmin) ÷ ((PEFmax + PEFmin) / 2) × 100. When max equals min, variability is 0%.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only — no PEF values in the link.',
  },
];
