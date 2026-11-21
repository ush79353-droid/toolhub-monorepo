import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FISHER_EFFECT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fisher Effect Calculator' },
  { id: 'what-is', label: 'What Is the Fisher Effect?' },
  { id: 'formula', label: 'Fisher Effect Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate the Fisher Effect' },
  { id: 'interpret', label: 'How to Interpret the Fisher Effect' },
  { id: 'nominal-vs-real', label: 'Nominal vs. Real Interest Rates' },
  { id: 'expected-inflation', label: 'Expected Inflation and the Fisher Effect' },
  { id: 'exact-vs-approx', label: 'Exact vs. Approximate Fisher Equation' },
  { id: 'examples', label: 'Fisher Effect Examples' },
  { id: 'banking', label: 'Fisher Effect in Banking and Lending' },
  { id: 'monetary-policy', label: 'Fisher Effect and Monetary Policy' },
  { id: 'ife', label: 'Fisher Effect vs. International Fisher Effect' },
  { id: 'limitations', label: 'Limitations of the Fisher Effect' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fisher-effect-faq', label: 'Frequently Asked Questions' },
];

export const FISHER_EFFECT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Fisher effect?',
    answer:
      'The Fisher effect is Irving Fisher’s relationship linking nominal interest rates, real interest rates, and expected inflation through purchasing-power adjustment.',
  },
  {
    question: 'What is the Fisher effect formula?',
    answer:
      'Exact: (1+i)=(1+r)(1+πᵉ). Approximate: i≈r+πᵉ. Rates must be decimals in the product form.',
  },
  {
    question: 'How do you calculate the real interest rate?',
    answer:
      'Exact: r=((1+i)/(1+πᵉ)−1)×100. Approximate: r≈i−πᵉ.',
  },
  {
    question: 'What is the nominal interest rate?',
    answer:
      'The stated interest rate before adjusting for inflation — for example a quoted deposit or loan rate.',
  },
  {
    question: 'What is the real interest rate?',
    answer:
      'The inflation-adjusted rate measuring the change in purchasing power of the interest return under the Fisher equation.',
  },
  {
    question: 'What is expected inflation?',
    answer:
      'The anticipated change in the general price level over the same period as the interest rate — not necessarily the inflation that later realizes.',
  },
  {
    question: 'Why does inflation affect real interest rates?',
    answer:
      'Inflation erodes purchasing power. For a given nominal rate, higher expected inflation lowers the exact Fisher real rate.',
  },
  {
    question: 'What is the difference between nominal and real interest rates?',
    answer:
      'Nominal is the stated rate; real adjusts for expected inflation so you can compare purchasing-power outcomes.',
  },
  {
    question: 'What happens when inflation exceeds the nominal interest rate?',
    answer:
      'The exact real rate is typically negative: purchasing power of the return falls even if the nominal balance grows.',
  },
  {
    question: 'Can real interest rates be negative?',
    answer:
      'Yes. When expected inflation exceeds the nominal rate under the Fisher mapping, r can be negative.',
  },
  {
    question: 'What happens to real interest rates during deflation?',
    answer:
      'Negative expected inflation (deflation) raises the real rate above the nominal rate for a given i.',
  },
  {
    question: 'What is the exact Fisher equation?',
    answer:
      '(1+i)=(1+r)(1+πᵉ), which multiplies gross returns rather than adding percentages.',
  },
  {
    question: 'What is the approximate Fisher equation?',
    answer:
      'i≈r+πᵉ (or r≈i−πᵉ). Useful for small rates; the gap versus exact grows as rates rise.',
  },
  {
    question: 'When should I use the exact Fisher equation?',
    answer:
      'Prefer exact whenever precision matters or rates are not small. This calculator defaults to exact.',
  },
  {
    question: 'How does the Fisher effect affect savings?',
    answer:
      'Savers care about real returns: a high nominal deposit rate can still lose purchasing power if inflation is higher.',
  },
  {
    question: 'How does the Fisher effect affect borrowing?',
    answer:
      'Borrowers may benefit when inflation exceeds the contracted nominal rate in real terms — but contracts, taxes, and risk also matter.',
  },
  {
    question: 'How is the Fisher effect related to monetary policy?',
    answer:
      'Policy can influence short-term nominal rates and inflation expectations; the simple Fisher link is only one lens and does not fully determine market rates.',
  },
  {
    question: 'What is the difference between the Fisher effect and the International Fisher Effect?',
    answer:
      'The Fisher effect links i, r, and πᵉ. The International Fisher Effect relates cross-country nominal interest differentials to expected exchange-rate changes under its own assumptions — a separate theory.',
  },
  {
    question: 'What are the limitations of the Fisher effect?',
    answer:
      'Uncertain expectations, taxes, risk and liquidity premiums, frictions, and policy interventions can break a simple one-for-one link in observed markets.',
  },
  {
    question: 'Is the Fisher effect always accurate?',
    answer:
      'No. It is a theoretical purchasing-power relationship, not a guarantee that markets always adjust nominal rates one-for-one with inflation expectations.',
  },
];
