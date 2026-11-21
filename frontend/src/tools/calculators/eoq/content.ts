import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EOQ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'eoq-meaning', label: 'The EOQ Meaning' },
  { id: 'how-to-calculate', label: 'How to Calculate EOQ' },
  { id: 'eoq-formula', label: 'The EOQ Formula' },
  { id: 'worked-example', label: 'Complete EOQ Calculation Example' },
  { id: 'why-important', label: 'Why Is EOQ Important?' },
  { id: 'ordering-vs-holding', label: 'Ordering Cost vs Holding Cost' },
  { id: 'annual-ordering', label: 'Annual Ordering Cost' },
  { id: 'annual-holding', label: 'Annual Holding Cost' },
  { id: 'total-cost', label: 'Total Annual Inventory Cost' },
  { id: 'orders-per-year', label: 'How Many Orders Per Year?' },
  { id: 'vs-reorder', label: 'EOQ vs Reorder Point' },
  { id: 'vs-safety', label: 'EOQ vs Safety Stock' },
  { id: 'assumptions', label: 'EOQ Assumptions' },
  { id: 'when-not-suitable', label: 'When Is EOQ Not Suitable?' },
  { id: 'mistakes', label: 'Common EOQ Calculation Mistakes' },
  { id: 'limitations', label: 'EOQ Limitations' },
  { id: 'eoq-faq', label: 'Frequently Asked Questions' },
];

export const EOQ_FAQS: readonly FAQItem[] = [
  {
    question: 'What does EOQ stand for?',
    answer: 'EOQ stands for Economic Order Quantity.',
  },
  {
    question: 'What is Economic Order Quantity?',
    answer:
      'Economic Order Quantity is the theoretically optimal order size that minimizes the combined annual ordering and inventory holding costs under the classical EOQ model.',
  },
  {
    question: 'How do I calculate EOQ?',
    answer:
      'Enter annual demand (D), fixed order cost (S), and annual holding cost per unit (H), then compute EOQ = √(2DS / H).',
  },
  {
    question: 'What is the EOQ formula?',
    answer: 'EOQ = √(2 × Annual Demand × Order Cost ÷ Annual Holding Cost per Unit).',
  },
  {
    question: 'Why is EOQ important?',
    answer:
      'It helps balance ordering frequency against holding costs for inventory planning, purchasing efficiency, and working-capital management under simplified assumptions.',
  },
  {
    question: 'What is ordering cost?',
    answer:
      'The fixed cost of placing and processing one replenishment order; not the purchase price of the goods themselves.',
  },
  {
    question: 'What is holding cost?',
    answer:
      'The annual cost of keeping one unit in inventory (storage, insurance, financing, handling, obsolescence, shrinkage).',
  },
  {
    question: 'What happens when ordering costs increase?',
    answer:
      'All else equal, EOQ rises; larger, less frequent orders become more economical.',
  },
  {
    question: 'What happens when holding costs increase?',
    answer:
      'All else equal, EOQ falls; smaller, more frequent orders reduce average inventory.',
  },
  {
    question: 'Can EOQ be zero?',
    answer:
      'Not under positive demand, order cost, and holding cost. Zero demand or zero order cost yields no positive classical EOQ.',
  },
  {
    question: 'Can EOQ be negative?',
    answer:
      'No. The square-root formula produces a nonnegative result; invalid inputs are rejected rather than returning a negative EOQ.',
  },
  {
    question: 'Does EOQ include purchase price?',
    answer:
      'No. Classical EOQ optimizes ordering and holding costs only. Purchase cost DP is separate unless you add it as an optional total-cost extension.',
  },
  {
    question: 'What is the difference between EOQ and reorder point?',
    answer:
      'EOQ answers how much to order. The reorder point answers when to order (typically daily demand × lead time + safety stock).',
  },
  {
    question: 'How do I calculate annual ordering cost?',
    answer: 'Annual Ordering Cost = (Demand ÷ Order Quantity) × Order Cost.',
  },
  {
    question: 'How do I calculate annual holding cost?',
    answer:
      'Annual Holding Cost = (Order Quantity ÷ 2) × Holding Cost per Unit (cycle inventory without safety stock).',
  },
  {
    question:
      'What is the relationship between ordering and holding costs at EOQ?',
    answer:
      'Under the classical model, annual ordering cost equals annual cycle-inventory holding cost at the optimum.',
  },
  {
    question: 'How many orders should I place per year?',
    answer: 'Orders per year ≈ Annual Demand ÷ EOQ (an estimate under continuous demand).',
  },
  {
    question: 'Can EOQ be used for seasonal inventory?',
    answer:
      'Classical EOQ assumes relatively steady demand. Strong seasonality usually needs adjusted or multi-period planning.',
  },
  {
    question: 'What are the limitations of EOQ?',
    answer:
      'It ignores quantity discounts, capacity limits, perishability, highly variable demand/lead times, and many operational constraints.',
  },
  {
    question: 'Should I round EOQ to a whole number?',
    answer:
      'When items must be ordered in whole units, compare nearby feasible integers using total variable cost TC(Q) = (D/Q)S + (Q/2)H and pick the lower-cost quantity.',
  },
  {
    question:
      'What is EOQ if annual demand is 10,000 units, ordering cost is $50, and annual holding cost is $2 per unit?',
    answer: 'EOQ = √((2 × 10,000 × 50) / 2) = √500,000 ≈ 707.11 units.',
  },
];
