import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NI_FAQS } from './content';

export function NationalInsuranceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is National Insurance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        National Insurance (NI) contributions help fund UK state benefits such as
        the State Pension. Employees usually pay Class 1 through PAYE.
        Self-employed people usually pay Class 4 on profits (and historically
        Class 2). Rates and thresholds are set by HMRC for each tax year.
      </p>

      <h2
        id="how-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter annual employment income and self-employment net profits, choose a
        tax year, and read the estimated NI. Employment income feeds employee
        Class 1 only. Self-employment profits feed Class 4 only. The two amounts
        are then added. Total annual income is shown for convenience and is not
        used as a single combined NI base.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Class 1 = 8% × max(0, min(E, UEL) − PT) + 2% × max(0, E − UEL)</p>
        <p>Class 4 = 6% × max(0, min(P, UPL) − LPL) + 2% × max(0, P − UPL)</p>
        <p>Total NI = Class 1 + Class 4</p>
        <p>Example: E = £40,000 → Class 1 = £2,194.40 (2024/25–2026/27)</p>
      </div>

      <h2
        id="class-1"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Employee Class 1
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For category A employees in 2024/25–2026/27, the Primary Threshold and
        Upper Earnings Limit are £12,570 and £50,270 a year. The main employee
        rate between those limits is 8%; earnings above the upper limit are
        charged at 2%. Employer secondary NI is not included here.
      </p>

      <h2
        id="class-4"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Self-Employed Class 4
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Class 4 uses the same £12,570 / £50,270 annual limits for these years,
        with 6% between the limits and 2% above. From 6 April 2024, Class 2 is
        generally not payable when profits are at or above the small profits
        threshold (HMRC treats Class 2 as paid to protect the NI record).
      </p>

      <h2
        id="tax-years"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Supported Tax Years
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool supports 2024/25, 2025/26, and 2026/27 using HMRC published
        rates. Older screenshot years such as 2021/22 are omitted because rates
        changed materially (including mid-year employee rate cuts).
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annualised estimate only. Does not model directors&apos; annual
        earnings period rules, married women&apos;s reduced rates, deferment,
        multiple employments with shared thresholds, or Income Tax. Not a
        substitute for HMRC calculators or professional advice.
      </p>

      <h2
        id="ni-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...NI_FAQS]} />
      </div>
    </article>
  );
}
