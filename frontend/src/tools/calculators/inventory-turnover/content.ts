import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INVENTORY_TURNOVER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-inventory', label: 'What Is Inventory?' },
  { id: 'current-assets', label: 'Inventory as a Current Asset' },
  { id: 'efficiency-ratio', label: 'Inventory Turnover as an Efficiency Ratio' },
  { id: 'turnover-formula', label: 'Inventory Turnover Formula' },
  { id: 'average-formula', label: 'Average Inventory Formula' },
  { id: 'days-formula', label: 'Inventory Days Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Inventory Turnover' },
  { id: 'worked-example', label: 'Complete Inventory Turnover Example' },
  { id: 'investors', label: 'What Does Inventory Turnover Tell Investors?' },
  { id: 'interpret', label: 'How to Interpret High and Low Turnover' },
  { id: 'good-ratio', label: 'What Is a Good Inventory Turnover Ratio?' },
  { id: 'cash-flow', label: 'How Inventory Turnover Affects Cash Flow' },
  { id: 'vs-dio', label: 'Inventory Turnover and Days Inventory Outstanding' },
  { id: 'vs-asset', label: 'Inventory Turnover vs Asset Turnover' },
  { id: 'improve', label: 'How to Improve Inventory Turnover' },
  { id: 'mistakes', label: 'Common Inventory Turnover Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'inv-faq', label: 'Frequently Asked Questions' },
];

export const INVENTORY_TURNOVER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is inventory turnover?',
    answer:
      'Inventory turnover measures how many times a business sells or uses its average inventory during an accounting period, typically COGS ÷ average inventory.',
  },
  {
    question: 'What is the inventory turnover formula?',
    answer: 'Inventory Turnover = Cost of Goods Sold ÷ Average Inventory.',
  },
  {
    question: 'How do I calculate inventory turnover?',
    answer:
      'Average beginning and ending inventory, then divide COGS for the same period by that average. Do not divide by zero average inventory.',
  },
  {
    question: 'How do I calculate average inventory?',
    answer:
      'Average Inventory = (Beginning Inventory + Ending Inventory) ÷ 2 for the reporting period.',
  },
  {
    question: 'What does inventory turnover of 5 mean?',
    answer:
      'COGS was about five times average inventory value during the period — not that every physical unit turned exactly five times.',
  },
  {
    question: 'What is a good inventory turnover ratio?',
    answer:
      'It depends on industry, product shelf life, seasonality, and strategy. Avoid universal good/bad thresholds.',
  },
  {
    question: 'Is higher inventory turnover always better?',
    answer:
      'No. Very high turnover can free cash but may increase stockout risk. Context matters.',
  },
  {
    question: 'Can inventory turnover be zero?',
    answer:
      'Yes, when COGS is zero and average inventory is positive — the business did not recognize cost of sales against that stock base.',
  },
  {
    question: 'Can inventory turnover be negative?',
    answer:
      'Not under the standard nonnegative COGS and inventory model used here. Negative inputs are rejected.',
  },
  {
    question: 'What happens when average inventory is zero?',
    answer:
      'Turnover is undefined. Do not display Infinity. Inventory days may show 0 when COGS is positive under the direct formula.',
  },
  {
    question: 'What are inventory days?',
    answer:
      'The average number of days inventory is held: (Average Inventory ÷ COGS) × Days in period — also called DIO or DSI.',
  },
  {
    question: 'What is the inventory days formula?',
    answer:
      'Inventory Days = (Average Inventory ÷ COGS) × Days, or equivalently Days ÷ Inventory Turnover when turnover is defined.',
  },
  {
    question: 'How is inventory turnover related to DIO?',
    answer:
      'Inventory days from this calculator can represent Days Inventory Outstanding under a consistent COGS-based definition.',
  },
  {
    question: 'Is inventory turnover the same as inventory days?',
    answer:
      'No. Turnover is a multiple; inventory days is a holding period. They are inverse-related when both are defined.',
  },
  {
    question: 'Why do we use COGS instead of sales?',
    answer:
      'COGS matches inventory at cost. Revenue includes margin and can distort the efficiency ratio.',
  },
  {
    question:
      'What is the difference between inventory turnover and asset turnover?',
    answer:
      'Inventory turnover uses COGS ÷ average inventory. Asset turnover generally uses revenue ÷ average total assets.',
  },
  {
    question: 'How does inventory turnover affect cash flow?',
    answer:
      'Faster turns can reduce cash tied in stock and shorten the cash conversion cycle when other working-capital days hold.',
  },
  {
    question: 'How does seasonal demand affect inventory turnover?',
    answer:
      'Seasonal builds can lower turnover in quiet periods and raise it in peak periods — compare like periods and peers.',
  },
  {
    question: 'Can inventory turnover be calculated monthly?',
    answer:
      'Yes, using monthly COGS and inventory balances with the matching number of days (for example about 30).',
  },
  {
    question: 'How do I calculate quarterly inventory turnover?',
    answer:
      'Use quarterly COGS, beginning and ending inventory for the quarter, and days ≈ 90.',
  },
  {
    question: 'How do inventory valuation methods affect turnover?',
    answer:
      'FIFO, weighted average, and other methods change COGS and inventory balances, so turnover can differ under the same physical flows.',
  },
  {
    question: 'How can a company improve inventory turnover?',
    answer:
      'Improve forecasting, reduce obsolete stock, tighten replenishment, align assortment with demand, and coordinate with suppliers.',
  },
  {
    question: 'Does high inventory turnover mean higher profit?',
    answer:
      'Not necessarily. Turnover measures inventory efficiency relative to COGS, not margins or net income.',
  },
  {
    question: 'What does low inventory turnover indicate?',
    answer:
      'Slower movement that may reflect excess stock, weak demand, long production cycles, or intentional seasonal builds.',
  },
  {
    question: 'How does inventory turnover affect working capital?',
    answer:
      'Lower inventory investment for a given sales/COGS level can free working capital; higher stock levels tie up more cash.',
  },
  {
    question: 'Why is average inventory used instead of ending inventory?',
    answer:
      'A two-point average better represents inventory held over the period when balances change between opening and closing.',
  },
  {
    question:
      'What is inventory turnover if COGS is $500,000 and average inventory is $100,000?',
    answer:
      'Turnover = 500,000 / 100,000 = 5.00×. With 365 days, inventory days = 365 / 5 = 73 days.',
  },
];
