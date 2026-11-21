import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GRATUITY_FAQS } from './content';

export function GratuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-gratuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Gratuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gratuity is a lump-sum thank-you employers may pay after long service.
        This calculator follows the widely used Indian Payment of Gratuity Act,
        1972 convention: fifteen days of wages per eligible year, with a month
        treated as 26 working days. It is a formula-based educational estimate —
        not a Pakistan labour-code entitlement, not legal advice, and not a
        guaranteed claim under any jurisdiction.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter final month&apos;s salary plus dearness allowance (D.A.). Change
          currency to convert that amount with stored FX rates.
        </li>
        <li>
          Enter how long you worked in years and months (default 5 years, 0
          months). Tenure is never FX-converted.
        </li>
        <li>
          Read total gratuity. Use its independent currency selector to display
          the same estimate in another denomination.
        </li>
      </ol>

      <h2
        id="gratuity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gratuity Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EligibleYears = Years + (Months &gt; 6 ? 1 : 0)</p>
        <p>
          Gratuity = (Final Monthly Salary + D.A.) × 15 / 26 × EligibleYears
        </p>
        <p>If total service months &lt; 60 → Gratuity = 0 (ordinary 5-year gate)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leftover service must exceed six months to count as another year —
        exactly six months does not round up (Act s.4(2)). Ordinary entitlement
        needs at least five years of continuous service; death/disablement
        exceptions are not modeled. The Indian Act also states a monetary
        ceiling for covered employers; this tool does not auto-cap multi-currency
        estimates. Amounts keep full precision and round only for display.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Final salary + D.A. = 50,000 · Service = 10 years 0 months</p>
        <p>EligibleYears = 10 (months not in excess of six)</p>
        <p>Gratuity = 50,000 × 15 / 26 × 10 ≈ 288,461.54</p>
      </div>

      <h2
        id="gratuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...GRATUITY_FAQS]} />
      </div>
    </article>
  );
}
