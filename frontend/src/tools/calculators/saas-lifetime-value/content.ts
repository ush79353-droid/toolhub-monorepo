import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAAS_LTV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-saas-ltv', label: 'What is SaaS LTV?' },
  { id: 'saas-ltv-formulas', label: 'Formulas' },
  { id: 'saas-ltv-example', label: 'Worked example' },
  { id: 'saas-ltv-faq', label: 'Frequently asked questions' },
];

export interface SaasLtvGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const SAAS_LTV_GUIDE_SECTIONS: readonly SaasLtvGuideSection[] = [
  {
    id: 'what-saas-ltv',
    title: 'What is SaaS customer lifetime value?',
    paragraphs: [
      'Customer lifetime value (LTV) estimates how much gross-margin contribution a typical account produces before it churns. This calculator uses a simple recurring-revenue model with optional account expansion.',
      'ARPA, expansion, and churn must use the same period (for example all monthly). Mixing monthly ARPA with annual churn invents a lifetime that is not real.',
    ],
  },
  {
    id: 'saas-ltv-formulas',
    title: 'Formulas',
    paragraphs: [
      'If you do not know ARPA, divide recurring revenue by the number of accounts. Then add expansion, apply gross margin, and divide by the churn fraction.',
      'When churn is zero, lifetime is unbounded in this model, so the calculator shows “No finite estimate” instead of Infinity.',
    ],
    formula:
      'ARPA = Recurring Revenue ÷ Number of Accounts\nLTV = ((ARPA + Account Expansion) × Gross Margin ÷ 100) ÷ (Churn ÷ 100)',
  },
  {
    id: 'saas-ltv-example',
    title: 'Worked example',
    paragraphs: [
      'ARPA 1,000, gross margin 80%, churn 5%, account expansion 100. Contribution per period = (1,000 + 100) × 0.8 = 880. LTV = 880 ÷ 0.05 = 17,600.',
    ],
  },
];

export const SAAS_LTV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ARPA?',
    answer:
      'Average revenue per account for one period — typically monthly recurring revenue per customer. You can enter it directly or derive it from total recurring revenue and account count.',
  },
  {
    question: 'What does account expansion mean?',
    answer:
      'Extra recurring revenue per account per period from upsells or seat growth. It is added to ARPA before margin and churn are applied.',
  },
  {
    question: 'What if churn is zero?',
    answer:
      'This simple model has no finite lifetime when nobody churns. The calculator shows “No finite estimate” and never displays Infinity or NaN.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Enter every amount in the same denomination.',
  },
];
