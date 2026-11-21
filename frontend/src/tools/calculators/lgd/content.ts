import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LGD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'LGD Calculator – Loss Given Default' },
  { id: 'definition', label: 'What Is Loss Given Default (LGD)?' },
  { id: 'formula', label: 'LGD Formula' },
  { id: 'recovery-rate', label: 'What Is Recovery Rate?' },
  { id: 'loss-severity', label: 'What Is Loss Severity?' },
  { id: 'step-by-step', label: 'How to Calculate LGD Step by Step' },
  { id: 'example', label: 'LGD Calculation Example' },
  { id: 'importance', label: 'Why Calculating LGD Matters' },
  { id: 'vs-pd', label: 'LGD vs Probability of Default' },
  { id: 'vs-ead', label: 'LGD vs Exposure at Default' },
  { id: 'expected-loss', label: 'Expected Loss Formula' },
  { id: 'factors', label: 'What Factors Affect LGD?' },
  { id: 'secured', label: 'Secured vs Unsecured Loans' },
  { id: 'banking', label: 'LGD in Banking Models' },
  { id: 'advantages', label: 'Advantages of an LGD Calculator' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'lgd-faq', label: 'Frequently Asked Questions' },
];

export const LGD_FAQS: readonly FAQItem[] = [
  {
    question: 'What does LGD mean in banking?',
    answer:
      'LGD means Loss Given Default: the share or amount of exposure expected to be lost if a borrower defaults, after accounting for recoveries under the model’s assumptions.',
  },
  {
    question: 'What is Loss Given Default?',
    answer:
      'Loss Given Default is the loss conditional on default. As a rate it is often 1 − recovery rate; as an amount it is EAD × LGD rate.',
  },
  {
    question: 'How do you calculate LGD?',
    answer:
      'In the basic model: convert recovery rate to a decimal, compute loss severity = 1 − RR, then LGD amount = EAD × loss severity. Alternatively LGD amount = EAD − recovery amount.',
  },
  {
    question: 'What is the LGD formula?',
    answer:
      'LGD_amount = EAD × LGD_rate, with LGD_rate = 1 − RR. Expected Loss (optional) is EL = PD × LGD_rate × EAD and is not the same as LGD amount.',
  },
  {
    question: 'What is a recovery rate?',
    answer:
      'The recovered share of exposure after default (from collateral, repayments, guarantees, or other recoveries) expressed as a percentage of EAD in the simplified model.',
  },
  {
    question: 'How is recovery rate calculated?',
    answer:
      'RR = Recovery amount ÷ EAD (when both are known), or RR = 1 − LGD rate when severity is the source field.',
  },
  {
    question: 'What is loss severity?',
    answer:
      'Loss severity is the unrecovered share of exposure. In the basic calculator it equals 100% − recovery rate.',
  },
  {
    question: 'What is the difference between LGD and recovery rate?',
    answer:
      'They are complements in the basic model: LGD rate + recovery rate = 100%. LGD focuses on the lost share; recovery rate focuses on the recovered share.',
  },
  {
    question: 'What is Exposure at Default (EAD)?',
    answer:
      'EAD is the estimated amount outstanding or economically exposed when default occurs; drawn balances plus applicable undrawn exposure assumptions in fuller models.',
  },
  {
    question: 'What is Probability of Default (PD)?',
    answer:
      'PD is the estimated likelihood that a borrower defaults over a stated horizon (for example one year). It is not a loss amount.',
  },
  {
    question: 'What is the difference between PD and LGD?',
    answer:
      'PD is the chance of default; LGD is how much is lost if default happens. Both are needed (with EAD) for simplified expected loss.',
  },
  {
    question: 'How do PD, LGD, and EAD calculate expected loss?',
    answer:
      'EL = PD × LGD_rate × EAD. Example: 5% × 20% × 100,000 = 1,000; much smaller than the LGD amount of 20,000 if default occurs.',
  },
  {
    question: 'Can LGD be zero?',
    answer:
      'Yes, if the model assumes full recovery (100% recovery rate). Realized outcomes can still differ from the assumption.',
  },
  {
    question: 'Can LGD be 100%?',
    answer:
      'Yes, if no recovery is assumed. That means the entire EAD is treated as lost under the calculator’s simple model.',
  },
  {
    question: 'Can LGD exceed 100%?',
    answer:
      'Not in this basic 0–100% recovery model. Methods that add recovery costs or negative recoveries need an explicitly separate methodology.',
  },
  {
    question: 'Does high LGD mean high investment risk?',
    answer:
      'High LGD means more loss if default occurs, but overall credit risk also depends on PD, EAD, correlations, and diversification. High LGD with very low PD can still imply modest expected loss.',
  },
  {
    question: 'Why do secured loans often have lower LGD?',
    answer:
      'Collateral can increase recoveries, lowering loss severity, but not always. Valuation, liquidation costs, legal priority, and market conditions still matter.',
  },
  {
    question: 'What factors influence recovery rates?',
    answer:
      'Collateral quality and liquidity, seniority, guarantees, borrower condition, economic cycle, legal process, recovery costs, and timing of cash recoveries.',
  },
  {
    question: 'How does collateral affect LGD?',
    answer:
      'Better, more liquid collateral with clear security interests often raises expected recoveries and lowers LGD estimates, subject to haircuts and realization frictions.',
  },
  {
    question:
      'What is the difference between expected loss and loss given default?',
    answer:
      'LGD amount assumes default has occurred. Expected loss multiplies by PD and is the probability-weighted average loss over the horizon; typically much smaller than LGD amount.',
  },
  {
    question: 'How is LGD used in Basel credit risk models?',
    answer:
      'Regulatory frameworks use LGD (with PD and EAD) in capital and risk-weighted asset calculations, often with prescribed floors, downturn LGDs, and data requirements beyond this educational calculator.',
  },
  {
    question: 'How is LGD used in IFRS 9?',
    answer:
      'IFRS 9 expected credit loss models use forward-looking PD, LGD, and EAD concepts. Accounting LGD methodologies can differ from this simplified tool and require professional judgment.',
  },
  {
    question:
      'Can a company have a high LGD but a low probability of default?',
    answer:
      'Yes. A strong borrower (low PD) with thin collateral (high LGD) can still show modest expected loss while facing severe loss severity if default ever occurs.',
  },
  {
    question: 'What are the limitations of an LGD calculator?',
    answer:
      'Simplified inputs omit recovery timing, costs, downturn scenarios, and full regulatory/accounting rules. Forecast recoveries can differ from realized outcomes.',
  },
];
