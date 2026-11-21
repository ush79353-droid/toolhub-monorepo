import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REMOTE_VS_ON_LOCATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-remote-work', label: 'What is remote work?' },
  { id: 'what-is-on-site-work', label: 'What is on-site work?' },
  { id: 'pros-cons-remote', label: 'Pros and cons of remote work' },
  { id: 'advantages-remote', label: 'Advantages of remote work' },
  { id: 'disadvantages-remote', label: 'Disadvantages of remote work' },
  { id: 'promote-remote', label: 'Steps to promote a remote work environment' },
  { id: 'how-to-use', label: 'How to use this calculator' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'remote-vs-on-location-faq', label: 'Frequently asked questions' },
];

export const REMOTE_VS_ON_LOCATION_FAQS: readonly FAQItem[] = [
  {
    question: 'Is remote work cheaper than on-site work?',
    answer:
      'Remote work can reduce office rent and some facility costs, but it may add allowances, equipment, and connectivity expenses. The cheaper option depends on headcount, location, lease vs ownership, and which costs you include.',
  },
  {
    question: 'What are the main costs of remote employees?',
    answer:
      'Common items include equipment or home-office allowances, internet reimbursements, stationery, software, phone support, and other recurring employee-related expenses entered per person.',
  },
  {
    question: 'What are the main costs of on-site employees?',
    answer:
      'Typical office-level costs include rent or ownership-related operations, setup and furniture, utilities, internet, stationery, cleaning, security, maintenance, and insurance; entered as workplace totals, not multiplied by headcount in this calculator.',
  },
  {
    question: 'Is owning an office cheaper than leasing one?',
    answer:
      'Ownership removes recurring rent but can introduce maintenance, taxes, insurance, financing, and capital costs. Whether ownership is cheaper depends on those costs and the comparison period length.',
  },
  {
    question: 'How do you calculate remote employee costs?',
    answer:
      'Remote one-time cost = employees × one-time allowance per employee. Remote recurring cost = employees × monthly recurring per employee × comparison months. Total remote = one-time + recurring.',
  },
  {
    question: 'How do you calculate on-site employee costs?',
    answer:
      'On-location one-time cost is the office setup total. Recurring cost is monthly office operating cost (including lease when selected) × comparison months. Headcount is used for per-employee results, not to multiply office totals.',
  },
  {
    question: 'What is the difference between one-time and recurring expenses?',
    answer:
      'One-time expenses are counted once in the period. Recurring expenses repeat on a daily, weekly, monthly, quarterly, or yearly schedule and are normalized to a monthly amount before multiplying by the comparison period.',
  },
  {
    question: 'How does the comparison period affect the result?',
    answer:
      'Longer periods accumulate more recurring cost while one-time costs stay the same. Changing days/weeks/months/years converts the period into months for the engine.',
  },
  {
    question: 'Can I add custom expenses?',
    answer:
      'Yes. Enable “Show additional cost items” on either side to add named amounts with their own frequencies. Remove rows you no longer need.',
  },
  {
    question: 'Does this calculator include employee salaries?',
    answer:
      'No. The standard fields focus on remote allowances and workplace operating costs. Salaries and benefits are included only if you add comparable custom expenses on both sides.',
  },
  {
    question: 'Can remote work reduce company operating costs?',
    answer:
      'It may reduce facility overhead, but savings depend on allowances, tools, security, and whether you still keep an office. Use totals and per-employee metrics together when headcounts differ.',
  },
  {
    question: 'Should businesses always choose the cheaper working arrangement?',
    answer:
      'No. Also weigh productivity, collaboration, security, culture, customer needs, and continuity. Cost is only one decision factor.',
  },
];
