import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HR_SOFTWARE_ROI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-software-roi', label: 'What is software ROI?' },
  { id: 'roi-formula', label: 'What is the formula used to calculate software ROI?' },
  { id: 'why-calculate', label: 'Why should we calculate HR software ROI?' },
  { id: 'when-to-compute', label: 'When is the best time to compute software ROI?' },
  { id: 'how-to-use', label: 'How to use our HR Software ROI Calculator' },
  { id: 'advanced-roi', label: 'How to calculate advanced HR software ROI' },
  { id: 'examples', label: 'HR software ROI calculation examples' },
  { id: 'interpret', label: 'How to interpret your software ROI' },
  { id: 'hr-roi-faq', label: 'Frequently asked questions' },
];

export const HR_SOFTWARE_ROI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is HR software ROI?',
    answer:
      'HR software ROI measures the financial return from HR technology relative to its cost over a chosen period. It helps compare measurable savings and benefits with purchase, implementation, and operating expenses.',
  },
  {
    question: 'How do you calculate HR software ROI?',
    answer:
      'ROI (%) = ((Gross Benefit − Total Cost) / Total Cost) × 100. Example: cost 500,000 and benefit 750,000 → net 250,000 → ROI 50%.',
  },
  {
    question: 'What is a good ROI for HR software?',
    answer:
      'There is no universal threshold. A “good” result depends on cost, timeline, risk, alternatives, and organizational goals. Treat projections as estimates until benefits are realized.',
  },
  {
    question: 'Can HR software ROI be negative?',
    answer:
      'Yes. If measured benefits are below investment cost for the period, ROI is negative (for example −25%). That can happen early in implementation or when savings do not materialize as planned.',
  },
  {
    question: 'What costs should be included?',
    answer:
      'Include licenses or subscriptions, implementation, data migration, training, integration, maintenance/support, relevant internal labor, and other attributable expenses for the same evaluation period.',
  },
  {
    question: 'How do you estimate HR software benefits?',
    answer:
      'Use evidence-based assumptions for time savings, payroll processing, recruitment, retention, error reduction, document processing, and third-party service savings. Count each benefit only once.',
  },
  {
    question: 'How do I calculate time savings from HR automation?',
    answer:
      'Administrative time savings ≈ employees × hours saved per week × loaded hourly cost × working weeks in the period. This is labor-value unless paid hours or headcount actually decline.',
  },
  {
    question: 'Does HR software automatically improve employee retention?',
    answer:
      'No. Retention improvements are user-supplied projections unless supported by measured results. Model them only when the assumption is defensible.',
  },
  {
    question: 'What is the difference between ROI and payback period?',
    answer:
      'ROI is a relative return for the period. Payback estimates how long one-time investment takes to recover from ongoing net benefits. They answer different questions.',
  },
  {
    question: 'Should I calculate ROI before or after implementation?',
    answer:
      'Use projected ROI before purchase and realized ROI after deployment. Update assumptions as actual costs and benefits become known.',
  },
  {
    question: 'Can I calculate ROI for a multi-year software subscription?',
    answer:
      'Yes: convert recurring costs and benefits to the same multi-year (or custom-month) period and apply the same ROI formula.',
  },
  {
    question: 'Does a higher ROI always mean better software?',
    answer:
      'No. Capabilities, compliance, reliability, support, implementation risk, and nonfinancial value also matter. ROI is one input to the decision.',
  },
];
