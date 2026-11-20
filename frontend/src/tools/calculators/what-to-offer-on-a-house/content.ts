import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WHAT_TO_OFFER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fmv', label: 'What Does Fair Market Value Mean?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'how-to-decide', label: 'How Do I Determine What to Offer?' },
  { id: 'buyers-market', label: 'When Is It a Buyer’s Market?' },
  { id: 'market-and-fmv', label: 'Market Conditions and FMV' },
  { id: 'renovation-costs', label: 'How Renovation Costs Affect Offers' },
  { id: 'discount-vs-profit', label: 'Desired Discount vs Desired Profit' },
  { id: 'offer-formula', label: 'How to Calculate an Offer Price' },
  { id: 'what-is-arv', label: 'What Is After-Repair Value (ARV)?' },
  { id: 'limitations', label: 'Important Limitations' },
  { id: 'what-to-offer-faq', label: 'Frequently Asked Questions' },
];

export const WHAT_TO_OFFER_FAQS: readonly FAQItem[] = [
  {
    question: 'What should I offer on a home whose market value is $77,000?',
    answer:
      'It depends on your assumptions. Example: FMV $77,000 − renovation $5,000 − discount $3,000 − desired profit $8,000 = offer $61,000. Change the inputs and the offer changes; this is not a guaranteed accepted price.',
  },
  {
    question: 'What are the advantages of buying a home in a buyer’s market?',
    answer:
      'Buyer’s markets often feature more inventory, longer days on market, and more room to negotiate price or repairs. Advantages still depend on financing, property condition, and local demand — they are not automatic.',
  },
  {
    question:
      'How do I figure out how much I should offer on a home whose fair market value is $170,000 in a buyer’s market?',
    answer:
      'Example assumptions: FMV $170,000, renovation $12,000, desired discount $8,000, desired profit $0 (personal purchase) → offer $150,000. In a softer market you may widen the discount input, but comps and inspection findings still matter more than a single rule of thumb.',
  },
  {
    question: 'How do I determine the fair market value of a property?',
    answer:
      'Review recent comparable sales, adjust for condition and location, and consider a professional appraisal when required. Asking price alone is not fair market value.',
  },
  {
    question: 'Is fair market value the same as asking price?',
    answer:
      'No. Asking price is what the seller lists. Fair market value is an estimate of what informed parties might agree under ordinary conditions. Listings can sit above or below that estimate.',
  },
  {
    question: 'Should renovation costs reduce my house offer?',
    answer:
      'Often yes when the FMV you entered reflects as-is condition and you will pay for repairs. If your valuation already assumes renovated condition (ARV), subtracting renovation again can double-count. Keep the valuation basis consistent.',
  },
  {
    question: 'What is the difference between fair market value and after-repair value?',
    answer:
      'FMV here usually means the property’s current estimated market value. After-repair value (ARV) estimates value after planned renovations. This calculator does not silently treat FMV as ARV — use an ARV-based workflow when that is your investment model.',
  },
  {
    question: 'What happens if renovation costs exceed the property’s value?',
    answer:
      'If total deductions meet or exceed FMV, the mathematical offer is zero or negative. The calculator shows that signed result with a warning and marks an actionable offer as unavailable rather than inventing a positive price.',
  },
  {
    question: 'Can I offer below fair market value?',
    answer:
      'Yes — buyers often submit offers below estimated market value. Whether a seller accepts depends on competition, motivation, inspection, appraisal, and local conditions.',
  },
  {
    question: 'Does this calculator guarantee the seller will accept my offer?',
    answer:
      'No. It is a simplified numerical framework for negotiation or investment planning, not a legal valuation, appraisal, or acceptance guarantee.',
  },
];
