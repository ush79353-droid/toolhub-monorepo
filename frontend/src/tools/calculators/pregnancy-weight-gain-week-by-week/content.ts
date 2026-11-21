import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PWG_WEEK_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Week-by-Week Breakdown' },
  { id: 'model', label: 'Canonical Weekly Model' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'pwg-week-faq', label: 'FAQ' },
];

export const PWG_WEEK_FAQS: readonly FAQItem[] = [
  {
    question: 'What guidelines power this chart?',
    answer:
      'The same IOM / National Academies 2009 gestational weight-gain model used by the Pregnancy Weight Gain Calculator. Series are computed in kilograms, then converted for Imperial (lb) or Metric (kg) chart/table units.',
  },
  {
    question: 'Why is the chart empty?',
    answer:
      'Enter pre-pregnancy height and weight. Until both are present, the tool shows “no data to display.”',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Measurements stay in your browser. Share uses only the public page URL.',
  },
];
