import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FISHER_EQUATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fisher Equation Calculator' },
  { id: 'what-is', label: 'What Is the Fisher Equation?' },
  { id: 'formula', label: 'What Is the Fisher Equation Formula?' },
  { id: 'deriving', label: 'Deriving the Fisher Equation' },
  { id: 'approximate', label: 'Approximate Fisher Equation' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Fisher Equation Calculation Example' },
  { id: 'nominal-vs-real', label: 'Nominal vs. Real Interest Rates' },
  { id: 'inflation-exceeds', label: 'When Inflation Exceeds Nominal' },
  { id: 'negative-real', label: 'Can the Real Rate Be Negative?' },
  { id: 'vs-effect', label: 'Fisher Equation vs. Fisher Effect' },
  { id: 'vs-ife', label: 'Fisher Equation vs. International Fisher Effect' },
  { id: 'applications', label: 'Applications of the Fisher Equation' },
  { id: 'limitations', label: 'Limitations of the Fisher Equation' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fisher-equation-faq', label: 'Frequently Asked Questions' },
];

export const FISHER_EQUATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Fisher equation?',
    answer:
      'The Fisher equation states (1+i)=(1+r)(1+πᵉ), linking the nominal interest rate, real interest rate, and expected inflation in gross-return form.',
  },
  {
    question: 'Who developed the Fisher equation?',
    answer:
      'It is associated with economist Irving Fisher’s analysis of interest, inflation, and purchasing power.',
  },
  {
    question: 'How do you calculate the real interest rate?',
    answer:
      'Exact: r=((1+i)/(1+πᵉ)−1)×100, or equivalently r=(i−πᵉ)/(1+πᵉ) with decimal rates. Approximate: r≈i−πᵉ.',
  },
  {
    question: 'What is the exact Fisher equation?',
    answer:
      '(1+i)=(1+r)(1+πᵉ). It multiplies gross factors rather than simply adding percentages.',
  },
  {
    question: 'What is the approximate Fisher equation?',
    answer:
      'i≈r+πᵉ (or r≈i−πᵉ), which drops the cross-product term r·πᵉ from the exact expansion.',
  },
  {
    question: 'Why do nominal and real interest rates differ?',
    answer:
      'Nominal rates are stated before inflation adjustment; real rates measure purchasing-power change under the Fisher mapping.',
  },
  {
    question: 'Can real interest rates be negative?',
    answer:
      'Yes. When expected inflation exceeds the nominal rate under the equation, the exact real rate is negative.',
  },
  {
    question: 'What happens if expected inflation is zero?',
    answer:
      'Then exact r equals i: with πᵉ=0, (1+i)/(1+0)−1 = i.',
  },
  {
    question: 'What happens if expected inflation exceeds the nominal interest rate?',
    answer:
      'The exact real rate is typically negative; purchasing power of the return falls even if the nominal balance grows.',
  },
  {
    question: 'What is the difference between the Fisher equation and Fisher effect?',
    answer:
      'The equation is the mathematical identity among i, r, and πᵉ. The Fisher effect usually emphasizes how nominal rates adjust with inflation expectations when the real rate is held conceptually constant. See also the Fisher Effect Calculator.',
  },
  {
    question: 'How does the Fisher equation relate to inflation expectations?',
    answer:
      'πᵉ enters the identity directly. Changing expected inflation changes exact r for a given i (or changes implied i for a given r).',
  },
  {
    question: 'What does deflation do to real interest rates?',
    answer:
      'Negative expected inflation raises the exact real rate above the nominal rate for a fixed i.',
  },
  {
    question: 'What are the limitations of the Fisher equation?',
    answer:
      'It does not guarantee market one-for-one adjustment; taxes, risk, liquidity, frictions, and changing real rates matter.',
  },
  {
    question: 'How do you calculate expected inflation?',
    answer:
      'Exact: πᵉ=((1+i)/(1+r)−1)×100. Approximate: πᵉ≈i−r.',
  },
  {
    question: 'How do you calculate nominal interest rates?',
    answer:
      'Exact: i=(1+r)(1+πᵉ)−1 (as a decimal, then ×100). Approximate: i≈r+πᵉ.',
  },
  {
    question: 'Is the Fisher equation always accurate?',
    answer:
      'As algebra among three defined rates, yes. As a description of market pricing, not always; expectations and premiums intervene.',
  },
  {
    question: 'What is Fisher debt deflation?',
    answer:
      'A separate concept about debt burdens rising in real terms when prices fall; not another name for the Fisher equation.',
  },
  {
    question: 'How do I calculate the real interest rate when expected inflation is 5%?',
    answer:
      'Enter your nominal rate and 5% inflation in real-rate mode. Exact r=((1+i/100)/1.05−1)×100; approximate r≈i−5.',
  },
];
