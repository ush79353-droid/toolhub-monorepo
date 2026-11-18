import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FREE_CASH_FLOW_FAQS } from './content';

export function FreeCashFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-free-cash-flow"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Free Cash Flow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free cash flow (FCF) is the cash a business generates after paying for
        operations and capital expenditures. Enter operating cash flow and CapEx
        (as positive spending), then optionally add shares, market capitalization,
        and revenue for per-share FCF, FCF yield, and FCF margin.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter operating cash flow and capital expenditures (positive spending).
          Read free cash flow = OCF − CapEx.
        </li>
        <li>
          Expand free cash flow per share and enter shares outstanding when you
          want FCF per share.
        </li>
        <li>
          Enter market capitalization for FCF yield %, and revenue for FCF
          margin %. Change a money field&apos;s currency to convert that amount
          with stored FX rates; percentages and share counts never convert.
        </li>
      </ol>

      <h2
        id="fcf-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Free Cash Flow Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FCF = Operating Cash Flow − Capital Expenditures</p>
        <p>FCF per Share = FCF ÷ Shares Outstanding</p>
        <p>FCF Yield (%) = FCF ÷ Market Capitalization × 100</p>
        <p>FCF Margin (%) = FCF ÷ Revenue × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CapEx is entered as a positive spending amount and subtracted from OCF.
        Negative FCF and negative margins are allowed. Yield uses market cap
        (stock price alone does not invent market cap). Amounts keep full
        precision and round only for display.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Operating cash flow = 500,000 PKR · CapEx = 120,000 PKR</p>
        <p>FCF = 500,000 − 120,000 = 380,000 PKR</p>
        <p>Shares = 100,000 → FCF/share = 3.80 PKR</p>
        <p>Market cap = 3,800,000 PKR → yield = 10%</p>
        <p>Revenue = 2,000,000 PKR → margin = 19%</p>
      </div>

      <h2
        id="fcf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FREE_CASH_FLOW_FAQS]} />
      </div>
    </article>
  );
}
