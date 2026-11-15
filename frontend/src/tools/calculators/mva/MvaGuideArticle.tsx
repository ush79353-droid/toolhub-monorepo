import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MVA_FAQS } from './content';

export function MvaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-mva" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is MVA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market value added (MVA) measures how much value the market assigns above the capital
        invested in a business. This calculator estimates equity market value as share price times
        shares outstanding, then subtracts capital invested.
      </p>

      <h2 id="mva-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current Market Value = Current Share Price × Shares Outstanding</p>
        <p>MVA = Current Market Value − Capital Invested</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current share price = PKR 150</p>
        <p>Shares outstanding = 10,000</p>
        <p>Current market value = 150 × 10,000 = PKR 1,500,000</p>
        <p>Capital invested = PKR 1,000,000</p>
        <p>MVA = 1,500,000 − 1,000,000 = PKR 500,000</p>
      </div>

      <h2 id="mva-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MVA_FAQS]} />
      </div>
    </article>
  );
}
