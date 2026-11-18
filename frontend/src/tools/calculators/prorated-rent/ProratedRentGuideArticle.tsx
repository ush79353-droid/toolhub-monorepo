import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRORATED_RENT_FAQS } from './content';

export function ProratedRentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-prorated-rent"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Prorated Rent?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prorated rent is the share of a full monthly rent that covers only the days you occupy
        the unit in a move-in or move-out month. Enter your move status, move date, and monthly
        rent to estimate the chargeable amount using actual calendar days.
      </p>

      <h2
        id="prorated-rent-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Daily Rent = Monthly Rent ÷ Days in Month</p>
        <p>Moving in: Chargeable Days = Days in Month − Moving Day + 1</p>
        <p>Moving out: Chargeable Days = Moving Day</p>
        <p>Prorated Rent = Daily Rent × Chargeable Days</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Moving in on 2026-11-17 · Monthly rent = PKR 30,000 · November has 30 days</p>
        <p>Chargeable days = 30 − 17 + 1 = 14</p>
        <p>Daily rent = 30,000 ÷ 30 = 1,000</p>
        <p>Prorated rent = 1,000 × 14 = PKR 14,000.00</p>
      </div>

      <h2
        id="prorated-rent-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PRORATED_RENT_FAQS]} />
      </div>
    </article>
  );
}
