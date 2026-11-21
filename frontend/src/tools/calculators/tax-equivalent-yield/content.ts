import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TAX_EQUIVALENT_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Tax Equivalent Yield Calculator' },
  { id: 'definition', label: 'What Is Tax Equivalent Yield?' },
  { id: 'formula', label: 'Tax Equivalent Yield Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'tax-free-vs-taxable', label: 'Tax-Free vs Taxable Bonds' },
  { id: 'marginal-rate', label: 'What Is a Marginal Tax Rate?' },
  { id: 'why-matters', label: 'Why TEY Matters' },
  { id: 'example', label: 'Worked Example' },
  { id: 'compare', label: 'Comparing Bond Returns' },
  { id: 'federal-state', label: 'Federal and State Taxes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'when-to-use', label: 'When to Use This Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'tey-faq', label: 'Frequently Asked Questions' },
];

export const TAX_EQUIVALENT_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is tax equivalent yield?',
    answer:
      'Tax equivalent yield (taxable equivalent yield) is the before-tax yield a fully taxable investment must earn to match the after-tax yield of a tax-exempt investment at a given marginal tax rate.',
  },
  {
    question: 'How do I calculate taxable equivalent yield?',
    answer:
      'Divide the tax-exempt yield by one minus the marginal tax rate as a decimal: TEY = Y ÷ (1 − t). Example: 6% ÷ (1 − 0.30) ≈ 8.57%.',
  },
  {
    question: 'What is the tax equivalent yield formula?',
    answer:
      'TEY = Y_tax-free / (1 − t), where Y_tax-free is the tax-exempt yield and t is the marginal tax rate in decimal form.',
  },
  {
    question: 'What is the difference between taxable and tax-exempt yield?',
    answer:
      'Taxable yield is quoted before income tax on interest. Tax-exempt yield is typically free of specified income taxes (often federal for qualifying municipals). TEY converts a tax-exempt quote into a comparable taxable pre-tax yield.',
  },
  {
    question: 'What is a tax-free municipal bond?',
    answer:
      'A municipal bond issued by a state, local, or related authority whose interest may be exempt from federal income tax and sometimes from state or local tax for residents, subject to the bond’s and investor’s facts.',
  },
  {
    question: 'Why does the marginal tax rate matter?',
    answer:
      'The formula uses the rate that would apply to an additional dollar of taxable interest. A higher marginal rate raises TEY because more pre-tax yield is needed to match the same after-tax return.',
  },
  {
    question: 'What is the tax equivalent yield of a 6% bond at a 30% tax rate?',
    answer: 'About 8.57% (6 ÷ 0.70).',
  },
  {
    question: 'What is the tax equivalent yield of a 5% bond at a 25% tax rate?',
    answer: 'About 6.67% (5 ÷ 0.75).',
  },
  {
    question: 'What happens when the marginal tax rate is zero?',
    answer:
      'TEY equals the tax-exempt yield. With t = 0 there is no tax drag to adjust for under this simplified model.',
  },
  {
    question: 'Can tax equivalent yield be negative?',
    answer:
      'Not under this calculator’s non-negative yield and 0%–<100% tax-rate domain. Negative market yields would need a separately defined advanced mode.',
  },
  {
    question: 'Can taxable equivalent yield exceed the tax-free bond yield?',
    answer:
      'Yes whenever the tax rate is greater than zero. Investors must earn more pre-tax on taxable bonds to match tax-exempt after-tax income.',
  },
  {
    question: 'What is the difference between marginal and effective tax rates?',
    answer:
      'Marginal rate is the rate on the next dollar of taxable income. Effective rate is total tax divided by total income. TEY conventionally uses the marginal rate applicable to the interest being compared.',
  },
  {
    question: 'Are municipal bonds always tax-free?',
    answer:
      'No. Exemption depends on the bond, the tax (federal/state/local), the investor’s residence, and special rules (including possible AMT exposure for some private-activity bonds).',
  },
  {
    question: 'How do state taxes affect municipal bond yields?',
    answer:
      'In-state municipals may also be state-tax exempt for residents, while out-of-state munis may be taxable at the state level. Do not assume one combined rate without documenting deductibility and local rules.',
  },
  {
    question: 'How can I compare corporate and municipal bonds?',
    answer:
      'Compute TEY for the municipal yield at your applicable rate, then compare to the corporate’s taxable yield, and still weigh credit, duration, call features, liquidity, and fees.',
  },
  {
    question: 'Is taxable equivalent yield the same as yield to maturity?',
    answer:
      'No. TEY is a tax-adjusted comparison of yields you supply. YTM is a bond pricing yield measure. Enter consistent yield conventions on both sides of the comparison.',
  },
  {
    question: 'How do I calculate after-tax bond yield?',
    answer:
      'For a fully taxable yield Y_taxable, after-tax yield ≈ Y_taxable × (1 − t) under the same simplified assumptions used here.',
  },
  {
    question: 'Can tax equivalent yield help compare Treasury bonds?',
    answer:
      'It can help when comparing a tax-exempt municipal to a taxable Treasury at your marginal rate, but Treasuries and munis still differ in credit, liquidity, and state-tax treatment.',
  },
  {
    question: 'What risks are not included in the tax equivalent yield formula?',
    answer:
      'Credit/default risk, interest-rate and duration risk, call risk, liquidity, fees, yield-convention differences, and changing tax circumstances are outside the formula.',
  },
  {
    question: 'How does a higher tax bracket affect taxable equivalent yield?',
    answer:
      'Holding the tax-exempt yield fixed, a higher marginal rate increases TEY because the retention factor (1 − t) shrinks.',
  },
  {
    question: 'What is an implied marginal tax rate?',
    answer:
      'The breakeven tax rate that equates a given tax-exempt yield with a given taxable equivalent yield: t% = (1 − Y/TEY) × 100.',
  },
  {
    question: 'Does tax equivalent yield include inflation?',
    answer:
      'No. TEY is a nominal tax comparison. Real (inflation-adjusted) analysis requires a separate inflation adjustment.',
  },
  {
    question: 'Does the calculator account for investment fees?',
    answer:
      'No. Enter yields net of fees yourself if you want fees reflected in the comparison.',
  },
  {
    question: 'Is a higher taxable equivalent yield always better?',
    answer:
      'No. A higher TEY only means a higher taxable pre-tax hurdle for that tax-exempt quote at that rate. Bond quality and other risks still decide suitability.',
  },
  {
    question: 'What yield should I enter for a callable municipal bond?',
    answer:
      'Use a yield measure consistent with the taxable alternative (for example YTM or yield to worst). Call risk is not modeled inside the TEY formula.',
  },
];
