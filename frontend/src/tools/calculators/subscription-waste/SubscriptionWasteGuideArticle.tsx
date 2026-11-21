import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  BUDGET_CALCULATOR_HREF,
  FIFTY_THIRTY_TWENTY_HREF,
  SUBSCRIPTION_WASTE_FAQS,
} from './content';

export function SubscriptionWasteGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="entertainment-cost-per-month"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How much does entertainment cost per month?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Streaming TV, music, gaming, and other digital entertainment often start
        as a few small charges. Over time those recurring plans stack across
        providers until the monthly total is hard to see. Individually they may
        look inexpensive; together they can become a meaningful yearly expense.
      </p>
      <div className="my-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        Use the calculator on this page to list every recurring service and see
        combined monthly and annual spending in one place.
      </div>

      <h2
        id="subscription-illusion"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much is a subscription? The illusion of small payments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Small recurring payments, automatic billing, forgotten trials, and
        separate charges from many apps make annual cost easy to overlook.
        Subscription fatigue sets in when tracking every plan feels harder than
        keeping them.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $65 per month is $65 × 12 = <strong>$780 per year</strong>. Unused
        services quietly add to that total until you review them.
      </p>

      <h2
        id="how-to-use-subscription-waste"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the subscription waste calculator to calculate the average
        cost of entertainment per month
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Start with Streaming TV and select services you use.</li>
        <li>Enter each recurring price and billing frequency.</li>
        <li>Add E-Commerce &amp; Delivery subscriptions.</li>
        <li>Add Music &amp; Audio services.</li>
        <li>Enter Cloud Storage expenses.</li>
        <li>Add Gaming subscriptions.</li>
        <li>Include Software &amp; Productivity plans.</li>
        <li>Add Digital Tools and Other subscriptions.</li>
        <li>Review total monthly and annual spending.</li>
        <li>
          Optionally mark plans to cancel and compare potential savings without
          deleting history.
        </li>
      </ol>

      <h2
        id="average-cost-subscriptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculating your average cost of subscriptions per month
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Manually, normalize every plan to a monthly equivalent, then sum. Example:
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Subscription</th>
              <th className="px-3 py-2 font-semibold">Billing</th>
              <th className="px-3 py-2 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-t border-border">
              <td className="px-3 py-2">Netflix</td>
              <td className="px-3 py-2">Monthly</td>
              <td className="px-3 py-2">$20</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Amazon Prime Video</td>
              <td className="px-3 py-2">Monthly</td>
              <td className="px-3 py-2">$45</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Spotify</td>
              <td className="px-3 py-2">Monthly</td>
              <td className="px-3 py-2">$10</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Cloud Storage</td>
              <td className="px-3 py-2">Yearly</td>
              <td className="px-3 py-2">$120</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monthly equivalents: $20 + $45 + $10 + $10 = <strong>$85</strong>. Annual:{' '}
        $85 × 12 = <strong>$1,020</strong>. The calculator performs these
        conversions for you. For broader budgeting, try the{' '}
        <Link
          href={BUDGET_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Budget Calculator
        </Link>{' '}
        or{' '}
        <Link
          href={FIFTY_THIRTY_TWENTY_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          50/30/20 Rule Calculator
        </Link>
        .
      </p>

      <h2
        id="final-thoughts-subscription-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Final thoughts: Is the subscription price worth it?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep plans that deliver real value; cancel unused ones; avoid duplicates;
        compare monthly vs yearly billing; watch free-trial end dates; and set a
 monthly subscription budget. The goal is informed spending; not
        eliminating every service.
      </p>

      <h2
        id="subscription-waste-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FAQs
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SUBSCRIPTION_WASTE_FAQS]} />
      </div>
    </article>
  );
}
