import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RENTAL_PROPERTY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'investment-overview', label: 'Investment in a Rental Property' },
  { id: 'upkeep-expenses', label: 'Upkeep and Monthly Expenses' },
  { id: 'rental-income', label: 'Your Rental Property Income' },
  { id: 'selling-property', label: 'Selling the Property' },
  { id: 'how-to-calculate-roi', label: 'How to Calculate ROI' },
  { id: 'good-roi', label: 'What Is a Good ROI?' },
  { id: 'financing-factors', label: 'Financing and Market Factors' },
  { id: 'what-is-roi', label: 'What Is ROI in Rentals?' },
  { id: 'cash-on-cash', label: 'Cash-on-Cash Return' },
  { id: 'example-150k', label: 'ROI on a $150,000 Property' },
  { id: 'metrics-compared', label: 'Cap Rate vs CoC vs ROI' },
  { id: 'limitations', label: 'Calculator Limitations' },
  { id: 'rental-property-faq', label: 'Frequently Asked Questions' },
];

export const RENTAL_PROPERTY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate rental property ROI?',
    answer:
      'Total investment ROI typically compares overall profit to cash invested over a holding period: (cumulative operating cash flow + net sale proceeds − initial cash invested) ÷ initial cash invested × 100. Net sale proceeds should subtract selling costs and the outstanding mortgage balance.',
  },
  {
    question: 'What is a good ROI on a rental property?',
    answer:
      'There is no universal “good” ROI. Acceptable returns depend on local demand, financing costs, vacancy, maintenance risk, appreciation assumptions, and your time horizon. Compare similar deals rather than relying on a single benchmark.',
  },
  {
    question: 'How do mortgage payments affect rental property cash flow?',
    answer:
      'Annual debt service (monthly P&I × 12) is subtracted from NOI to get annual cash flow. Higher rates, longer remaining balances, or larger loans reduce cash flow even when NOI is unchanged.',
  },
  {
    question: 'What is the difference between gross rent and net operating income?',
    answer:
      'Gross rent is potential rental income before vacancy. Effective rent subtracts vacancy loss. NOI subtracts operating expenses (taxes, insurance, maintenance, HOA, management, and other operating costs) but excludes mortgage debt service.',
  },
  {
    question: 'How do I calculate cash-on-cash return?',
    answer:
      'Cash-on-Cash Return (%) = (Annual Cash Flow / Initial Cash Invested) × 100. Annual cash flow is NOI minus annual debt service. Initial cash usually includes down payment plus closing and other upfront cash costs.',
  },
  {
    question: 'Does cap rate include mortgage payments?',
    answer:
      'No. Cap rate = NOI ÷ property value. NOI excludes debt service, so cap rate is an unlevered property-level yield metric.',
  },
  {
    question: 'How does property appreciation affect investment returns?',
    answer:
      'Appreciation raises the projected selling price, which can increase net sale proceeds after costs and loan payoff. It does not change first-year cash-on-cash return unless you also change income or expenses.',
  },
  {
    question: 'What expenses should I include in rental property calculations?',
    answer:
      'Include recurring operating costs such as property tax, insurance, maintenance, HOA, management fees, and other owner-paid operating charges. Keep mortgage principal and interest separate as debt service. Model major capital improvements separately from routine maintenance.',
  },
  {
    question: 'Can a rental property have negative cash flow?',
    answer:
      'Yes. If operating expenses and debt service exceed effective rental income, annual cash flow is negative. That means the property consumes cash even if long-term appreciation might still create a positive total ROI.',
  },
  {
    question: 'What is the difference between ROI and cash-on-cash return?',
    answer:
      'Cash-on-cash return focuses on annual cash flow versus cash invested. Total ROI usually folds in multi-year cash flows and sale proceeds over a stated holding period. They answer different questions and should not be used interchangeably.',
  },
  {
    question: 'How do vacancy rates affect rental property profitability?',
    answer:
      'Vacancy reduces effective rental income, which lowers NOI, cash flow, cash-on-cash return, and cap rate. A 100% vacancy assumption drives effective rent to zero.',
  },
  {
    question: 'How do I calculate profit when selling a rental property?',
    answer:
      'Estimate selling price, subtract selling costs, then subtract the outstanding mortgage balance to get net sale proceeds. Add cumulative operating cash flow and subtract initial cash invested to estimate total investment profit before taxes.',
  },
];
