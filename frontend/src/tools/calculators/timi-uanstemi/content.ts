import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIMI_UANSTEMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'TIMI Score for UA/NSTEMI' },
  { id: 'factors', label: 'Seven TIMI Factors' },
  { id: 'event-rates', label: '14-Day Event Rates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'timi-uanstemi-faq', label: 'Frequently Asked Questions' },
];

export const TIMI_UANSTEMI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the TIMI risk score for UA/NSTEMI?',
    answer:
      'It is a 0–7 point educational score from Antman et al. (JAMA 2000) that sums seven binary predictors at presentation with unstable angina or NSTEMI. Higher totals tracked higher 14-day rates of death, new or recurrent MI, or severe recurrent ischemia requiring urgent revascularization in the TIMI 11B derivation cohort.',
  },
  {
    question: 'What counts as ST / EKG deviation?',
    answer:
      'The published TIMI UA/NSTEMI criterion is ST-segment deviation on the presenting ECG of at least 0.5 mm (0.05 mV). Mark Yes only when that finding is present on the index tracing.',
  },
  {
    question: 'Which CAD risk factors count toward “≥3”?',
    answer:
      'Family history of CAD, hypertension, hypercholesterolemia, diabetes, and current smoking. Award the point only when three or more of these are present.',
  },
  {
    question: 'Why does a score of 0 show about 5% risk?',
    answer:
      'In TIMI 11B, scores 0 and 1 were pooled at a published composite rate of 4.7%. This calculator’s default capture rounds that 0–1 band to 5% for display, matching the reference screenshot while documenting the source table.',
  },
  {
    question: 'Is patient data stored or shared?',
    answer:
      'No. Answers stay in your browser. Share and copy actions use the public page URL only — clinical selections are excluded from the payload.',
  },
];
