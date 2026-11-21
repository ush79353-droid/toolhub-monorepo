import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARKDOWN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Markdown Calculator' },
  { id: 'what-is', label: 'What Is Markdown?' },
  { id: 'process', label: 'Markdown Calculation Process' },
  { id: 'example', label: 'How to Use This Calculator' },
  { id: 'formula', label: 'Markdown Price Formula' },
  { id: 'percentage', label: 'Markdown Percentage' },
  { id: 'original', label: 'Original Price Before Markdown' },
  { id: 'profit', label: 'How Markdown Affects Profit' },
  { id: 'vs-markup', label: 'Markdown vs. Markup' },
  { id: 'vs-margin', label: 'Markdown vs. Profit Margin' },
  { id: 'reasons', label: 'Why Retailers Use Markdowns' },
  { id: 'choose', label: 'Choosing an Appropriate Markdown' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'md-faq', label: 'Frequently Asked Questions' },
];

export const MARKDOWN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is markdown in retail?',
    answer:
      'A markdown is a reduction from a product’s original (list) selling price to a lower actual selling price.',
  },
  {
    question: 'How do you calculate markdown?',
    answer: 'Markdown amount = Original selling price − Actual selling price.',
  },
  {
    question: 'How do you calculate markdown percentage?',
    answer:
      'Markdown% = Markdown ÷ Original selling price × 100. Always use the original price as the denominator.',
  },
  {
    question: 'What is a 20% markdown on $100?',
    answer: 'Markdown = $20. Actual selling price = $80.',
  },
  {
    question: 'What is a 25% markdown on $200?',
    answer: 'Markdown = $50. Actual selling price = $150.',
  },
  {
    question: 'How much is a 30% markdown on $150?',
    answer: 'Markdown = $45. Final price = $105.',
  },
  {
    question: 'How do I find the original price after a markdown?',
    answer:
      'If you know actual price and markdown amount: Original = Actual + Markdown. If you know actual and markdown %: Original = Actual ÷ (1 − Markdown%/100), provided Markdown% < 100.',
  },
  {
    question: 'Is markdown the same as discount?',
    answer:
      'In everyday retail language they often overlap. Markdown typically emphasizes a cut from a previously established selling price; “discount” may also describe coupons or temporary promotions. The basic reduction math is similar.',
  },
  {
    question: 'What is the difference between markdown and markup?',
    answer:
      'Markdown reduces a selling price relative to the original list price. Markup raises price relative to cost to set or analyze selling price.',
  },
  {
    question: 'Can markdown percentage exceed 100%?',
    answer:
      'In standard retail mode (nonnegative prices), markdown cannot exceed 100% of the original price without going negative. This calculator caps the percentage at 0–100%.',
  },
  {
    question: 'What happens when markdown is zero?',
    answer:
      'Original and actual selling prices are equal; markdown amount and percentage are both zero.',
  },
  {
    question: 'Can markdown cause a loss?',
    answer:
      'Yes. If the reduced selling price falls below the product’s relevant cost, unit gross profit turns negative even though markdown % is well defined.',
  },
  {
    question: 'How do markdowns affect profit margins?',
    answer:
      'Lower selling prices reduce revenue per unit. Margin on the new price depends on cost. Higher volume may or may not offset the lower per-unit profit.',
  },
  {
    question: 'Why do retailers use markdowns?',
    answer:
      'To clear seasonal stock, compete on price, move slow inventory, attract shoppers, and manage product lifecycle.',
  },
  {
    question: 'How can I calculate markdown without a calculator?',
    answer:
      'Subtract actual from original for the amount. Divide that amount by the original and multiply by 100 for the percentage.',
  },
  {
    question: 'What is the markdown if a $200 product sells for $160?',
    answer: 'Markdown = $40. Markdown percentage = 20%.',
  },
  {
    question: 'Can I calculate the original price using markdown percentage?',
    answer:
      'Yes, when you also know the actual selling price (or the markdown amount). A percentage alone is not enough.',
  },
  {
    question: 'Is markdown calculated before or after sales tax?',
    answer:
      'Retail markdown is usually computed from selling prices. Whether tax applies to the marked-down price depends on jurisdiction and transaction details.',
  },
];
