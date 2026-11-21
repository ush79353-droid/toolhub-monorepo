import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SUBSCRIPTION_WASTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'entertainment-cost-per-month',
    label: 'How much does entertainment cost per month?',
  },
  {
    id: 'subscription-illusion',
    label: 'How much is a subscription worth? The illusion of small payments',
  },
  {
    id: 'how-to-use-subscription-waste',
    label: 'How to use the subscription waste calculator',
  },
  {
    id: 'average-cost-subscriptions',
    label: 'Calculating your average cost of subscriptions per month',
  },
  {
    id: 'final-thoughts-subscription-price',
    label: 'Final thoughts: Is the subscription price worth it?',
  },
  { id: 'subscription-waste-faq', label: 'FAQs' },
];

export const SUBSCRIPTION_WASTE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is subscription fatigue?',
    answer:
      'Subscription fatigue happens when you accumulate so many recurring services that the total monthly cost becomes hard to track or justify; especially when free trials convert to paid plans and charges renew automatically.',
  },
  {
    question: 'Are digital goods and streaming services taxed in all US states?',
    answer:
      'Not uniformly. Tax treatment depends on state and local rules, the type of digital service, and how the seller remits tax. Some jurisdictions tax streaming or software subscriptions; others do not. Check local guidance rather than assuming one nationwide rule.',
  },
  {
    question: 'How much am I paying for streaming each month?',
    answer:
      'Add every streaming service you use under Streaming TV (and any related apps elsewhere), enter each recurring price and billing frequency, then read the Streaming TV category total and overall monthly total.',
  },
  {
    question: 'How do I calculate the cost of my monthly subscriptions?',
    answer:
      'Convert yearly, quarterly, and weekly bills into monthly equivalents, then sum them: TotalMonthlyCost = Σ MonthlyEquivalentᵢ. This calculator does that conversion automatically.',
  },
];

export const BUDGET_CALCULATOR_HREF = '/tools/business-budget-calculator';
export const FIFTY_THIRTY_TWENTY_HREF = '/tools/503020-rule-calculator';
