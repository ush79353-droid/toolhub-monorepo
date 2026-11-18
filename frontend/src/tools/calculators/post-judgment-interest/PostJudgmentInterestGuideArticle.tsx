import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { POST_JUDGMENT_INTEREST_FAQS } from './content';

export function PostJudgmentInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-post-judgment-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Post-Judgment Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Post-judgment interest is simple interest that can accrue on a money judgment from the date
        of judgment until payment or another cutoff such as a writ. This calculator estimates that
        accrual in USD from the amount, annual rate, and civil days between the judgment and writ
        dates. It does not decide which rate a court applies.
      </p>

      <h2
        id="post-judgment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Elapsed Days = calendar days from Date of Judgment to Date of Writ</p>
        <p className="mt-2">Weeks = floor(Elapsed Days / 7) · Leftover Days = Elapsed Days mod 7</p>
        <p className="mt-2">
          Accumulated Interest = Judgment × (Rate / 100) × (Elapsed Days / 365)
        </p>
        <p className="mt-2">Same day → 0 days → $0.00 · Rate 0% → $0.00</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Judgment = $10,000 · Rate = 5% · 73 elapsed days (10 wks + 3 days)</p>
        <p>Interest = 10,000 × 0.05 × (73 / 365) ≈ $100.00</p>
      </div>

      <h2
        id="post-judgment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...POST_JUDGMENT_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
