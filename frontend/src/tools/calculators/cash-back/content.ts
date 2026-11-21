import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_BACK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cash Back Calculator' },
  { id: 'what-is', label: 'What Is Cash Back?' },
  { id: 'how-works', label: 'How Does Cash Back Work?' },
  { id: 'how-calculate', label: 'How to Calculate Cash Back' },
  { id: 'with-limit', label: 'Cash Back With a Limit' },
  { id: 'effective-rate', label: 'Effective Cashback Rate' },
  { id: 'credit-card', label: 'Cash Back Credit Cards' },
  { id: 'types', label: 'Types of Cash Back Rewards' },
  { id: 'maximize', label: 'How to Maximize Savings' },
  { id: 'vs-discount', label: 'Cash Back vs. Discount' },
  { id: 'vs-points', label: 'Cash Back vs. Reward Points' },
  { id: 'interest', label: 'Cash Back and Interest' },
  { id: 'limits-savings', label: 'How Limits Affect Savings' },
  { id: 'online', label: 'Cash Back for Online Shopping' },
  { id: 'free-money', label: 'Is Cash Back Free Money?' },
  { id: 'mistakes', label: 'Common Cashback Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cb-faq', label: 'Frequently Asked Questions' },
];

export const CASH_BACK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is cash back?',
    answer:
      'Cash back is a reward that returns a percentage or fixed amount of eligible spending to you—often as a statement credit, deposit, or gift card—subject to the program’s rules.',
  },
  {
    question: 'How does cashback work?',
    answer:
      'You make an eligible purchase, the program applies a cashback rate (and any cap), posts the reward according to its timeline, and you redeem per its terms. Timing and eligibility vary by issuer or retailer.',
  },
  {
    question: 'How do I calculate cashback?',
    answer:
      'Multiply the eligible purchase amount by the cashback rate divided by 100. If a limit applies, take the smaller of that result and the limit.',
  },
  {
    question: 'What is the cashback formula?',
    answer:
      'CashBack = PurchaseAmount × (CashBackRate / 100). With a cap: ActualCashBack = min(CashBack, CashBackLimit).',
  },
  {
    question: 'How much is 5% cashback on $1,000?',
    answer: '$50. Calculation: 1,000 × 0.05 = 50 (before any reward limit).',
  },
  {
    question: 'How much is 2% cashback on $500?',
    answer: '$10. Calculation: 500 × 0.02 = 10.',
  },
  {
    question: 'What is a cashback limit?',
    answer:
      'A cashback limit (cap) is the maximum reward you can earn under an offer for a period, category, or promotion—even if the percentage formula would produce more.',
  },
  {
    question: 'How do cashback caps work?',
    answer:
      'After computing uncapped cashback, the program pays the lesser of that amount and the cap. Spending beyond the break-even threshold earns no additional cashback under that capped offer.',
  },
  {
    question: 'Can cashback exceed the purchase amount?',
    answer:
      'In standard percentage mode (0–100%), cashback cannot exceed the purchase amount. Fixed or promotional bonuses can exceed a single purchase in rare offers—always check terms. This calculator’s percentage mode caps the rate at 100%.',
  },
  {
    question: 'What is an effective cashback rate?',
    answer:
      'Effective rate = ActualCashBack ÷ PurchaseAmount × 100. When a cap binds, the effective rate is lower than the advertised rate.',
  },
  {
    question: 'How do I calculate cashback with a limit?',
    answer:
      'Compute Purchase × Rate/100, then Actual = min(that amount, Limit). Example: $1,500 at 5% with a $50 cap → $75 uncapped → $50 actual.',
  },
  {
    question: 'What is the difference between cash back and a discount?',
    answer:
      'A discount reduces the price at checkout. Cashback usually requires paying the listed price first, then receiving a reward later. Net savings can look similar mathematically but cash flow and eligibility differ.',
  },
  {
    question: 'What is the difference between cashback and reward points?',
    answer:
      'Cashback is typically quoted in money. Points have a value that depends on redemption options and can vary widely; converting points to a cash-equivalent rate helps compare offers.',
  },
  {
    question: 'How do cashback credit cards work?',
    answer:
      'Eligible charges earn a stated rate (flat, category, or rotating). Rewards post after transactions clear, may have caps, and are redeemed as credit, deposit, or check per the issuer.',
  },
  {
    question: 'Can I earn cashback on every purchase?',
    answer:
      'No. Many programs exclude cash advances, fees, certain merchants, or non-eligible categories. Always read the rewards terms.',
  },
  {
    question: 'How do I calculate monthly cashback?',
    answer:
      'Estimate MonthlyCashBack ≈ MonthlyEligibleSpend × Rate/100, then apply any monthly or statement-period cap. Treat the result as a projection, not a guarantee.',
  },
  {
    question: 'How do I calculate annual cashback?',
    answer:
      'Project monthly cashback (with monthly caps if any), then multiply by months—or sum statement periods. Subtract annual fees when comparing net value.',
  },
  {
    question: 'Does cashback expire?',
    answer:
      'It depends on the program. Some rewards expire after inactivity or a set date; others do not. Check your issuer or retailer policy—this calculator does not model expiration.',
  },
  {
    question: 'Can cashback rewards be reversed?',
    answer:
      'Yes. Returns, chargebacks, or cancelled orders often reverse associated rewards. Some programs claw back rewards if terms are violated.',
  },
  {
    question: 'How can I maximize cashback rewards?',
    answer:
      'Match spending to higher-rate categories, watch caps, avoid excluded purchases, compare net value after fees, and never carry high-interest balances just to earn rewards.',
  },
  {
    question: 'Is cashback worth it if my credit card has an annual fee?',
    answer:
      'Compare expected annual cashback (and other benefits) with the fee. If projected rewards net of the fee are less than a no-fee alternative for your spending, the fee card may not be worthwhile.',
  },
  {
    question: 'Can I combine cashback and discount offers?',
    answer:
      'Sometimes—when retailer and card rules allow stacking. Math-wise, apply the checkout discount first, then cashback on the eligible amount the program defines (pre- or post-tax per terms).',
  },
  {
    question: 'How do I compare two cashback credit cards?',
    answer:
      'For the same purchase basket, compute actual cashback after each card’s rates and caps, then subtract annual fees for a net comparison. Eligibility differences matter as much as headline rates.',
  },
  {
    question: 'What happens when I reach my cashback limit?',
    answer:
      'Additional eligible spending under that capped offer typically earns no more cashback until the cap resets (for example, next statement period). Other uncapped rates may still apply if your card has them.',
  },
  {
    question: 'Is cashback calculated before or after tax?',
    answer:
      'Issuer and retailer rules differ. Some base rewards on the pre-tax merchandise total; others include tax. This calculator uses the purchase amount you enter—use the eligible base from your program’s terms.',
  },
];
