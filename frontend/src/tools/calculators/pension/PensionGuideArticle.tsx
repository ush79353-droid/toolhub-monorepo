import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PENSION_FAQS } from './content';

export function PensionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Pension Calculator Compares
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many defined-benefit plans offer a choice between a one-time lump sum and
        a lifetime (or period-certain) monthly pension. This calculator compares
        investing the lump sum and withdrawing an amount equal to the COLA-adjusted
        pension versus simply receiving the pension. It is a teaching and planning
        aid — not a recommendation and not personalized advice.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Comparison Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>rm = (1 + r)<sup>1/12</sup> − 1</p>
        <p>Each month: Balance ← Balance × (1 + rm) − MonthlyPension</p>
        <p>Each year: MonthlyPension ← MonthlyPension × (1 + COLA)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The yearly table shows age, annual pension paid that year, cumulative
        pension received, and the remaining invested lump sum after matching
        withdrawals. Highlighted rows mark the year the balance reaches zero.
      </p>

      <h2
        id="cola"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cost-of-Living Adjustment (COLA)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        COLA is modeled as an annual step-up after every twelve monthly payments.
        Real plan COLA rules vary (caps, floors, CPI formulas, or no COLA). Enter
        the adjustment that matches your plan documents.
      </p>

      <h2
        id="break-even"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Break-Even
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depletion break-even is the age when the invested lump sum runs out while
        funding the same cash flows as the pension. Living longer than that age
        tends to favor the pension under these assumptions; a shorter lifespan can
        favor the lump sum. Neither outcome is universally better.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations and Disclaimer
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Constant investment return; no sequence-of-returns stress testing.</li>
        <li>No taxes, fees, survivor options, or guarantee valuation.</li>
        <li>Currency selection formats amounts only; no FX conversion.</li>
        <li>
          Plan rules differ widely. Confirm figures with your administrator before
          electing a form of payment.
        </li>
      </ul>

      <div id="pension-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...PENSION_FAQS]} />
        </div>
      </div>
    </article>
  );
}
