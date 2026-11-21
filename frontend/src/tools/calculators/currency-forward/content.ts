import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CURRENCY_FORWARD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Currency Forward Calculator' },
  { id: 'what-is', label: 'What Is a Currency Forward Contract?' },
  { id: 'how-it-works', label: 'How Does a Currency Forward Work?' },
  { id: 'formula', label: 'Currency Forward Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate a Forward Rate' },
  { id: 'cip', label: 'Covered Interest Rate Parity' },
  { id: 'premium', label: 'Forward Premium and Discount' },
  { id: 'spot-vs-forward', label: 'Spot vs. Forward' },
  { id: 'vs-futures', label: 'Forward vs. Futures' },
  { id: 'vs-options', label: 'Forward vs. Options' },
  { id: 'business-use', label: 'How Businesses Use Forwards' },
  { id: 'applications', label: 'Hedging, Speculation, Arbitrage' },
  { id: 'determinants', label: 'What Determines Forward Prices?' },
  { id: 'risks', label: 'Risks of Currency Forwards' },
  { id: 'limitations', label: 'Limitations of the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'currency-forward-faq', label: 'Frequently Asked Questions' },
];

export const CURRENCY_FORWARD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a currency forward?',
    answer:
      'A currency forward is an agreement to exchange one currency for another at a predetermined rate on a future date. This calculator estimates a theoretical forward rate via covered interest parity — not a dealer quote.',
  },
  {
    question: 'How does a currency forward contract work?',
    answer:
      'Counterparties agree on pair, notional, rate, and maturity. At settlement they exchange (or net) at the contracted rate regardless of the then-current spot, subject to contract terms and credit arrangements.',
  },
  {
    question: 'How do you calculate a currency forward rate?',
    answer:
      'Under simple CIP with BASE/QUOTE quoting: F = S × (1+rq T)/(1+rb T), where rq is the quote-currency rate, rb the base-currency rate, and T the year fraction.',
  },
  {
    question: 'What is the currency forward formula?',
    answer:
      'Simple: F = S × (1+rq T)/(1+rb T). Annual compounding: F = S × (1+rq)^T / (1+rb)^T. Continuous: F = S × e^((rq−rb)T).',
  },
  {
    question: 'What is covered interest rate parity?',
    answer:
      'CIP is a no-arbitrage link between spot, forward, and interest rates: funding in one currency, investing in the other, and covering with a forward should not yield risk-free profit when markets are frictionless.',
  },
  {
    question: 'Why are currency forward rates different from spot rates?',
    answer:
      'Interest-rate differentials (and market frictions) make holding one currency until maturity not equivalent to holding the other without adjustment — so F generally differs from S.',
  },
  {
    question: 'What is a forward premium?',
    answer:
      'Under this quote convention, a forward premium means F > S: the base currency is more expensive in quote terms for future delivery than for spot.',
  },
  {
    question: 'What is a forward discount?',
    answer:
      'A forward discount means F < S: the base currency is cheaper in quote terms for future delivery than for spot.',
  },
  {
    question: 'What are forward points?',
    answer:
      'Forward points are F − S in exchange-rate units. Market “points” conventions vary by pair; this tool shows the raw rate difference.',
  },
  {
    question: 'What is the difference between a currency forward and a currency future?',
    answer:
      'Forwards are OTC and customizable; futures are exchange-traded, standardized, and typically margined with clearinghouse arrangements.',
  },
  {
    question: 'What is the difference between a currency forward and a currency option?',
    answer:
      'A forward creates an obligation to exchange at F. An option grants a right (not obligation) for a premium, allowing optional participation in favorable moves.',
  },
  {
    question: 'How do companies use forward contracts to hedge?',
    answer:
      'Importers and exporters lock a future rate for payables or receivables to reduce cash-flow uncertainty from FX moves.',
  },
  {
    question: 'What is foreign currency exposure?',
    answer:
      'Exposure is sensitivity of cash flows, assets, or liabilities to exchange-rate changes — for example a USD payable for a EUR-based firm.',
  },
  {
    question: 'What is currency hedging?',
    answer:
      'Hedging uses instruments such as forwards to offset FX risk so that adverse rate moves have less impact on planned cash flows.',
  },
  {
    question: 'What is currency speculation?',
    answer:
      'Taking a directional FX position via forwards or other instruments to profit from expected rate moves — with risk of loss.',
  },
  {
    question: 'What is currency arbitrage?',
    answer:
      'Covered interest arbitrage seeks risk-free profit from CIP deviations after funding, spreads, and access constraints — often unavailable in practice.',
  },
  {
    question: 'What happens when a currency forward matures?',
    answer:
      'Parties settle by delivering currencies or by cash netting against the contracted rate, depending on the agreement.',
  },
  {
    question: 'Are currency forwards risky?',
    answer:
      'Hedges reduce FX uncertainty but leave counterparty, liquidity, and opportunity-cost risks. Speculative forwards can lose money.',
  },
  {
    question: 'Can currency forward contracts result in losses?',
    answer:
      'Yes. Relative to future spot, a hedge can look “worse” than remaining unhedged, and speculative positions can lose if spot moves unfavorably.',
  },
  {
    question: 'Does a forward rate predict a future spot rate?',
    answer:
      'No. A CIP forward is an interest-adjusted parity price, not a reliable forecast of ST.',
  },
  {
    question: 'What interest rates should be used in forward pricing?',
    answer:
      'Rates should match the currencies, maturity, and funding/investable conventions you intend to model. Policy rates are not always the right choice.',
  },
  {
    question: 'Can interest rates be negative?',
    answer:
      'Yes. This calculator allows negative rates when accumulation factors remain valid for the selected compounding mode.',
  },
  {
    question: 'What is the difference between EUR/USD and USD/EUR?',
    answer:
      'EUR/USD quotes USD per EUR; USD/EUR quotes EUR per USD. They are reciprocals. Interest rates must follow which currency is base vs quote.',
  },
  {
    question: 'How do I calculate a 90-day forward exchange rate?',
    answer:
      'Set T = 90/B (e.g. 365), convert annual rates to accumulation factors, then apply F = S × Aq/Ab (simple) or the selected compounding form.',
  },
  {
    question: 'Can I calculate the forward rate without live market data?',
    answer:
      'Yes. Enter spot and interest rates manually. Live quotes are optional and not required for the CIP model.',
  },
];
