import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COLLEGE_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-much-college-cost', label: 'How much does college cost?' },
  { id: 'net-price-calculators', label: 'College-specific net price calculators' },
  { id: 'higher-education-us', label: 'Higher education in the U.S.' },
  { id: 'cost-components', label: 'Tuition, room & board, and supplies' },
  { id: 'financial-aid', label: 'Financial aid' },
  { id: 'calculating-financial-aid', label: 'Calculating financial aid' },
  { id: '529-savings', label: 'The 529 savings plan' },
  { id: '529-prepaid', label: '529 prepaid plan' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'college-cost-faq', label: 'Frequently asked questions' },
];

export const COLLEGE_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'How much does college cost?',
    answer:
      'Total cost depends on institution type (public/private, in-state/out-of-state), tuition and fees, housing and meals, books, transportation, and personal expenses. Reference averages help with planning; school-specific net price calculators refine the estimate.',
  },
  {
    question: 'How do I calculate the future cost of college?',
    answer:
      'Start with today’s annual cost, apply an expected college-cost inflation rate for each year until and during attendance, then sum the inflated academic years. In short: FutureCost = CurrentCost × (1 + InflationRate)^Years for a single year, then repeat for each attendance year.',
  },
  {
    question: 'How much should I save for college?',
    answer:
      'Decide what share of projected costs you want savings to cover, grow today’s balance at an after-tax return until enrollment, and close any gap with additional contributions. This calculator estimates that target, projected balance, and a level monthly deposit.',
  },
  {
    question: 'What is the average cost of a four-year college?',
    answer:
      'Averages differ for private colleges, public in-state, and public out-of-state students. The 2025–2026 College Board reference figures used here are planning averages; individual schools can be much higher or lower.',
  },
  {
    question: 'How does college inflation affect education costs?',
    answer:
      'If costs rise each year, delaying enrollment and each additional academic year both increase the dollars you need. Compounding means small annual increases add up over a decade of saving.',
  },
  {
    question: 'What is the difference between a 529 savings plan and a prepaid plan?',
    answer:
      'A 529 savings plan invests contributions for qualified education expenses with tax advantages that depend on plan and tax rules. A prepaid plan typically locks in eligible tuition credits at participating schools. Structures, portability, and risks differ. Compare your state’s options.',
  },
  {
    question: 'What is a college net price calculator?',
    answer:
      'Many colleges offer online tools that estimate what a student may pay after grants and scholarships based on household and student information. Use them alongside this broader inflation and savings planner.',
  },
  {
    question: 'Can I use existing savings to pay for college?',
    answer:
      'Yes. Enter your current college savings so the calculator can project growth until enrollment and show how much of your savings target is already covered.',
  },
  {
    question: 'How does investment return affect college savings?',
    answer:
      'Higher after-tax returns increase the projected balance of today’s savings and reduce the additional monthly amount needed to hit a target, all else equal. Returns are not guaranteed.',
  },
  {
    question: 'Does this calculator include scholarships and grants?',
    answer:
      'Not as separate line items. Set “percent of costs from savings” to the share you intend to cover yourself; the remainder is treated as other funding (aid, loans, family support, etc.).',
  },
  {
    question: 'Does the calculator include taxes?',
    answer:
      'The tax-rate field estimates tax only on investment earnings (a simplified constant rate). Actual tax treatment depends on the account type and law. Use 0% for eligible tax-advantaged 529 growth when that matches your situation.',
  },
  {
    question: 'When should I start saving for college?',
    answer:
      'Earlier contributions generally need less each month because of compounding and more years of inflation planning. Even starting later helps if you save consistently and revisit assumptions as schools and aid change.',
  },
];
