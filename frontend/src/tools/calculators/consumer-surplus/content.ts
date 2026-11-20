import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cs', label: 'What Is Consumer Surplus?' },
  { id: 'cs-formula', label: 'What Is the Consumer Surplus Formula?' },
  { id: 'examples', label: 'How to Find Consumer Surplus – Examples' },
  { id: 'how-to-use', label: 'How to Use the Consumer Surplus Calculator' },
  { id: 'graph', label: 'Consumer Surplus on a Supply and Demand Graph' },
  { id: 'linear-demand', label: 'Consumer Surplus Under Linear Demand' },
  { id: 'vs-producer', label: 'Consumer Surplus vs Producer Surplus' },
  { id: 'why-matters', label: 'Why Consumer Surplus Matters' },
  { id: 'price-increase', label: 'What Happens When Prices Increase?' },
  { id: 'discounts', label: 'Consumer Surplus and Discounts' },
  { id: 'limitations', label: 'Consumer Surplus Limitations' },
  { id: 'cs-faq', label: 'Frequently Asked Questions' },
];

export const CS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate consumer surplus?',
    answer:
      'CS = WTP − P, where WTP is maximum willingness to pay and P is the actual price paid.',
  },
  {
    question: 'What is consumer surplus?',
    answer:
      'Consumer surplus is the monetary benefit a consumer receives when the price paid is below their maximum willingness to pay.',
  },
  {
    question: 'What is the consumer surplus if the price is $20?',
    answer:
      'Willingness to pay is also required. Example: actual price $20 and WTP $25 → consumer surplus $5.',
  },
  {
    question: 'Can consumer surplus be zero?',
    answer:
      'Yes, when actual price equals maximum willingness to pay, surplus is zero.',
  },
  {
    question: 'Can consumer surplus be negative?',
    answer:
      'A signed price difference can be negative when price exceeds WTP. Under a voluntary-purchase model, realized surplus is not applicable — not buying yields zero surplus.',
  },
  {
    question: 'What is willingness to pay?',
    answer:
      'Willingness to pay is the maximum amount a consumer would pay for the product or service.',
  },
  {
    question: 'What is the difference between consumer surplus and producer surplus?',
    answer:
      'Consumer surplus is the buyer-side benefit below WTP. Producer surplus is the seller-side benefit when market price exceeds the minimum acceptable supply price under the relevant model.',
  },
  {
    question: 'How do I calculate consumer surplus from a graph?',
    answer:
      'On a supply-demand graph, consumer surplus is the area above market price and below the demand curve, up to the quantity purchased.',
  },
  {
    question: 'Does a discount always increase consumer surplus?',
    answer:
      'A lower transaction price increases surplus relative to a fixed WTP, holding other factors constant. Advertised retail discounts are not the same as surplus unless list price equals WTP.',
  },
  {
    question: 'How do I calculate market consumer surplus?',
    answer:
      'Under linear demand, market CS ≈ ½ × (Pmax − Pe) × Qe. That triangular formula is separate from the individual WTP − P purchase model.',
  },
  {
    question: 'Is consumer surplus the same as profit?',
    answer:
      'No. Surplus is a welfare concept based on valuation versus price, not accounting profit.',
  },
  {
    question: 'Why is consumer surplus important in economics?',
    answer:
      'It helps describe consumer welfare, pricing effects, and market outcomes when willingness to pay and prices are known or assumed.',
  },
];
