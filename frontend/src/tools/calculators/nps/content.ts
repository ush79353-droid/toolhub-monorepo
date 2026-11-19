import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-nps', label: 'What is Net Promoter Score (NPS)?' },
  { id: 'nps-formula', label: 'What is the Net Promoter Score formula?' },
  { id: 'promoters-passives-detractors', label: 'Who are promoters, passives, and detractors?' },
  { id: 'interpret-nps', label: 'How to interpret NPS results' },
  { id: 'worked-example', label: 'How to calculate NPS with an example' },
  { id: 'nps-vs-csat', label: 'NPS vs. Customer Satisfaction Score (CSAT)' },
  { id: 'nps-vs-ces', label: 'NPS vs. Customer Effort Score (CES)' },
  { id: 'benefits-limitations', label: 'Benefits and limitations of NPS' },
  { id: 'improve-nps', label: 'How businesses can improve their NPS' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'nps-faq', label: 'Frequently asked questions' },
];

export const NPS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good Net Promoter Score?',
    answer:
      'A positive NPS means promoters outnumber detractors as a share of respondents. What counts as “good” depends on industry benchmarks, customer populations, survey methods, and business context. Avoid treating any single threshold as universal.',
  },
  {
    question: 'Can NPS be negative?',
    answer:
      'Yes. An NPS below zero means the percentage of detractors exceeds the percentage of promoters. Example: NPS = −30 means detractors exceed promoters by 30 percentage points.',
  },
  {
    question: 'What is the maximum NPS score?',
    answer:
      'The maximum possible NPS is +100. That occurs when every respondent is a promoter (scores 9–10) and there are no passives or detractors.',
  },
  {
    question: 'What is the minimum NPS score?',
    answer:
      'The minimum possible NPS is −100. That occurs when every respondent is a detractor (scores 0–6).',
  },
  {
    question: 'Are passives included in NPS calculations?',
    answer:
      'Yes. Passives are included in the total number of survey responses used as the denominator. They do not appear in the numerator of (Promoters − Detractors).',
  },
  {
    question: 'How are promoters calculated?',
    answer:
      'Promoters are respondents who select scores of 9 or 10. Promoters = Score 9 responses + Score 10 responses.',
  },
  {
    question: 'How are detractors calculated?',
    answer:
      'Detractors are respondents who select scores between 0 and 6 inclusive.',
  },
  {
    question: 'How are passives calculated?',
    answer:
      'Passives are respondents who select scores of 7 or 8. Passives = Score 7 responses + Score 8 responses.',
  },
  {
    question: 'Can NPS be greater than 100?',
    answer:
      'No. Under the standard NPS formula, the result must remain between −100 and +100.',
  },
  {
    question: 'Is NPS the same as average customer rating?',
    answer:
      'No. NPS is the difference between promoter and detractor percentages. An average survey score is a separate weighted mean of the 0–10 ratings and should not replace NPS.',
  },
  {
    question: 'How many responses are needed for NPS?',
    answer:
      'There is no universal minimum. Appropriate sample size depends on the target population, desired confidence, sampling method, and expected variability. Larger representative samples generally produce more stable estimates.',
  },
  {
    question: 'How often should businesses measure NPS?',
    answer:
      'Frequency depends on the business model and customer interaction cycle. Teams may run periodic relationship surveys or transaction-based surveys. Avoid surveying so often that respondents experience survey fatigue.',
  },
];
