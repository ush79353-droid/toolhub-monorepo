import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-arv', label: 'What Is After Repair Value (ARV)?' },
  { id: 'how-to-calculate-arv', label: 'How to Calculate After Repair Value' },
  { id: 'seventy-percent-rule', label: 'What Is the 70% Rule in Real Estate?' },
  { id: 'how-to-use', label: 'How to Use the ARV Calculator' },
  { id: 'arv-formulas', label: 'ARV Calculation Formulas' },
  { id: 'arv-vs-market-value', label: 'ARV vs. Market Value' },
  { id: 'arv-limitations', label: 'Limitations of ARV Estimates' },
  { id: 'arv-faq', label: 'Frequently Asked Questions' },
];

export const ARV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ARV in real estate?',
    answer:
      'ARV (after repair value) is an estimate of what a property should be worth after planned renovations are finished. Investors use it to judge whether a flip or value-add deal can leave enough margin after purchase price and renovation cost.',
  },
  {
    question: 'What is the difference between market value and after repair value?',
    answer:
      'Current market value (or as-is value) reflects the property today, including deferred maintenance. After repair value is the projected market value once the planned improvements are complete. ARV is still a market estimate — it is not a guarantee of a future sale price.',
  },
  {
    question: 'How do I calculate ARV?',
    answer:
      'A simple planning formula is ARV = current property value + value added by renovations. Example: if the as-is value is $300,000 and renovations are expected to add $50,000 of market value, ARV = $350,000. Prefer comps of renovated properties when you can.',
  },
  {
    question:
      'What is the ARV if a property is worth $400,000 and renovations add $100,000?',
    answer: 'ARV = $400,000 + $100,000 = $500,000.',
  },
  {
    question: 'What is the 70% rule for house flipping?',
    answer:
      'A common heuristic sets the maximum offer near 70% of ARV minus renovation cost: Maximum bid = (ARV × 0.70) − renovation cost. The percentage is a rule of thumb, not a universal standard — adjust for market heat, risk, and transaction costs.',
  },
  {
    question: 'Is renovation cost the same as renovation value?',
    answer:
      'No. Renovation cost is what you spend. Renovation value is how much the market value rises. Over-improvements, poor comps, or soft markets can leave value below cost; strong demand or underpriced properties can raise value above cost.',
  },
  {
    question: 'How do I calculate ROI on a renovated property?',
    answer:
      'A simplified gross ROI is (ARV − purchase price − renovation cost) ÷ (purchase price + renovation cost) × 100. This calculator’s ROI excludes financing interest, holding costs, closing costs, selling commissions, and taxes unless you model them separately.',
  },
];
