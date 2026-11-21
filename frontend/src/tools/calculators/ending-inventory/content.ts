import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ENDING_INVENTORY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ending-inventory', label: 'What Is Ending Inventory?' },
  { id: 'formula', label: 'Ending Inventory Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Ending Inventory' },
  { id: 'worked-example', label: 'Ending Inventory Calculation Example' },
  { id: 'inventory-turnover', label: 'What Is Inventory Turnover?' },
  { id: 'how-turnover', label: 'How to Calculate Inventory Turnover' },
  { id: 'cogs-unknown', label: 'When COGS Is Unknown' },
  { id: 'other-methods', label: 'Other Ending Inventory Methods' },
  { id: 'fifo-lifo', label: 'FIFO vs LIFO' },
  { id: 'why-matters', label: 'Why Ending Inventory Matters' },
  { id: 'increase', label: 'What Causes Ending Inventory to Increase?' },
  { id: 'decrease', label: 'What Causes Ending Inventory to Decrease?' },
  { id: 'mistakes', label: 'Common Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ending-inventory-faq', label: 'Frequently Asked Questions' },
];

export const ENDING_INVENTORY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ending inventory?',
    answer:
      'Ending inventory is the value of goods and materials remaining in inventory at the end of an accounting period.',
  },
  {
    question: 'How do I calculate ending inventory?',
    answer:
      'Add starting inventory and net purchases, then subtract cost of goods sold (COGS).',
  },
  {
    question: 'What is the ending inventory formula?',
    answer:
      'Ending Inventory = Starting Inventory + Net Purchases − COGS.',
  },
  {
    question: 'Is ending inventory a current asset?',
    answer:
      'Yes. Inventory is typically reported as a current asset on the balance sheet when it is expected to be sold or used within the operating cycle.',
  },
  {
    question: 'Can ending inventory be zero?',
    answer:
      'Yes. A zero ending balance means the inventory-flow equation indicates no remaining stock; it does not by itself prove efficient operations.',
  },
  {
    question: 'Can ending inventory be negative?',
    answer:
      'A negative calculated balance under this simplified model usually means entered costs exceed available inventory. It is not a valid physical inventory balance and should be investigated.',
  },
  {
    question: 'What is the difference between beginning and ending inventory?',
    answer:
      'Beginning (starting) inventory is the opening balance; ending inventory is the closing balance after purchases and COGS for the period.',
  },
  {
    question: 'How do I calculate inventory turnover?',
    answer:
      'Inventory Turnover = COGS ÷ Average Inventory, where Average Inventory = (Starting + Ending) ÷ 2. The ratio is dimensionless.',
  },
  {
    question: 'What happens when COGS is unknown?',
    answer:
      'If you know inventory turnover, COGS can be estimated as T(2B + P) / (T + 2), then ending inventory = B + P − COGS.',
  },
  {
    question: 'Is COGS the same as sales revenue?',
    answer:
      'No. COGS is the cost of inventory sold; sales revenue is the amount charged to customers. Do not substitute revenue for COGS.',
  },
  {
    question: 'What does high inventory turnover mean?',
    answer:
      'Inventory is sold more frequently relative to its average value. Very high turnover can also signal insufficient stock.',
  },
  {
    question: 'What does low inventory turnover mean?',
    answer:
      'Inventory moves more slowly relative to its average value. Seasonal and industry factors matter; avoid universal thresholds.',
  },
  {
    question: 'How does FIFO affect ending inventory?',
    answer:
      'Under FIFO (first-in, first-out), ending inventory tends to reflect more recent purchase costs when prices change.',
  },
  {
    question: 'How does LIFO affect ending inventory?',
    answer:
      'Under LIFO (last-in, first-out), ending inventory tends to reflect older costs. LIFO is not permitted under IFRS but may be allowed under US GAAP.',
  },
  {
    question: 'How do purchase returns affect net purchases?',
    answer:
      'Returns, allowances, and discounts reduce net purchases (and freight-in may increase them).',
  },
  {
    question: 'How does ending inventory affect COGS?',
    answer:
      'Higher ending inventory (all else equal) implies lower COGS in the inventory-flow equation; lower ending inventory implies higher COGS.',
  },
  {
    question: 'Why is ending inventory important?',
    answer:
      'It affects balance-sheet valuation, profit measurement through COGS, working capital, purchasing, and cash-flow planning.',
  },
  {
    question: 'What happens when average inventory is zero?',
    answer:
      'Inventory turnover is undefined. Do not display Infinity: the ratio is unavailable.',
  },
  {
    question:
      'What is ending inventory if beginning inventory is $50,000, net purchases are $80,000, and COGS is $100,000?',
    answer: 'Ending inventory = 50,000 + 80,000 − 100,000 = $30,000.',
  },
];
