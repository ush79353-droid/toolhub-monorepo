import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WACC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is WACC?' },
  { id: 'formula', label: 'WACC Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate WACC' },
  { id: 'cost-of-equity', label: 'What Is the Cost of Equity?' },
  { id: 'cost-of-debt', label: 'What Is the Cost of Debt?' },
  { id: 'tax', label: 'How Does Tax Affect WACC?' },
  { id: 'market-values', label: 'Why Are Market Values Important?' },
  { id: 'interpret', label: 'How to Interpret WACC' },
  { id: 'investment', label: 'WACC and Investment Decisions' },
  { id: 'dcf', label: 'WACC in Discounted Cash Flow Valuation' },
  { id: 'vs-coe', label: 'WACC vs. Cost of Equity' },
  { id: 'vs-irr', label: 'WACC vs. IRR' },
  { id: 'drivers', label: 'What Affects WACC?' },
  { id: 'limitations', label: 'Limitations of WACC' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'wacc-faq', label: 'Frequently Asked Questions' },
];

export const WACC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is WACC?',
    answer:
      'WACC (weighted average cost of capital) is the blended required return on a company’s debt and equity capital, weighted by capital structure and usually reflecting the after-tax cost of debt.',
  },
  {
    question: 'How do you calculate WACC?',
    answer:
      'Compute equity and debt weights from total capital, multiply equity weight by cost of equity, multiply debt weight by after-tax cost of debt, and add the contributions. Example: E 700k, D 500k, Re 15%, Rd 8%, T 20% → WACC ≈ 11.42%.',
  },
  {
    question: 'What is the WACC formula?',
    answer:
      'WACC = (E/(E+D))×Re + (D/(E+D))×Rd×(1−T), where Re and Rd are financing rates as decimals and T is the tax rate as a decimal.',
  },
  {
    question: 'What is a good WACC?',
    answer:
      'There is no universal good WACC. It depends on industry risk, interest rates, leverage, tax regime, and market conditions. Compare peers and match the rate to project risk rather than chasing a single cutoff.',
  },
  {
    question: 'Is a lower WACC always better?',
    answer:
      'Not automatically. A lower WACC can reflect cheaper financing or lower perceived risk, but excessive debt that seems to lower WACC can raise financial distress risk. Context matters.',
  },
  {
    question: 'Can WACC be negative?',
    answer:
      'Mathematically yes if financing rates are negative, but that is atypical. Review inputs carefully; a negative WACC is rarely a meaningful hurdle rate.',
  },
  {
    question: 'Can WACC be zero?',
    answer:
      'Yes if both cost of equity and after-tax cost of debt contributions are zero under the selected inputs. Confirm that zero rates are intentional.',
  },
  {
    question: 'What is the difference between WACC and cost of equity?',
    answer:
      'Cost of equity is the required return for equity holders only. WACC blends equity and after-tax debt costs using capital structure weights and is typically used for firm free-cash-flow discounting.',
  },
  {
    question: 'What is the difference between WACC and IRR?',
    answer:
      'IRR is a project’s internal rate of return. WACC is a cost-of-capital estimate often used as a hurdle or discount rate. Comparing IRR to WACC requires risk and financing assumptions to be compatible.',
  },
  {
    question: 'Why is the cost of debt adjusted for taxes?',
    answer:
      'Interest is often tax-deductible, so the effective after-tax debt cost is Rd×(1−T) when a usable tax shield exists. Losses or deduction limits can reduce that benefit.',
  },
  {
    question: 'How does increasing debt affect WACC?',
    answer:
      'More debt raises the debt weight and can lower WACC if after-tax debt is cheaper than equity — but higher leverage may also raise both Re and Rd, so the net effect is not automatic.',
  },
  {
    question: 'Should WACC use book values or market values?',
    answer:
      'Market-value weights are generally preferred. Book values are a common approximation when market debt or equity is unavailable, with clear disclosure of the limitation.',
  },
  {
    question: 'How is the cost of equity calculated?',
    answer:
      'A common approach is CAPM: Re = Rf + β×(Rm−Rf). Other methods include build-up or implied cost of equity. Inputs are estimates and can vary.',
  },
  {
    question: 'How do you estimate the cost of debt?',
    answer:
      'Prefer current market yields on the company’s debt (or comparable debt). Historical coupon rates may understate today’s required yield.',
  },
  {
    question: 'How is WACC used in DCF valuation?',
    answer:
      'WACC often discounts free cash flow to the firm (FCFF) when financing and risk assumptions match. Enterprise value is the present value of projected FCFF plus terminal value discounted at WACC.',
  },
  {
    question: 'Why does WACC differ between industries?',
    answer:
      'Industries differ in operating risk, typical leverage, asset intensity, and credit spreads — all of which feed into Re, Rd, and capital structure weights.',
  },
  {
    question: 'What happens to WACC when interest rates rise?',
    answer:
      'Higher rates can lift Rd and often the risk-free component of Re, tending to increase WACC, though company-specific credit and equity risk premiums also matter.',
  },
  {
    question: 'Can WACC be used for startup companies?',
    answer:
      'With caution. Startups may lack stable capital structures, observable debt yields, or reliable betas. Stage-specific required returns or venture methods are often more appropriate.',
  },
  {
    question: 'Should I use the marginal or effective tax rate?',
    answer:
      'For WACC tax shields, the marginal rate applicable to incremental interest is commonly preferred. Effective rates from accounting can differ and may not reflect future deductibility.',
  },
  {
    question: 'How often should a company recalculate WACC?',
    answer:
      'Recalculate when market rates, credit spreads, equity risk premiums, capital structure, or tax rules change materially — and whenever a major investment decision needs an updated hurdle rate.',
  },
];
