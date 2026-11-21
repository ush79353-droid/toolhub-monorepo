import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DART_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dart', label: 'What is the DART rate?' },
  { id: 'why-dart-matters', label: 'Why is the DART rate so important?' },
  { id: 'how-to-use', label: 'How to use the DART rate calculator?' },
  { id: 'how-to-calculate', label: 'How to calculate the DART rate?' },
  { id: 'dart-vs-trir', label: 'DART rate vs. total recordable incident rate' },
  { id: 'reduce-dart', label: 'How to reduce workplace DART rates' },
  { id: 'dart-faq', label: 'Frequently asked questions' },
];

export const DART_FAQS: readonly FAQItem[] = [
  {
    question: 'What does DART stand for?',
    answer:
      'DART means Days Away, Restricted, or Transferred. It refers to OSHA-recordable injury or illness cases that involve days away from work, restricted work activity, or job transfer.',
  },
  {
    question: 'How do you calculate DART rate?',
    answer:
      'DART Rate = (Qualifying DART Cases × 200,000) ÷ Total Hours Worked. Example: 5 cases and 400,000 hours → (5 × 200,000) / 400,000 = 2.50 cases per 100 full-time-equivalent workers.',
  },
  {
    question: 'What is a good DART rate?',
    answer:
      'A lower rate generally means fewer qualifying cases relative to hours worked. There is no universal “good” number. Compare with your own history and relevant industry-specific statistics using consistent definitions and periods.',
  },
  {
    question: 'Is DART rate a percentage?',
    answer:
      'No. It is a standardized incidence rate per 100 full-time-equivalent workers, not the percent of employees injured.',
  },
  {
    question: 'What is the difference between DART and TRIR?',
    answer:
      'TRIR (or TRC) uses all OSHA-recordable cases. DART uses only the subset involving days away, restricted duty, or transfer. Both normalize with 200,000 hours. Correctly calculated DART should not exceed TRIR for the same period and hours.',
  },
  {
    question: 'Why is 200,000 used in the DART formula?',
    answer:
      'It represents 100 full-time-equivalent workers × 40 hours/week × 50 weeks/year = 200,000 hours, so rates are comparable across organizations of different sizes.',
  },
  {
    question: 'Can a company have a DART rate of zero?',
    answer:
      'Yes. With positive hours worked and zero qualifying cases, the rate is 0.00. That does not by itself prove a hazard-free workplace.',
  },
  {
    question: 'Does DART count the total number of days away?',
    answer:
      'No. DART counts qualifying cases, not the sum of lost workdays. A case that involves both time away and restricted duty still counts once.',
  },
  {
    question: 'What working hours should be included?',
    answer:
      'Use actual hours worked, including overtime. Exclude paid nonworking time such as vacation, sick leave, and holidays not worked. Hours must match the same reporting period as the case count.',
  },
  {
    question: 'Can DART rates be compared between different industries?',
    answer:
      'Direct comparisons can mislead because hazard profiles, work types, and reporting practices differ. Prefer industry-specific context and consistent methodologies.',
  },
  {
    question: 'Can a DART rate be greater than 100?',
    answer:
      'Yes, mathematically. The rate is not capped at 100 because it is an incidence rate, not a percentage of the workforce.',
  },
  {
    question: 'How often should a company calculate DART rate?',
    answer:
      'Many organizations compute it annually for recordkeeping and also monitor it periodically internally. Use consistent reporting periods or appropriate annualization when comparing results.',
  },
];
