import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEEKLY_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to use this calculator' },
  { id: 'monthly-to-weekly', label: 'Monthly income to weekly pay' },
  { id: 'hourly-to-weekly', label: 'Hourly wage to weekly pay' },
  { id: 'weekly-to-annual', label: 'Weekly pay to annual salary' },
  { id: 'conversion-chart', label: 'Weekly pay conversion chart' },
  { id: 'gross-vs-net', label: 'Gross pay vs. net pay' },
  { id: 'factors-affecting-pay', label: 'Factors affecting weekly pay' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'weekly-pay-faq', label: 'Frequently Asked Questions' },
];

export const WEEKLY_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is my weekly pay if I earn $18 per hour?',
    answer:
      'With 40 paid hours per week, weekly pay = 18 × 40 = $720 before taxes and deductions. Change hours per day, days per week, or paid weeks per year in the schedule panel if your contract differs.',
  },
  {
    question: 'How do I calculate weekly pay from monthly salary?',
    answer:
      'Multiply monthly salary by 12 and divide by paid weeks per year. With 52 paid weeks: Weekly Pay = Monthly × 12 / 52. Using ÷4 understates average weekly pay because a year has about 4.333 weeks per month.',
  },
  {
    question: 'How much is $20 an hour per week?',
    answer:
      'At 40 hours per week: 20 × 40 = $800 gross weekly pay. Adjust hours per day and days per week if you work a different schedule.',
  },
  {
    question: 'How much is $25 an hour annually?',
    answer:
      'Assuming 40 hours per week and 52 paid weeks: 25 × 40 × 52 = $52,000 gross annual pay. Fewer paid weeks (for unpaid time off) lowers the annualized total for the same hourly rate.',
  },
  {
    question: 'How many working hours are in a week?',
    answer:
      'A common full-time schedule is 40 hours per week (8 hours × 5 days), but actual hours depend on employer, country, contract, and role. This calculator uses your entered hours per day and days per week.',
  },
  {
    question: 'How do I calculate weekly salary from annual salary?',
    answer:
      'Divide annual salary by paid weeks per year. For a 52-week year: Weekly = Annual / 52. If you have unpaid weeks off, lower paid weeks so the conversion matches your compensated weeks.',
  },
  {
    question: 'Is weekly pay calculated before or after tax?',
    answer:
      'This calculator shows gross pay; earnings before income tax, social contributions, insurance, pensions, and other deductions. Take-home (net) pay needs a separate tax calculation for your jurisdiction.',
  },
  {
    question: 'How many weeks are in a month?',
    answer:
      '52 weeks ÷ 12 months ≈ 4.3333 average paid weeks per month under a 52-week year. Calendar months vary in length, so month ÷ 4 is a rough shortcut, not the annualized average.',
  },
  {
    question: 'Does weekly pay include overtime?',
    answer:
      'Standard conversions use your entered rate and hours without overtime premiums. Premium overtime, double time, or shift differentials need a separate overtime calculator with those rates.',
  },
  {
    question: 'How does unpaid leave affect weekly pay calculations?',
    answer:
      'Unpaid weeks off reduce paid weeks per year (paid weeks = 52 − unpaid weeks). That changes annualized earnings and monthly↔weekly conversions. Paid vacation is compensated time and usually stays inside paid weeks, unlike unpaid leave.',
  },
];
