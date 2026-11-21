import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOCIAL_SECURITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is a Social Security Claiming Calculator?' },
  { id: 'ssa-rules', label: 'SSA FRA, Early Reduction, and Delayed Credits' },
  { id: 'how-modeled', label: 'How Ideal Age Is Modeled' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ss-faq', label: 'Frequently Asked Questions' },
];

export const SOCIAL_SECURITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is full retirement age (FRA)?',
    answer:
      'FRA is the age when you can receive 100% of your primary insurance amount (PIA). It depends on your year of birth under SSA rules — age 66 for many born 1943–1954, rising to 67 for those born in 1960 or later.',
  },
  {
    question: 'How are early benefits reduced?',
    answer:
      'SSA reduces the PIA by 5/9 of 1% for each of the first 36 months before FRA, then 5/12 of 1% for each additional early month. Claiming at 62 with FRA 67 is a 30% permanent reduction.',
  },
  {
    question: 'How do delayed retirement credits work?',
    answer:
      'If you wait past FRA, benefits increase by delayed retirement credits. For people born in 1943 or later, that is 2/3 of 1% per month (8% per year) through the month before age 70.',
  },
  {
    question: 'Why do I need to enter a benefit at FRA?',
    answer:
      'The calculator never invents your dollar benefit. Enter the monthly amount at full retirement age from your SSA statement or estimator. The optional default uses the Dec 2024 average retired-worker benefit only as an illustration.',
  },
  {
    question: 'How is the “ideal” age chosen?',
    answer:
      'For each claim age from 62 to 70, the model applies SSA multipliers, grows benefits with your assumed COLA, invests each check at your assumed return through life expectancy, and selects the age with the highest terminal portfolio value.',
  },
  {
    question: 'Does this include taxes, spouses, or the earnings test?',
    answer:
      'No. Taxes, spousal and survivor benefits, the retirement earnings test, Medicare, and health/longevity uncertainty are omitted. Use official SSA tools and a qualified advisor for personal decisions.',
  },
  {
    question: 'Is there a currency converter?',
    answer:
      'No. Benefits are modeled in fixed U.S. dollars to match Social Security payment units.',
  },
];
