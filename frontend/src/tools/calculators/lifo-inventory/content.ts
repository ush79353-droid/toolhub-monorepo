import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LIFO_INVENTORY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lifo', label: 'What Is LIFO?' },
  { id: 'how-lifo-works', label: 'How Does the LIFO Method Work?' },
  { id: 'cogs-formula', label: 'LIFO Cost of Goods Sold Formula' },
  { id: 'ending-inventory', label: 'How to Calculate Ending Inventory Using LIFO' },
  { id: 'how-to-use', label: 'How to Use the LIFO Calculator' },
  { id: 'worked-example', label: 'Complete LIFO Calculation Example' },
  { id: 'vs-fifo', label: 'LIFO vs FIFO' },
  { id: 'vs-average', label: 'LIFO vs Weighted Average Cost' },
  { id: 'gross-profit', label: 'How LIFO Affects Gross Profit' },
  { id: 'ending-effects', label: 'How LIFO Affects Ending Inventory' },
  { id: 'inflation', label: 'LIFO and Inventory Inflation' },
  { id: 'taxes', label: 'LIFO and Income Taxes' },
  { id: 'ifrs', label: 'Is LIFO Allowed Under IFRS?' },
  { id: 'us-gaap', label: 'Is LIFO Allowed Under US GAAP?' },
  { id: 'lifo-reserve', label: 'What Is a LIFO Reserve?' },
  { id: 'liquidation', label: 'What Is LIFO Liquidation?' },
  { id: 'advantages', label: 'Advantages of LIFO' },
  { id: 'disadvantages', label: 'Disadvantages of LIFO' },
  { id: 'mistakes', label: 'Common LIFO Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'lifo-faq', label: 'Frequently Asked Questions' },
];

export const LIFO_INVENTORY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does LIFO stand for?',
    answer: 'LIFO stands for Last In, First Out.',
  },
  {
    question: 'What is LIFO in accounting?',
    answer:
      'LIFO is an inventory cost-flow assumption that assigns the most recently acquired inventory costs to Cost of Goods Sold first.',
  },
  {
    question: 'How does LIFO inventory costing work?',
    answer:
      'Sold units are costed from the newest purchase layer first, then older layers. Remaining older costs stay in ending inventory.',
  },
  {
    question: 'What is the LIFO formula?',
    answer:
      'COGS = Σ (units sold from each layer × that layer’s unit cost), depleting newest layers first.',
  },
  {
    question: 'How do I calculate LIFO COGS?',
    answer:
      'Allocate units sold to the newest batch until it is exhausted, then to older batches, and sum quantity × unit cost for each allocation.',
  },
  {
    question: 'How do I calculate ending inventory using LIFO?',
    answer:
      'Ending inventory = remaining units in each layer × that layer’s unit cost, or total purchase cost − LIFO COGS.',
  },
  {
    question: 'What is the difference between LIFO and FIFO?',
    answer:
      'LIFO costs newest units first; FIFO costs oldest units first. Ending inventory and COGS generally differ when purchase prices change.',
  },
  {
    question: 'Which inventory is sold first under LIFO?',
    answer:
      'For costing purposes, the newest purchase layer. That does not require the newest physical units to ship first.',
  },
  {
    question: 'Does LIFO mean the newest physical items are shipped first?',
    answer:
      'No. LIFO is a cost-flow assumption, not a warehouse shipping rule.',
  },
  {
    question: 'How does LIFO affect gross profit?',
    answer:
      'When purchase costs rise, LIFO often raises COGS and lowers gross profit versus FIFO for the same sales; outcomes reverse if costs fall.',
  },
  {
    question: 'How does LIFO affect inventory valuation?',
    answer:
      'Ending inventory tends to retain older cost layers, which can understate current replacement cost when prices rise.',
  },
  {
    question: 'Does LIFO increase COGS?',
    answer:
      'When newer costs are higher than older costs, yes for a given sales quantity. It is not automatic in all price environments.',
  },
  {
    question: 'Does LIFO always reduce profit?',
    answer: 'No. Effects depend on whether inventory purchase costs are rising or falling.',
  },
  {
    question: 'What happens when inventory prices rise?',
    answer:
      'LIFO typically reports higher COGS and lower ending inventory than FIFO for comparable activity.',
  },
  {
    question: 'What happens when inventory prices fall?',
    answer:
      'LIFO may report lower COGS and higher ending inventory than FIFO.',
  },
  {
    question: 'Is LIFO permitted under IFRS?',
    answer: 'No. IFRS does not permit LIFO as an inventory cost formula.',
  },
  {
    question: 'Is LIFO permitted under US GAAP?',
    answer:
      'Yes, when applicable US GAAP requirements are met. This calculator does not determine eligibility.',
  },
  {
    question: 'What is a LIFO reserve?',
    answer:
      'LIFO reserve ≈ FIFO inventory − LIFO inventory. This tool does not compute a reserve without a FIFO comparison.',
  },
  {
    question: 'What is LIFO liquidation?',
    answer:
      'When inventory quantities decline enough that older, often lower-cost layers enter COGS, which can temporarily raise reported profit.',
  },
  {
    question: 'Can LIFO ending inventory be zero?',
    answer: 'Yes, when all purchased units are sold.',
  },
  {
    question: 'What happens when all purchased inventory is sold?',
    answer: 'COGS equals total purchase cost and ending inventory is zero.',
  },
  {
    question: 'Can COGS be zero?',
    answer: 'Yes, when units sold are zero.',
  },
  {
    question: 'What is the difference between LIFO and weighted-average costing?',
    answer:
      'Weighted average blends unit costs into one average; LIFO keeps distinct layers and depletes newest first.',
  },
  {
    question: 'How do I calculate gross margin using LIFO?',
    answer:
      'Gross margin = (Revenue − LIFO COGS) ÷ Revenue × 100. Undefined when revenue is zero.',
  },
  {
    question: 'How does LIFO affect taxes?',
    answer:
      'Where permitted, higher COGS can reduce taxable income in rising-cost periods, subject to jurisdiction-specific rules. Not universal advice.',
  },
  {
    question: 'Can LIFO be used for perishable inventory?',
    answer:
      'Physical flow for perishables often follows FIFO; LIFO may still be a costing election where allowed, independent of shipping practice.',
  },
  {
    question: 'Why are inventory purchase layers important?',
    answer:
      'Layers preserve unit costs by purchase so LIFO/FIFO can assign the correct costs to COGS and ending inventory.',
  },
  {
    question: 'Can I calculate LIFO using multiple purchase batches?',
    answer:
      'Yes in principle. This calculator implements the two-batch reference model.',
  },
  {
    question: 'Does LIFO affect revenue?',
    answer:
      'No. Revenue = units sold × selling price. Cost-flow method affects COGS and inventory, not the sales total.',
  },
  {
    question: 'What happens if units sold exceed units purchased?',
    answer:
      'The sale is invalid for this model: the calculator blocks insufficient inventory rather than creating negative stock.',
  },
  {
    question:
      'What is the LIFO COGS if a business buys 10 units at $10 and another 10 units at $15, then sells 12 units?',
    answer:
      '10 newest × $15 + 2 older × $10 = $170 COGS; ending inventory = 8 × $10 = $80.',
  },
];
