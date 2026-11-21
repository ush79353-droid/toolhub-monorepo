import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_SPREAD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Credit Spread Calculator' },
  { id: 'definition', label: 'What Is a Credit Spread?' },
  { id: 'formula', label: 'Credit Spread Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'basis-points', label: 'Credit Spread in Basis Points' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'interpret', label: 'How to Interpret Spreads' },
  { id: 'drivers', label: 'What Causes Spreads to Widen or Narrow?' },
  { id: 'vs-yield-spread', label: 'Credit Spread vs Yield Spread' },
  { id: 'vs-risk-free', label: 'Credit Spread vs Risk-Free Rate' },
  { id: 'vs-premium', label: 'Credit Spread vs Credit Risk Premium' },
  { id: 'measures', label: 'G-Spread, I-Spread, Z-Spread, and OAS' },
  { id: 'ig-vs-hy', label: 'Investment-Grade vs High-Yield' },
  { id: 'investors', label: 'How Investors Use Credit Spreads' },
  { id: 'limitations', label: 'Limitations of Credit Spread Analysis' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'credit-spread-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_SPREAD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a credit spread?',
    answer:
      'A credit spread is the yield difference between a riskier bond (often corporate) and a comparable government or other benchmark bond, usually expressed in percentage points or basis points.',
  },
  {
    question: 'How do you calculate a credit spread?',
    answer:
      'Subtract the government (or benchmark) bond yield from the corporate bond yield using the same yield convention: CS = Y_c − Y_g. Convert to basis points by multiplying percentage points by 100.',
  },
  {
    question: 'What is the credit spread formula?',
    answer:
      'CS = Y_c − Y_g, where CS is the credit spread in percentage points, Y_c is the corporate bond yield, and Y_g is the government bond yield. CS_bps = CS × 100.',
  },
  {
    question: 'How do you calculate credit spread in basis points?',
    answer:
      'First compute the spread in percentage points, then multiply by 100. Example: 3.50 percentage points × 100 = 350 basis points.',
  },
  {
    question: 'What does a 100-basis-point credit spread mean?',
    answer:
      'One hundred basis points equals one percentage point. A 100 bps spread means the corporate bond’s quoted yield is one percentage point above the chosen government benchmark under the same yield measure.',
  },
  {
    question: 'What does a 200-basis-point credit spread mean?',
    answer:
      'Two hundred basis points equals two percentage points of yield difference. Whether that is “wide” or “tight” depends on rating, sector, maturity, liquidity, and market conditions; there is no universal risk cutoff.',
  },
  {
    question: 'What is a good credit spread?',
    answer:
      'There is no single good spread. Investors judge spreads relative to peers, historical ranges for that issuer or rating bucket, maturity, structure, and their own risk/return targets. Avoid treating fixed bps thresholds as universal standards.',
  },
  {
    question: 'What causes credit spreads to widen?',
    answer:
      'Widening can reflect higher perceived default risk, weaker issuer fundamentals, lower liquidity, rising risk aversion, stress in funding markets, or a less favorable recovery outlook; often several factors at once.',
  },
  {
    question: 'What causes credit spreads to narrow?',
    answer:
      'Narrowing can reflect improving credit quality, stronger demand for corporate credit, better liquidity, easier financing conditions, or lower overall risk aversion. Spread changes should still be read relative to benchmarks and peers.',
  },
  {
    question: 'Can credit spreads be negative?',
    answer:
      'Yes. A negative spread means the corporate yield is below the selected government yield. Causes can include benchmark mismatch, liquidity, special security features, strong demand, or market distortions. Negative spreads are not automatically input errors.',
  },
  {
    question: 'What is the difference between credit spread and yield spread?',
    answer:
      'Yield spread is a broad term for any difference between two yields. Credit spread usually emphasizes the component associated with credit relative to a government or similar benchmark, though observed spreads still mix liquidity and other premia.',
  },
  {
    question: 'What is the difference between credit spread and credit risk?',
    answer:
      'Credit risk is the economic exposure to default or rating deterioration. A credit spread is a market yield difference that may compensate for credit risk plus liquidity, structure, and other factors; it is not a pure default-probability measure.',
  },
  {
    question: 'How does credit rating affect credit spreads?',
    answer:
      'Lower ratings typically correspond to wider average spreads because markets demand more compensation for higher expected credit risk. Spreads still vary within a rating for sector, maturity, seniority, and liquidity reasons.',
  },
  {
    question: 'Why do corporate bonds usually yield more than government bonds?',
    answer:
      'Corporate issuers generally face higher default and recovery uncertainty than sovereign benchmarks in the same currency, and corporate bonds are often less liquid. Investors typically require additional yield for those risks and frictions.',
  },
  {
    question: 'What is a G-spread?',
    answer:
      'A G-spread is the yield difference between a bond and a comparable government yield (or interpolated government curve point). The simple calculator’s CS = Y_c − Y_g is in the same family as a basic G-spread style comparison.',
  },
  {
    question: 'What is an option-adjusted spread?',
    answer:
      'Option-adjusted spread (OAS) is a model-based spread that adjusts for the value of embedded options (such as callability). It is not the same as a simple nominal yield difference and should not be labeled as such.',
  },
  {
    question: 'What is the difference between credit spread and CDS spread?',
    answer:
      'A bond credit spread compares bond yields. A CDS spread reflects the market price of credit protection under a credit default swap contract. Related conceptually, they are not interchangeable quotes.',
  },
  {
    question: 'How do credit spreads affect bond prices?',
    answer:
      'All else equal, a wider required credit spread implies a higher discount rate for the bond’s cash flows and a lower price. Narrowing spreads tend to support higher prices for a given duration and cash-flow profile.',
  },
  {
    question: 'Can credit spreads predict economic recessions?',
    answer:
      'Widening spreads sometimes coincide with stress and weaker growth outlooks, but spreads are noisy, market-dependent signals. They should not be treated as reliable standalone recession predictors.',
  },
  {
    question: 'How do you compare credit spreads across bonds with different maturities?',
    answer:
      'Compare like with like: match maturity (or duration), currency, seniority, and yield convention where possible. Cross-maturity comparisons mix term-structure and credit effects and can mislead without curve context.',
  },
];
