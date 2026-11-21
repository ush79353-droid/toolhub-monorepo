import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPTIMAL_PRICE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-optimal', label: 'What Is the Optimal Price?' },
  { id: 'why-important', label: 'Why Is Optimal Pricing Important?' },
  { id: 'how-to-find', label: 'How to Find the Optimal Price' },
  { id: 'marginal-cost', label: 'Marginal Cost Definition' },
  { id: 'marginal-revenue', label: 'Marginal Revenue Definition' },
  { id: 'mr-mc', label: 'Marginal Revenue vs Marginal Cost' },
  { id: 'what-is-ped', label: 'What Is Price Elasticity of Demand?' },
  { id: 'calc-ped', label: 'How to Calculate Price Elasticity' },
  { id: 'optimal-formula', label: 'Optimal Price Formula' },
  { id: 'optimal-qty', label: 'How to Calculate Optimal Quantity' },
  { id: 'profit-initial', label: 'Profit at the Initial Price' },
  { id: 'profit-final', label: 'Profit at the Final Price' },
  { id: 'profit-optimal', label: 'Profit at the Optimal Price' },
  { id: 'worked-example', label: 'Complete Optimal Price Example' },
  { id: 'elastic', label: 'Understanding Elastic Demand' },
  { id: 'inelastic', label: 'Understanding Inelastic Demand' },
  { id: 'unit-elastic', label: 'Unit Elastic Demand' },
  { id: 'markups', label: 'Why More Elastic Demand Supports Lower Markups' },
  { id: 'vs-revenue', label: 'Optimal Price vs Maximum Revenue Price' },
  { id: 'vs-breakeven', label: 'Optimal Price vs Break-Even Price' },
  { id: 'markup-vs-margin', label: 'Markup vs Profit Margin' },
  { id: 'retail', label: 'Optimal Pricing for Retail Businesses' },
  { id: 'services', label: 'Optimal Pricing for Services' },
  { id: 'online', label: 'Optimal Pricing for Online Businesses' },
  { id: 'competition', label: 'How Competition Affects Optimal Pricing' },
  { id: 'behavior', label: 'How Customer Behavior Affects Pricing' },
  { id: 'costs', label: 'How Production Costs Affect Optimal Price' },
  { id: 'mistakes', label: 'Common Optimal Pricing Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'op-faq', label: 'Frequently Asked Questions' },
];

export const OPTIMAL_PRICE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the optimal price?',
    answer:
      'The selling price that maximizes estimated profit under a stated demand and cost model; here, constant elasticity with constant marginal cost.',
  },
  {
    question: 'How do I calculate the optimal price?',
    answer:
      'Calibrate elasticity from two price–quantity points, then apply P* = MC × ε/(ε+1) when MC > 0 and ε < −1.',
  },
  {
    question: 'What is the optimal pricing formula?',
    answer: 'P* = MC × ε/(ε+1), equivalent to MC / (1 + 1/ε).',
  },
  {
    question: 'How does marginal cost affect optimal price?',
    answer:
      'Higher constant MC raises the optimal price proportionally for a given elasticity less than −1.',
  },
  {
    question: 'What is marginal revenue?',
    answer:
      'The additional revenue from selling one more unit. Along a demand curve, MR is generally below price.',
  },
  {
    question: 'What is the difference between marginal revenue and selling price?',
    answer:
      'Price is average revenue per unit. MR is the incremental revenue from one more unit and is lower when demand slopes down.',
  },
  {
    question: 'Why is MR = MC important?',
    answer:
      'At an interior profit maximum, marginal revenue equals marginal cost.',
  },
  {
    question: 'What is price elasticity of demand?',
    answer:
      'The responsiveness of quantity demanded to price changes; typically negative for ordinary goods.',
  },
  {
    question: 'How do I calculate price elasticity?',
    answer:
      'This tool uses ε = ln(Q2/Q1)/ln(P2/P1) for optimization and optionally shows midpoint (arc) elasticity descriptively.',
  },
  {
    question: 'Why is elasticity usually negative?',
    answer:
      'Higher prices typically reduce quantity demanded along a downward-sloping demand curve.',
  },
  {
    question: 'What does elastic demand mean?',
    answer: '|ε| > 1; quantity changes proportionally more than price.',
  },
  {
    question: 'What does inelastic demand mean?',
    answer: '0 < |ε| < 1; quantity changes proportionally less than price.',
  },
  {
    question: 'What is unit elastic demand?',
    answer: '|ε| = 1; percentage quantity and price changes match in magnitude.',
  },
  {
    question: 'Can price elasticity be positive?',
    answer:
      'Unusual for ordinary goods; may reflect measurement issues or other shifting conditions. The default markup model does not apply.',
  },
  {
    question: 'What is the relationship between elasticity and optimal price?',
    answer:
      'More elastic demand (ε more negative, farther below −1) supports a smaller markup over MC.',
  },
  {
    question: 'What is optimal quantity?',
    answer:
      'Estimated units demanded at the optimal price under the calibrated demand curve.',
  },
  {
    question: 'How do I calculate optimal quantity?',
    answer: 'Q* = Q0 × (P*/P0)^ε using a reference observation (P0, Q0).',
  },
  {
    question: 'How do I calculate profit at the initial price?',
    answer: 'π1 = (P1 − MC) × Q1 (before fixed costs in this model).',
  },
  {
    question: 'How do I calculate profit at the final price?',
    answer: 'π2 = (P2 − MC) × Q2 (before fixed costs).',
  },
  {
    question: 'How do I calculate profit at the optimal price?',
    answer: 'π* = (P* − MC) × Q* (before fixed costs).',
  },
  {
    question: 'What is the difference between optimal price and maximum revenue price?',
    answer:
      'Revenue maximization ignores cost. Profit maximization equates MR to MC and generally differs.',
  },
  {
    question: 'What is the difference between optimal price and break-even price?',
    answer:
      'Break-even covers costs; optimal price aims to maximize profit under the demand model.',
  },
  {
    question: 'What is the difference between markup and profit margin?',
    answer:
      'Markup on cost = (P−MC)/MC; margin on price = (P−MC)/P. They are different percentages.',
  },
  {
    question: 'Does a higher price always increase profit?',
    answer: 'No: higher prices can cut quantity enough to reduce profit.',
  },
  {
    question: 'Does a lower price always increase sales?',
    answer: 'Usually along a demand curve, but not guaranteed if other factors shift demand.',
  },
  {
    question: 'Can the optimal price be lower than marginal cost?',
    answer:
      'Not under the standard positive-MC interior monopoly markup with ε < −1; P* exceeds MC.',
  },
  {
    question: 'What happens when elasticity equals -1?',
    answer:
      'The constant-elasticity markup formula has no finite positive interior solution when MC > 0.',
  },
  {
    question: 'What happens when demand is inelastic?',
    answer:
      'With unrestricted constant elasticity and positive MC, there is no finite positive interior optimum.',
  },
  {
    question: 'Can a business have multiple optimal prices?',
    answer:
      'Different models, segments, or constraints can yield different optima. This tool returns one unconstrained constant-elasticity optimum when valid.',
  },
  {
    question: 'What happens when marginal cost increases?',
    answer: 'The modeled optimal price rises for a given ε < −1.',
  },
  {
    question: 'What happens when marginal cost decreases?',
    answer: 'The modeled optimal price falls for a given ε < −1.',
  },
  {
    question: 'How does competition influence optimal price?',
    answer:
      'Competition can increase elasticity and reduce markups. This calculator does not model rival reactions.',
  },
  {
    question: 'What is the best pricing strategy for a small business?',
    answer:
      'No universal answer; test demand, track costs, and consider capacity and competition beyond this estimate.',
  },
  {
    question: 'How can a retailer optimize product pricing?',
    answer:
      'Measure price responses carefully, know variable costs, and treat calculator output as a starting estimate.',
  },
  {
    question: 'How can businesses estimate customer demand?',
    answer:
      'Price tests, historical sales, surveys, and market data; two points alone may not identify a causal curve.',
  },
  {
    question: 'How accurate is an optimal price calculator?',
    answer:
      'Only as good as its assumptions (constant ε, constant MC, zero fixed costs). It is an educational estimate.',
  },
  {
    question: 'Can I calculate optimal price without demand elasticity?',
    answer:
      'Not with this markup formula. Other models need an explicit demand function.',
  },
  {
    question: 'Why does the calculator sometimes show no valid optimum?',
    answer:
      'When MC ≤ 0 or ε ≥ −1, the unrestricted constant-elasticity model has no finite positive interior optimum.',
  },
  {
    question: 'How do fixed costs affect optimal price?',
    answer:
      'Fixed costs shift total profit levels but not the MR = MC price under these assumptions. This UI assumes FC = 0.',
  },
  {
    question: 'Can optimal pricing increase profitability?',
    answer:
      'Moving toward a better price–quantity trade-off can raise contribution. Results depend on real demand and costs.',
  },
  {
    question: 'What is the optimal price if marginal cost is $40 and elasticity is -2?',
    answer: 'P* = 40 × (−2)/(−1) = $80.',
  },
  {
    question: 'What is the optimal price if marginal cost is $30 and elasticity is -3?',
    answer: 'P* = 30 × (−3)/(−2) = $45.',
  },
  {
    question:
      'What is the profit when a product sells for $100, marginal cost is $40, and 100 units are sold?',
    answer: 'π = (100 − 40) × 100 = $6,000 before fixed costs.',
  },
  {
    question: 'What happens when price elasticity equals -1?',
    answer:
      'No finite positive interior optimum under constant elasticity with positive MC; do not display Infinity.',
  },
];
