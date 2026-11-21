import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DSO_FAQS } from './content';

export function DsoGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dso"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Days Sales Outstanding? The DSO Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Days Sales Outstanding (DSO), also called the average collection period,
        estimates how long a business takes, on average, to collect accounts
        receivable relative to sales. It links average receivables to sales over
        a defined reporting period and supports credit, collections, and cash
        planning analysis.
      </p>

      <h2
        id="dso-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate DSO? Understanding the Days Sales Outstanding Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        DSO = (Average AR / Sales) × T
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net credit sales is generally the more appropriate denominator because
        receivables arise mainly from credit transactions. Total sales is the
        reference default and a proxy when credit sales are unavailable.
      </p>

      <h2
        id="average-ar"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Accounts Receivable
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average AR = (Beginning AR + Ending AR) / 2
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: beginning 20,000 and ending 35,000 → average 27,500. For highly
        seasonal businesses, more frequent averages may be more representative.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete DSO Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beginning AR 20,000 · Ending 35,000 → Average 27,500. Sales 500,000 ·
        Period 365 days → DSO = (27,500 / 500,000) × 365 = 20.075 days (displayed
        20.08).
      </p>

      <h2
        id="purpose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Purpose of DSO – Why Should We Calculate DSO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DSO supports accounts receivable management, customer payment analysis,
        cash-flow planning, working-capital reviews, credit-policy evaluation,
        collection efficiency monitoring, and financial performance discussions.
      </p>

      <h2
        id="good-dso"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good DSO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An appropriate DSO depends on customer payment terms, industry, sales
        mix, contract arrangements, seasonality, and economic conditions. There
        is no universal ideal number of days.
      </p>

      <h2
        id="reduce-dso"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce DSO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common levers include accurate prompt invoicing, stronger collection
        procedures, convenient payment methods, reviewed credit terms, overdue
        monitoring, billing automation, dispute resolution, and carefully
        evaluated payment incentives. Excessively restrictive credit policies
        may affect customer relationships and revenue.
      </p>

      <h2
        id="vs-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DSO vs. Accounts Receivable Turnover
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        AR Turnover = Sales / Average AR
        <br />
        DSO = T / AR Turnover (when turnover &gt; 0)
      </div>

      <h2
        id="vs-dio-dpo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DSO vs. DIO vs. DPO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DSO measures collection days, DIO measures inventory holding days, and
        DPO measures supplier payment days. Each describes a different part of
        the operating cash cycle.
      </p>

      <h2
        id="ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DSO and Cash Conversion Cycle
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CCC = DIO + DSO − DPO
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reducing DSO lowers measured CCC when other components are unchanged.
        Use the{' '}
        <a
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle Calculator
        </a>{' '}
        with{' '}
        <a
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO
        </a>{' '}
        and{' '}
        <a
          href="/tools/dpo-calculator-days-payable-outstanding"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DPO
        </a>
        .
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common DSO Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing financial periods or currencies.</li>
        <li>Using cash and credit sales inconsistently.</li>
        <li>Using ending AR alone without disclosure.</li>
        <li>Ignoring seasonal sales and collections.</li>
        <li>Dividing by zero sales.</li>
        <li>Rounding intermediate calculations too early.</li>
        <li>Treating DSO as each invoice&apos;s exact payment time.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the DSO Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DSO is an accounting estimate. Sales timing, seasonality, total-sales
        proxies, aging detail, customer credit quality, and accounting policies
        all affect interpretation. Industry benchmarks vary. This tool provides
        educational estimates only — not accounting, audit, or investment
        advice.
      </p>

      <h2
        id="dso-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...DSO_FAQS]} />
      </div>
    </article>
  );
}
