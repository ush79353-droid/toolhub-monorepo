import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AR_DAYS_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-ar-days-means',
    title: 'What Accounts Receivable Days Means',
    body: [
      'Accounts receivable days estimate how long credit sales remain uncollected. People also call the same idea days sales outstanding, or DSO. The figure answers a narrow question: the receivables balance you are looking at is equal to how many days of net credit sales?',
      'It is not a forecast of when a particular invoice will be paid, and it is not a grade. Two businesses can post the same number for different reasons. One may offer 30-day terms and collect on time. Another may offer 10-day terms and collect late.',
    ],
  },
  {
    id: 'ar-days-formula',
    title: 'A/R Days Formula',
    body: [
      'The standard formula is A/R days = (accounts receivable / net credit sales) × number of days in the period. Net credit sales means credit sales after returns and allowances. Cash sales stay out, because that money never passed through receivables.',
      'When you use an average balance instead, substitute average accounts receivable — (beginning + ending) ÷ 2 — for the receivables figure. The rest of the formula stays the same.',
    ],
  },
  {
    id: 'how-to-calculate-dso',
    title: 'How to Calculate DSO',
    body: [
      'Pick the period the sales cover, such as 365 days, 90 days, or the length of a fiscal year. Take the receivables balance you want to test, and the net credit sales for that same period, in the same currency.',
      'Divide the receivables by those sales, then multiply by the number of days. With 50,000 of receivables, 500,000 of net credit sales, and 365 days, the ratio is 0.1 and the result is 36.5 days.',
    ],
  },
  {
    id: 'ending-vs-average',
    title: 'Ending A/R vs Average A/R',
    body: [
      'The ending-balance method uses one receivables figure, usually the balance on the last day of the period. It is direct, and it is sensitive to a large invoice or a large collection that landed on that day.',
      'The average method uses (beginning receivables + ending receivables) / 2. That midpoint is less swayed by a single day. It still ignores the balance in the middle of the period. This page uses the average only when you choose Use average A/R after entering both balances. It will not quietly replace an ending balance with an average.',
    ],
  },
  {
    id: 'ar-days-examples',
    title: 'Examples',
    body: [
      'Ending balance: receivables 50,000, net credit sales 500,000, period 365 days. A/R days = (50,000 / 500,000) × 365 = 36.5 days.',
      'Average balance: beginning 15,000 and ending 24,000. The average is 19,500. With 150,000 of net credit sales and 365 days, A/R days = (19,500 / 150,000) × 365 = 47.45 days.',
      'Zero receivables with positive sales yields 0 days. Zero sales with a positive balance is undefined, and the calculator leaves the result blank instead of inventing a number.',
    ],
  },
  {
    id: 'cash-flow',
    title: 'DSO and Cash Flow',
    body: [
      'Credit sales show up as revenue before the cash arrives. A longer collection period means more of that revenue is still a receivable, so operating cash lags the income statement. A shorter period moves cash in sooner, which can fund payroll, inventory, and debt service without extra borrowing.',
      'The day count does not say how much cash will arrive next week. It also ignores the timing of payables. A business can collect quickly and still be short of cash if it pays suppliers even faster.',
    ],
  },
  {
    id: 'improve-collections',
    title: 'Ways to Improve Collection',
    body: [
      'Invoice when the work or the goods are delivered, and make the due date and the payment route obvious. Confirm the customer’s billing details before the invoice goes out so it is not rejected for a missing purchase order.',
      'Send a reminder before the due date and follow up soon after it. Offer a short, clearly priced discount for early payment only if the margin can carry it. For slow accounts, agree a schedule or stop extending more credit. None of these steps is guaranteed to shorten DSO, and a shorter DSO is not useful if it costs more in discounts and staff time than the cash is worth.',
    ],
  },
];

export function ARDaysGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
        <section id="ar-days-faq" className="scroll-mt-24 pt-7">
          <h2 className="mb-5 text-[21px] font-semibold tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={[...AR_DAYS_FAQS]} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Educational estimate only. Receivables policies, tax rules, and contract terms vary. Confirm the sales
            figure and the balance with your own records.
          </p>
        </section>
      </div>
    </div>
  );
}
