import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAYPAL_FEE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PayPal Fee Calculator' },
  { id: 'what-are-fees', label: 'What Are PayPal Fees?' },
  { id: 'how-it-works', label: 'How This Calculator Works' },
  { id: 'how-to-calculate', label: 'How to Calculate PayPal Fees' },
  { id: 'formula', label: 'PayPal Fee Formula' },
  { id: 'how-much', label: 'How Much Does PayPal Charge?' },
  { id: 'goods-services', label: 'Goods and Services Fees' },
  { id: 'international', label: 'International Payments' },
  { id: 'amount-received', label: 'Amount Received After Fees' },
  { id: 'reverse', label: 'Reverse Calculate Fees' },
  { id: 'undercharging', label: 'Avoid Undercharging' },
  { id: 'freelancers', label: 'Fees for Freelancers' },
  { id: 'sellers', label: 'Fees for Online Sellers' },
  { id: 'small-business', label: 'Fees for Small Businesses' },
  { id: 'domestic-vs-intl', label: 'Domestic vs. International' },
  { id: 'vs-fx', label: 'Fees vs. Currency Conversion' },
  { id: 'estimate-accurately', label: 'Estimate Fees Accurately' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pp-faq', label: 'Frequently Asked Questions' },
];

export const PAYPAL_FEE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a PayPal fee?',
    answer:
      'A PayPal fee is the processing cost PayPal charges when you receive (or sometimes send) money. Commercial receiving fees typically combine a percentage of the payment plus a fixed fee, and may include an international add-on.',
  },
  {
    question: 'How do I calculate PayPal transaction fees?',
    answer:
      'Fee = Gross × (percentage + international%) / 100 + fixed fee. Net = Gross − Fee. Use your account’s published schedule or enter custom rates.',
  },
  {
    question: 'How much does PayPal charge for receiving money?',
    answer:
      'It depends on your account country, currency received, transaction type, and whether the payment is domestic or international. There is no single global rate.',
  },
  {
    question: 'What is the PayPal Goods and Services fee?',
    answer:
      'In the US merchant schedule, Send/Receive Money for Goods and Services is listed at 2.99% (no separate fixed fee in that row). Other commercial types such as PayPal Checkout use different rates. Always check your local schedule.',
  },
  {
    question: 'How do I calculate PayPal fees for $100?',
    answer:
      'With an illustrative US Checkout rate of 3.49% + $0.49: fee = 100 × 0.0349 + 0.49 = $3.98; net = $96.02. Your account may differ.',
  },
  {
    question: 'How much should I charge to receive $100 after fees?',
    answer:
      'Use reverse mode: Gross ≈ (Net + Fixed) ÷ (1 − total%). For 3.49% + $0.49 targeting $100 net, gross is about $104.12 after currency rounding.',
  },
  {
    question: 'How do I reverse calculate PayPal fees?',
    answer:
      'Select “Gross needed for desired net,” enter the amount you want to keep, and apply the same percentage and fixed fees. The calculator finds a minimum chargeable gross that still meets the net after rounding.',
  },
  {
    question: 'Are PayPal fees the same in every country?',
    answer:
      'No. US, UK, and other markets publish different percentage rates, fixed fees by currency, and international add-ons. Unsupported regions should use Custom mode.',
  },
  {
    question: 'Does PayPal charge extra for international payments?',
    answer:
      'Often yes for commercial receiving. US schedules commonly add 1.50%. UK schedules distinguish EEA vs other markets (e.g. 1.29% vs 1.99%). Apply only the add-on that matches your schedule.',
  },
  {
    question: 'What is the difference between domestic and international fees?',
    answer:
      'Domestic usually means sender and receiver are in the same PayPal market. International means different markets and may trigger an additional percentage. Market groupings are defined by PayPal.',
  },
  {
    question: 'Does PayPal charge a fixed transaction fee?',
    answer:
      'Many commercial types include a fixed fee based on the currency received. Some rows (such as US Goods & Services send/receive) list only a percentage. This calculator uses the selected preset’s fixed-fee rules.',
  },
  {
    question: 'Are PayPal fees different for different currencies?',
    answer:
      'Yes. The percentage may be the same while the fixed fee changes with the currency received. Changing currency in this tool updates fixed-fee lookups for verified schedules and reformats amounts.',
  },
  {
    question: 'Does PayPal charge currency conversion fees?',
    answer:
      'PayPal may charge a conversion markup when currencies differ. This calculator estimates processing fees only and excludes conversion costs unless you model them yourself in Custom mode.',
  },
  {
    question: 'Can I use custom PayPal fee rates?',
    answer:
      'Yes. Choose Custom / other region or Custom Fee and enter percentage, fixed, and optional international rates. Those values are treated as user estimates.',
  },
  {
    question: 'Are PayPal transaction fees refundable?',
    answer:
      'Refund and dispute handling depend on PayPal’s policies and the payment type. Fee refunds are not automatic for every cancellation. Check PayPal’s help for your market.',
  },
  {
    question: 'Are PayPal fees tax deductible?',
    answer:
      'In many jurisdictions business payment-processing fees may be deductible as expenses, but tax treatment varies. This is not tax advice; confirm with a qualified advisor.',
  },
  {
    question: 'Can businesses pass PayPal fees on to customers?',
    answer:
      'Some sellers price products to cover fees; others add a surcharge. Card-scheme and local laws may restrict surcharging. Confirm what is allowed for your location and payment method before passing fees on.',
  },
  {
    question: 'Why is my actual PayPal fee different from the calculator?',
    answer:
      'Account-level pricing, payment method, promotions, micropayments, invoicing products, and policy updates can change the fee. Always confirm with your PayPal activity or official fee page.',
  },
  {
    question: 'How can freelancers calculate their net PayPal income?',
    answer:
      'Enter the invoice gross (or use reverse mode to set a take-home target). Subtract estimated fees to plan cash flow. Remember taxes and other expenses separately.',
  },
  {
    question: 'How do I calculate the effective PayPal fee percentage?',
    answer:
      'Effective rate = Total fee ÷ Gross × 100. Fixed fees make the effective rate higher on small payments than the headline percentage alone.',
  },
];
