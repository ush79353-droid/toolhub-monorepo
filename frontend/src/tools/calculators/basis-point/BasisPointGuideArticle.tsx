import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BASIS_POINT_FAQS } from './content';

export function BasisPointGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-basis-points"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Basis Points?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basis points measure small rate changes without awkward decimals. Finance teams use them for
        interest spreads, fees, and portfolio moves where one percent is too coarse.
      </p>

      <h2
        id="basis-point-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Basis Point Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>1 bps = 0.01% = 0.0001 decimal = 0.1‰</p>
        <p>Basis Points = Decimal × 10,000</p>
        <p>Percent = Basis Points / 100</p>
        <p>Permille = Basis Points / 10</p>
        <p>Amount = (Basis Points / 10,000) × Monetary Value</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-2 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Decimal 0.01 = 1% = 10‰ = 100 bps</p>
        <p>1.5 bps of PKR 65,000 = (1.5 / 10,000) × 65,000 = PKR 9.75</p>
      </div>

      <h2 id="basis-point-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BASIS_POINT_FAQS]} />
      </div>
    </article>
  );
}
