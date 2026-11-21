import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGINAL_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mc', label: 'What Is Marginal Cost?' },
  { id: 'formula', label: 'Marginal Cost Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Marginal Cost' },
  { id: 'worked-example', label: 'Marginal Cost Calculation Example' },
  { id: 'why-important', label: 'Why Marginal Cost Is Important' },
  { id: 'vs-average', label: 'Marginal Cost vs Average Cost' },
  { id: 'vs-mr', label: 'Marginal Cost vs Marginal Revenue' },
  { id: 'variable-cost', label: 'Marginal Cost and Variable Cost' },
  { id: 'economies', label: 'Economies of Scale' },
  { id: 'diseconomies', label: 'Diseconomies of Scale' },
  { id: 'mc-increase', label: 'Why Marginal Cost May Increase' },
  { id: 'mc-decrease', label: 'Why Marginal Cost May Decrease' },
  { id: 'how-many-units', label: 'How Many Units Should a Business Produce?' },
  { id: 'reduce-mc', label: 'How to Reduce Marginal Cost' },
  { id: 'economics', label: 'Marginal Cost in Economics' },
  { id: 'pricing', label: 'Marginal Cost in Business Pricing' },
  { id: 'mistakes', label: 'Common Marginal Cost Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'mc-faq', label: 'Frequently Asked Questions' },
];

export const MARGINAL_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is marginal cost?',
    answer:
      'Marginal cost is the additional total cost associated with a change in output; here estimated as ΔTC ÷ ΔQ over a finite production interval.',
  },
  {
    question: 'What is the marginal cost formula?',
    answer: 'MC = ΔTC / ΔQ, where ΔTC is the change in total cost and ΔQ is the change in quantity.',
  },
  {
    question: 'How do I calculate marginal cost?',
    answer:
      'Find the change in total cost between two output levels, find the change in quantity, then divide cost change by quantity change (ΔQ ≠ 0).',
  },
  {
    question: 'What is an example of marginal cost?',
    answer:
      'If total cost rises by $15,000 when output rises by 200 units, MC = $15,000 ÷ 200 = $75 per unit over that interval.',
  },
  {
    question: 'Why is marginal cost important?',
    answer:
      'It informs production planning, pricing, capacity use, and whether expanding output is expected to raise costs more than revenues.',
  },
  {
    question: 'What is the difference between marginal cost and average cost?',
    answer:
      'Marginal cost is incremental cost per additional unit over an interval. Average total cost is TC ÷ Q for a given output level.',
  },
  {
    question: 'What is the difference between marginal cost and variable cost?',
    answer:
      'Variable cost is the total of output-sensitive costs. When fixed costs are unchanged, ΔTC equals ΔVC, so MC = ΔVC / ΔQ.',
  },
  {
    question: 'What is the relationship between marginal cost and marginal revenue?',
    answer:
      'In standard models, an interior profit-maximizing output may satisfy MR = MC. Cost data alone cannot identify that output.',
  },
  {
    question: 'Can marginal cost be negative?',
    answer:
      'Yes mathematically when cost and quantity change in opposite directions. Interpret carefully; it is not automatic proof of profit.',
  },
  {
    question: 'Can marginal cost be zero?',
    answer:
      'Yes when ΔTC = 0 and ΔQ ≠ 0; total cost did not change over the measured output change.',
  },
  {
    question: 'What happens if the change in quantity is zero?',
    answer:
      'MC is undefined. If both ΔTC and ΔQ are zero, the result is indeterminate (0 ÷ 0).',
  },
  {
    question: 'Is marginal cost measured per unit?',
    answer:
      'Yes: it is a monetary amount per unit of the selected output measure (unit, kg, liter, etc.).',
  },
  {
    question: 'How do I calculate marginal cost from total cost?',
    answer:
      'Compute ΔTC = TC₂ − TC₁ and ΔQ = Q₂ − Q₁, then MC = ΔTC / ΔQ.',
  },
  {
    question: 'How do I calculate marginal cost for an additional 100 units?',
    answer:
      'Divide the extra total cost of producing those 100 units by 100.',
  },
  {
    question: 'Does marginal cost include fixed costs?',
    answer:
      'If fixed costs are constant, they cancel in ΔTC. If fixed costs change between observations, that change is included in ΔTC.',
  },
  {
    question: 'Can marginal cost increase as production rises?',
    answer:
      'Yes: overtime, bottlenecks, scarce inputs, and capacity limits can raise incremental cost.',
  },
  {
    question: 'Why does marginal cost decrease?',
    answer:
      'Learning effects, better utilization, process improvements, or cost-saving technology can lower incremental cost over a range.',
  },
  {
    question: 'What are economies of scale?',
    answer:
      'Falling average cost as scale expands over a relevant range; not the same as declining marginal cost alone.',
  },
  {
    question: 'What are diseconomies of scale?',
    answer:
      'Rising average cost as the organization grows, often from coordination complexity or capacity strain.',
  },
  {
    question: 'Is marginal cost the same as production cost?',
    answer:
      'No. Production (total) cost is the full cost of output; marginal cost is the incremental cost of a change in output.',
  },
  {
    question: 'Does lower marginal cost mean higher profitability?',
    answer:
      'Not by itself. Profit also depends on revenue, fixed costs, taxes, and strategy.',
  },
  {
    question: 'How can businesses reduce marginal cost?',
    answer:
      'Improve processes, cut waste, train workers, automate where justified, and optimize supply chains while monitoring quality.',
  },
  {
    question: 'What is marginal cost in microeconomics?',
    answer:
      'The derivative of total cost with respect to quantity in continuous models; this calculator uses a discrete difference quotient.',
  },
  {
    question: 'How does marginal cost affect pricing?',
    answer:
      'Prices often need to cover incremental costs at least in the short run, but demand, competition, and fixed costs also matter.',
  },
  {
    question: 'How many units should a company produce?',
    answer:
      'That depends on revenue as well as cost. A common benchmark is where MR equals MC under suitable conditions.',
  },
  {
    question: 'What does a marginal cost of $20 mean?',
    answer:
      'Over the measured interval, each additional unit raised total cost by about $20 on average.',
  },
  {
    question: 'Why is marginal cost important in manufacturing?',
    answer:
      'It helps evaluate batch expansions, overtime runs, and whether extra volume is worth the incremental spend.',
  },
  {
    question: 'What is the difference between discrete and continuous marginal cost?',
    answer:
      'Discrete MC uses ΔTC/ΔQ over an interval. Continuous MC is dTC/dQ at a point. The interval average may differ from the point derivative.',
  },
  {
    question:
      'What is marginal cost if total production cost increases by $5,000 and production increases by 250 units?',
    answer: 'MC = 5,000 ÷ 250 = $20 per unit.',
  },
  {
    question:
      'What is marginal cost if total cost decreases by $1,000 while production increases by 100 units?',
    answer:
      'MC = −1,000 ÷ 100 = −$10 per unit; total cost fell as output rose over that interval.',
  },
];
