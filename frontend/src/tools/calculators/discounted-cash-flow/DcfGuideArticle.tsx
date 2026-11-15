import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DCF_FAQS } from './content';

export function DcfGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-dcf" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is DCF?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Discounted cash flow (DCF) estimates intrinsic value by discounting expected future cash
        flows. This calculator uses a compact two-year explicit forecast and a perpetual Gordon
        growth terminal value.
      </p>

      <h2 id="fcff-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        FCFF Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Terminal Value = FCFF₂ × (1 + g) / (WACC − g)</p>
        <p className="mt-2">
          Enterprise Value = FCFF₁ / (1 + WACC) + (FCFF₂ + Terminal Value) / (1 + WACC)²
        </p>
        <p className="mt-2">Equity Value = Enterprise Value + Cash − Outstanding Debt</p>
        <p className="mt-2">Share Value = Equity Value / Outstanding Shares</p>
      </div>

      <h2 id="eps-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        EPS Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Terminal P = EPS₂ × (1 + g) / (r − g)</p>
        <p className="mt-2">Share Value = EPS₁ / (1 + r) + (EPS₂ + Terminal P) / (1 + r)²</p>
        <p className="mt-2">Equity Value = Share Value × Outstanding Shares</p>
        <p className="mt-2">r = cost of equity (not WACC)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPS mode assumes earnings per share can be capitalized as an equity earnings stream. It does
        not treat EPS as free cash flow to the firm and does not use WACC or net-debt bridge to
        enterprise value.
      </p>

      <h2 id="dcf-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DCF_FAQS]} />
      </div>
    </article>
  );
}
