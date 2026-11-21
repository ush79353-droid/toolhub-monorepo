import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CARRY_TRADE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Carry Trade Calculator' },
  { id: 'what-is', label: 'What Is a Carry Trade?' },
  { id: 'how-it-works', label: 'How Does a Currency Carry Trade Work?' },
  { id: 'formula', label: 'Carry Trade Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Carry Trade Profit' },
  { id: 'spot-differential', label: 'What Is the Spot Rate Differential?' },
  { id: 'lending-rate', label: 'What Is the Lending Rate?' },
  { id: 'borrowing-rate', label: 'What Is the Borrowing Rate?' },
  { id: 'interest-vs-fx', label: 'Interest Differential vs. FX Risk' },
  { id: 'risks', label: 'Main Risks of Carry Trading' },
  { id: 'central-banks', label: 'Central Banks and Carry Trades' },
  { id: 'positive-negative', label: 'Positive vs. Negative Carry' },
  { id: 'profitable', label: 'Is Carry Trading Profitable?' },
  { id: 'vs-forex', label: 'Carry Trade vs. Forex Trading' },
  { id: 'limitations', label: 'Limitations of the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'carry-trade-faq', label: 'Frequently Asked Questions' },
];

export const CARRY_TRADE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a carry trade?',
    answer:
      'A carry trade borrows in a lower-interest-rate (funding) currency, converts into a higher-yielding (investment) currency, earns the interest differential, and later converts back to repay the funding loan. Profit depends on both interest and exchange-rate moves.',
  },
  {
    question: 'How does a currency carry trade work?',
    answer:
      'Borrow funding currency, convert at the opening spot rate, invest and earn lending interest, convert proceeds back at the closing rate, repay principal plus borrowing interest, and keep (or lose) the difference.',
  },
  {
    question: 'What is a carry trade calculator?',
    answer:
      'A tool that estimates carry profit and total return from opening/closing exchange rates, lending and borrowing rates, holding days, day-count basis, and invested (borrowed) principal under a declared quote convention.',
  },
  {
    question: 'How do you calculate carry trade profit?',
    answer:
      'Profit = P × [(S₀/S₁)×(1+Rl) − (1+Rb)], where Rl and Rb are simple-interest period factors D÷B × annual rates, and S is investment currency per one funding unit. This calculator uses that cash-flow model.',
  },
  {
    question: 'What is the spot rate differential?',
    answer:
      'Under this tool’s convention, d% = (S₀/S₁ − 1)×100. It measures how the conversion value changed between opening and closing rates. Quote direction must match the formula.',
  },
  {
    question: 'What is the lending rate in a carry trade?',
    answer:
      'The annual interest rate earned on the investment-currency position. The period return is Rl = rl × D/B with the selected day-count basis.',
  },
  {
    question: 'What is the borrowing rate in a carry trade?',
    answer:
      'The annual interest rate charged on the funding-currency loan. The period cost is Rb = rb × D/B.',
  },
  {
    question: 'How does the interest-rate differential affect a carry trade?',
    answer:
      'A positive lending-minus-borrowing differential tends to help returns, but exchange-rate losses can erase that advantage. Interest carry alone is not the same as total realized return.',
  },
  {
    question: 'Can a carry trade lose money?',
    answer:
      'Yes. Depreciation of the investment currency, rising funding costs, falling investment yields, leverage, and costs can produce losses — sometimes larger than posted collateral when leveraged.',
  },
  {
    question: 'What is currency risk?',
    answer:
      'The risk that exchange-rate moves change the funding-currency value of investment proceeds. Carry trades are exposed to that risk whenever positions are unhedged.',
  },
  {
    question: 'How does exchange-rate depreciation affect carry trade returns?',
    answer:
      'If the investment currency weakens (higher S₁ under this quote), S₀/S₁ falls and funding-currency proceeds shrink, reducing or reversing profit even when interest carry is positive.',
  },
  {
    question: 'Is a higher interest rate always better for carry trading?',
    answer:
      'Not necessarily. Higher yields often accompany higher currency or credit risk. A large interest gap can still lose money if the investment currency depreciates enough.',
  },
  {
    question: 'What is a positive carry trade?',
    answer:
      'Interest carry is positive when lending-period return exceeds borrowing-period cost (Rl > Rb). Total cash-flow profit can still be negative after FX moves.',
  },
  {
    question: 'What is a negative carry trade?',
    answer:
      'Interest carry is negative when Rb > Rl. Traders sometimes hold negative-carry positions for expected FX appreciation; this model will show that interest drag explicitly.',
  },
  {
    question: 'How does leverage affect carry trading?',
    answer:
      'Leverage amplifies both gains and losses and can trigger margin calls. This calculator models an unlevered cash-flow on principal P and does not simulate margin or liquidation.',
  },
  {
    question: 'What are the main risks of carry trading?',
    answer:
      'Currency volatility, interest-rate changes, liquidity, leverage/margin, counterparty and funding rollover risk, political shocks, transaction costs, and crowded-trade unwind risk.',
  },
  {
    question: 'How do central banks influence carry trades?',
    answer:
      'Policy rate paths affect funding and investment yields and can influence capital flows and currencies. No central-bank decision guarantees a profitable exchange-rate outcome.',
  },
  {
    question: 'What happens when a carry trade unwinds?',
    answer:
      'Investors sell the investment currency and buy back the funding currency, which can amplify depreciation and losses during stress — especially when many positions unwind together.',
  },
  {
    question: 'How does a carry trade differ from forex trading?',
    answer:
      'Classic carry emphasizes earning the interest differential over a holding period; short-term FX trading emphasizes directional price moves. Strategies can overlap when traders also seek FX gains.',
  },
  {
    question: 'Does the calculator include transaction costs?',
    answer:
      'No. Commissions, bid/ask spreads, slippage, broker financing markups, taxes, and hedging costs are excluded. Treat results as estimates.',
  },
  {
    question: 'Can carry trading generate negative returns?',
    answer:
      'Yes. Negative total returns appear when investment proceeds fall short of the borrowing repayment under the selected rates and exchange rates.',
  },
  {
    question: 'How do I calculate the spot rate differential?',
    answer:
      'With S as investment units per funding unit: d% = (S₀/S₁ − 1)×100. Reversing the quote convention requires reversing the formula.',
  },
  {
    question: 'What is the carry trade profit on a $5,000 investment?',
    answer:
      'Using the illustrative example (S₀ 0.85, S₁ 0.83, 6%/2%, 180 days, 365 basis), cash-flow profit is about +222.68 funding units (~+4.45% total return). Hypothetical only — not live quotes.',
  },
  {
    question: 'What happens when the investment currency depreciates?',
    answer:
      'Closing conversion yields fewer funding units, lowering V = P×(S₀/S₁)×(1+Rl) and reducing profit. Sufficient depreciation creates a loss.',
  },
  {
    question: 'Are carry trade returns guaranteed?',
    answer:
      'No. Results are model estimates under user-entered rates and exchange rates. Markets, costs, leverage, and rate resets can produce very different outcomes.',
  },
];
