import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Intrinsic Value?' },
  { id: 'how-to-calculate', label: 'How to Calculate the Intrinsic Value of a Stock' },
  { id: 'how-to-use', label: 'How to Use the Online Intrinsic Value Calculator' },
  { id: 'margin-of-safety', label: 'What Is the Margin of Safety?' },
  { id: 'pick-stock', label: 'How to Use Intrinsic Value to Pick a Stock' },
  { id: 'example', label: 'Example of Intrinsic Value Calculation' },
  { id: 'limitations', label: 'Limitations of Intrinsic Value Calculations' },
  { id: 'iv-faq', label: 'Frequently Asked Questions' },
];

export const IV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the intrinsic value of a stock?',
    answer:
      'Intrinsic value is an estimate of a stock’s underlying economic worth based on assumptions about earnings, growth, risk, and other fundamentals — not the same as the market price.',
  },
  {
    question: 'How do I find the intrinsic value of a stock?',
    answer:
      'This calculator uses V = EPS × (8.5 + 2g) × 4.4 ÷ Y with percentage-point growth and bond yield. Other methods include discounted cash flow and relative multiples.',
  },
  {
    question: 'What is margin of safety?',
    answer:
      'Margin of safety = (V − CMP) ÷ V × 100. A positive value means the market price is below estimated intrinsic value under the chosen assumptions.',
  },
  {
    question: 'How do I calculate the P/E ratio?',
    answer:
      'P/E = Market Price per Share ÷ EPS. It is a relative multiple, not the same as the Graham intrinsic-value estimate.',
  },
  {
    question: 'What is the difference between intrinsic value and market value?',
    answer:
      'Market value is what buyers and sellers agree to pay today. Intrinsic value is an analytical estimate that may be higher or lower for long periods.',
  },
  {
    question: 'Can intrinsic value be negative?',
    answer:
      'Some models can produce negative estimates. This Graham-style formula requires positive EPS and is not appropriate for loss-making companies.',
  },
  {
    question: 'What is a good margin of safety?',
    answer:
      'It depends on uncertainty, business quality, and investment approach. Larger cushions are often sought when forecasts are less reliable — there is no universal threshold.',
  },
  {
    question: 'How does growth rate affect intrinsic value?',
    answer:
      'In this model, higher g increases the (8.5 + 2g) multiplier, which raises estimated V when other inputs are unchanged.',
  },
  {
    question: 'Why does bond yield affect intrinsic value?',
    answer:
      'Y is in the denominator. Higher corporate bond yields reduce estimated V; lower yields increase it, all else equal.',
  },
  {
    question: 'Is intrinsic value the same as fair market value?',
    answer:
      'No. Fair market value usually refers to an arm’s-length transaction price. Intrinsic value is an analytical estimate that can diverge from market prices.',
  },
  {
    question: 'Does this calculator predict stock prices?',
    answer:
      'No. It produces a valuation estimate under stated assumptions. It does not forecast future market prices.',
  },
  {
    question: 'Can I use this calculator for every company?',
    answer:
      'Not reliably. Negative earnings, highly cyclical results, banks, and many asset-light growth businesses often need different methods.',
  },
];
