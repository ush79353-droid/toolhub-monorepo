import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cpe', label: 'What Is Cross-Price Elasticity of Demand?' },
  { id: 'cpe-formula', label: 'Cross-Price Elasticity Formula' },
  { id: 'understanding', label: 'Understanding the Results' },
  { id: 'substitutes', label: 'Substitute Goods' },
  { id: 'complements', label: 'Complementary Goods' },
  { id: 'how-to-calculate', label: 'How to Calculate Cross-Price Elasticity' },
  { id: 'worked-example', label: 'Cross-Price Elasticity Calculation Example' },
  { id: 'vs-own-price', label: 'Cross-Price vs Own-Price Elasticity' },
  { id: 'why-matters', label: 'Why Cross-Price Elasticity Matters' },
  { id: 'what-affects', label: 'What Affects Cross-Price Elasticity?' },
  { id: 'limitations', label: 'Limitations of Cross-Price Elasticity' },
  { id: 'cpe-faq', label: 'Frequently Asked Questions' },
];

export const CPE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is cross-price elasticity?',
    answer:
      'Cross-price elasticity of demand measures how quantity demanded of one product responds to a change in the price of another product.',
  },
  {
    question: 'How do I calculate cross-price elasticity?',
    answer:
      'EBA = %ΔQB / %ΔPA. With two points, compute each percentage change (initial-value or midpoint), then divide.',
  },
  {
    question: 'What does positive cross-price elasticity mean?',
    answer:
      'A positive coefficient is consistent with substitute goods; demand for B moves in the same direction as A\'s price change, under the stated assumptions.',
  },
  {
    question: 'What does negative cross-price elasticity mean?',
    answer:
      'A negative coefficient is consistent with complementary goods; demand for B moves opposite A\'s price change.',
  },
  {
    question: 'What does zero cross-price elasticity mean?',
    answer:
      'Over the selected interval, Product B\'s demand did not respond to the observed change in Product A\'s price. That does not prove the products are permanently unrelated.',
  },
  {
    question: 'What is the difference between cross-price elasticity and own-price elasticity?',
    answer:
      'Own-price elasticity uses the same product\'s price and quantity. Cross-price elasticity links one product\'s demand to another product\'s price.',
  },
  {
    question: 'Can cross-price elasticity be greater than 1?',
    answer:
      'Yes. |E| > 1 means a relatively elastic cross-price response; |E| < 1 is relatively inelastic; |E| ≈ 1 is unit magnitude.',
  },
  {
    question: 'Can cross-price elasticity be negative?',
    answer:
      'Yes. Complementary products often show negative cross-price elasticity.',
  },
  {
    question: 'What happens when Product A\'s price does not change?',
    answer:
      'Percentage price change is zero, so cross-price elasticity is undefined under the finite-change formula. This calculator does not show Infinity.',
  },
  {
    question: 'What is the midpoint method for cross-price elasticity?',
    answer:
      'Arc elasticity divides changes by the average of the two prices and quantities. It is symmetric if you reverse the observation order, unlike the initial-value method.',
  },
  {
    question: 'How do businesses use cross-price elasticity?',
    answer:
      'It informs pricing, competitive positioning, bundling, and demand analysis for related products; always with caveats about other market changes.',
  },
  {
    question:
      'What is the cross-price elasticity when price increases by 10% and demand for another product increases by 20%?',
    answer:
      'E = 20% / 10% = +2.00: a positive coefficient consistent with a relatively strong substitute response under those assumptions.',
  },
  {
    question:
      'What is the cross-price elasticity when price rises by 20% and demand for another product falls by 10%?',
    answer:
      'E = −10% / 20% = −0.50; complement-consistent and relatively inelastic in magnitude.',
  },
  {
    question: 'Does cross-price elasticity prove that two products are substitutes?',
    answer:
      'No. A positive observed coefficient is consistent with substitutes but does not prove causation without controls for income, advertising, seasonality, and other factors.',
  },
];
