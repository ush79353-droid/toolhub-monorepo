import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COUPON_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Coupon Rate Calculator' },
  { id: 'definition', label: 'What Is the Coupon Rate?' },
  { id: 'how-to-calculate', label: 'How to Calculate Coupon Rate' },
  { id: 'frequencies', label: 'Payment Frequencies' },
  { id: 'annual-coupon', label: 'Annual Coupon Payments' },
  { id: 'per-period', label: 'Coupon Payments per Period' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'vs-current-yield', label: 'Coupon Rate vs Current Yield' },
  { id: 'vs-ytm', label: 'Coupon Rate vs YTM' },
  { id: 'market-rates', label: 'Market Interest Rates' },
  { id: 'fixed-vs-floating', label: 'Fixed vs Floating Coupons' },
  { id: 'zero-coupon', label: 'Zero-Coupon Bonds' },
  { id: 'good-rate', label: 'What Is a Good Coupon Rate?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'coupon-rate-faq', label: 'Frequently Asked Questions' },
];

export const COUPON_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a bond?',
    answer:
      'A bond is a debt security in which an issuer borrows money from investors and typically promises periodic interest (coupons) plus repayment of principal (face value) at maturity, subject to the bond’s terms and credit risk.',
  },
  {
    question: 'What is a coupon rate?',
    answer:
      'The coupon rate is the annual contractual coupon interest expressed as a percentage of the bond’s face (par) value, not of its market price.',
  },
  {
    question: 'How do you calculate coupon rate?',
    answer:
      'Divide annual coupon payments by face value and multiply by 100: r% = (C_annual / F) × 100. With periodic payments, C_annual = C_period × payments per year.',
  },
  {
    question: 'What is the coupon rate formula?',
    answer:
      'r% = (C_period × f / F) × 100, where F is face value, C_period is the payment each coupon date, and f is payments per year.',
  },
  {
    question: 'How do you calculate annual coupon payments?',
    answer:
      'Annual coupon = Face value × (coupon rate ÷ 100), or sum of all coupon payments made within one year.',
  },
  {
    question: 'How do you calculate semiannual coupon payments?',
    answer:
      'For a fixed-rate bond, coupon per period = annual coupon ÷ 2. Example: 5% of $1,000 is $50/year → $25 every six months.',
  },
  {
    question: 'How often do bonds pay coupons?',
    answer:
      'Common schedules are annual, semiannual, quarterly, or monthly. Many U.S. corporate and Treasury notes historically pay semiannually; always check the prospectus.',
  },
  {
    question: 'What is the difference between coupon rate and bond yield?',
    answer:
      'Coupon rate uses face value; market yields (such as current yield or YTM) use market price and/or the full cash-flow discount rate. They coincide only in special cases.',
  },
  {
    question: 'Is coupon rate the same as yield to maturity?',
    answer:
      'No. YTM is the discount rate that equates remaining cash flows to the current market price (with assumptions). Coupon rate ignores market price.',
  },
  {
    question: 'Does the coupon rate change when interest rates change?',
    answer:
      'For a traditional fixed-rate bond, the contractual coupon rate generally does not change when market yields change. The bond’s market price typically adjusts instead.',
  },
  {
    question: 'What happens when a bond trades below face value?',
    answer:
      'It trades at a discount. Coupon rate (based on face) can be lower than current yield based on the lower market price, all else equal.',
  },
  {
    question: 'What happens when a bond trades above face value?',
    answer:
      'It trades at a premium. Current yield can be lower than the coupon rate because the same coupons are divided by a higher price.',
  },
  {
    question: 'Can a bond have a zero coupon rate?',
    answer:
      'Yes. Zero-coupon bonds pay no periodic coupons; return usually comes from buying below redemption value (subject to terms and taxes).',
  },
  {
    question: 'What is a good coupon rate?',
    answer:
      'It depends on market yields, credit risk, maturity, inflation, taxes, and purchase price. There is no single universal “good” percentage.',
  },
  {
    question: 'What is the difference between coupon rate and current yield?',
    answer:
      'Coupon rate = annual coupon / face value. Current yield = annual coupon / market price. They differ whenever price ≠ face.',
  },
  {
    question: 'How do you calculate coupon rate from face value?',
    answer:
      'Identify annual coupon cash interest, divide by face value, and express as a percent. Include all scheduled coupons within the year.',
  },
  {
    question: 'What does a 5% coupon bond mean?',
    answer:
      'It means annual coupons equal 5% of face value. On a $1,000 par bond that is typically $50 per year (e.g., $25 semiannually).',
  },
  {
    question: 'How much does a $1,000 bond with a 6% coupon pay annually?',
    answer:
      '$60 per year in coupon interest (before taxes and fees), split according to the payment frequency.',
  },
  {
    question: 'Can coupon rates be negative?',
    answer:
      'Standard fixed-coupon bonds do not use negative contractual coupon rates. This calculator rejects negative coupons and rates in standard mode.',
  },
  {
    question: 'How do floating-rate bonds determine coupon payments?',
    answer:
      'Floating-rate coupons typically reset periodically based on a reference rate plus a spread (and floors/caps if any). Payments can change even though the formula is contractual.',
  },
];
