import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_PER_HOUR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-money-per-hour-calculator',
    label: 'What Is a Money per Hour Calculator?',
  },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'hourly-conversion-formulas', label: 'Hourly Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'money-per-hour-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_PER_HOUR_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Money per Hour Calculator work?',
    answer:
      'Enter any one of annual salary, monthly, biweekly, weekly, or daily wage plus hours per week (default 40). The last-edited wage field is authoritative. The calculator derives money per hour and fills the other period fields for reference.',
  },
  {
    question: 'What formulas convert period wages to an hourly rate?',
    answer:
      'Hourly = Annual ÷ (Hours/week × 52); from monthly = (Monthly × 12) ÷ annual hours; from weekly = Weekly ÷ Hours/week; from biweekly = Biweekly ÷ 2 ÷ Hours/week; from daily = (Daily × 5) ÷ Hours/week. Daily assumes a five-day working week.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math runs in the authoritative field’s currency at full precision; other periods and the Money per hour answer convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from the Wage Calculator?',
    answer:
      'Wage Calculator also includes hourly, per-minute, and per-second as inputs. Money per Hour focuses on converting annual/monthly/biweekly/weekly/daily pay into a Money per hour answer, matching its screenshot-first scope.',
  },
];
