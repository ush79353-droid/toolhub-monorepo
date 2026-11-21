import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOSS_RATIO_FAQS } from './content';

export function LossRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-loss-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is the loss ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 The loss ratio (also called the insurance loss ratio or underwriting loss ratio) measures
        how claim-related costs relate to earned premiums for a reporting period. It shows what
        portion of premiums was spent on claims and loss adjustment expenses.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insurers, underwriters, and analysts use it to assess claims experience, pricing pressure,
        underwriting performance, claims-management effectiveness, portfolio results, and early
 signs of profitability stress; always with consistent accounting definitions.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loss Ratio = (Claims Paid + Loss Adjustment Expenses) / Earned Premiums × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: an insurer earns PKR 1,000,000 in premiums, pays PKR 500,000 in claims, and incurs
        PKR 50,000 in loss adjustment expenses. Loss ratio = (500,000 + 50,000) / 1,000,000 × 100 =
        55%. That means 55% of earned premiums was consumed by those loss-related costs.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator follows a <strong>paid-claims</strong> definition matching the reference
        interface. An incurred loss ratio may also include reserve changes and other adjustments, so
        it can differ from the result shown here.
      </p>

      <h2 id="how-to-calculate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to calculate the loss ratio?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Determine earned premiums</strong>: premiums recognized as revenue for the period
          (not necessarily total written premiums).
        </li>
        <li>
 <strong>Determine insurance claims paid</strong>: actual claim payments in that period.
        </li>
        <li>
 <strong>Determine loss adjustment expenses</strong>: costs to investigate, handle,
          evaluate, and settle claims (adjuster fees, related legal costs, settlement administration,
          and similar items under your reporting rules).
        </li>
        <li>
          <strong>Add claims and expenses:</strong> Total Losses = Claims Paid + Loss Adjustment
          Expenses.
        </li>
        <li>
          <strong>Divide by earned premiums:</strong> Loss Ratio = (Total Losses / Earned Premiums)
          × 100.
        </li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-accent">Company Alpha example</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total premiums earned $10,000,000; insurance claims paid $3,500,000; loss adjustment
        expenses $1,800,000.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Total loss-related costs = 3,500,000 + 1,800,000 = $5,300,000</li>
        <li>Loss ratio = (5,300,000 / 10,000,000) × 100 = 53.00%</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpretation: the company incurred $53 of claim payments and loss adjustment expenses for
 every $100 of earned premiums. The remaining $47 per $100 is not automatically net profit; 
        underwriting expenses, commissions, administration, taxes, and other obligations may still
        apply.
      </p>

      <h3 className="mt-6 text-base font-semibold text-accent">More worked examples</h3>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Low: premiums 1,000,000; claims 250,000; LAE 50,000 → ((250,000 + 50,000) / 1,000,000) ×
          100 = <strong>30.00%</strong>
        </li>
        <li>
          Moderate: premiums 2,000,000; claims 1,200,000; LAE 100,000 →{' '}
          <strong>65.00%</strong>
        </li>
        <li>
          High: premiums 1,000,000; claims 950,000; LAE 100,000 → <strong>105.00%</strong> (costs
          exceed premiums)
        </li>
        <li>
          Zero claims and expenses with positive premiums → <strong>0.00%</strong>
        </li>
        <li>
          Zero earned premiums → validation error; the calculator never shows Infinity or NaN
        </li>
      </ul>

      <h2 id="how-to-interpret" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to interpret loss ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A lower loss ratio generally means a smaller share of earned premiums went to claims and
        loss adjustment expenses. That can reflect favorable claims experience, but an unusually low
        ratio does not automatically mean pricing is sound or the company is financially healthy.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A higher loss ratio means more of the premium base is absorbed by claim-related costs. Above
 100%, those costs exceed earned premiums for the period under this definition; an
        underwriting loss from loss-related costs alone, before other expenses.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expected ranges differ across health, life, property, casualty, motor, and commercial lines.
        Do not treat any single band as a universal benchmark.
      </p>

      <h2 id="vs-combined-ratio" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Loss ratio vs. combined ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Loss ratio</strong> measures claim-related costs relative to earned premiums.{' '}
        <strong>Expense ratio</strong> measures underwriting and operating expenses relative to the
        applicable premium base. <strong>Combined ratio</strong> adds them:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Combined Ratio = Loss Ratio + Expense Ratio</p>
        <p>Example: Loss Ratio 65% + Expense Ratio 25% = Combined Ratio 90%</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under consistent underwriting definitions, a combined ratio below 100% generally indicates
        an underwriting profit before investment income and other non-underwriting items. A loss
        ratio alone does not capture every expense an insurer incurs. Numerators and denominators
        must stay consistent when the ratios are combined.
      </p>

      <h2 id="related-calculators" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/combined-ratio-calculator" className="text-primary hover:underline">
            Combined Ratio Calculator
          </Link>{' '}
; loss ratio plus expense ratio for underwriting performance
        </li>
        <li>
          <Link href="/tools/expense-ratio-calculator" className="text-primary hover:underline">
            Expense Ratio Calculator
          </Link>{' '}
; underwriting expenses relative to premiums
        </li>
        <li>
          <Link href="/tools/operating-margin-calculator" className="text-primary hover:underline">
            Operating Margin Calculator
          </Link>{' '}
; broader operating profitability context
        </li>
      </ul>

      <h2 id="loss-ratio-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...LOSS_RATIO_FAQS]} />
      </div>
    </article>
  );
}
