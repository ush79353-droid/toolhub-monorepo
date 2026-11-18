import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BETA_STOCK_FAQS } from './content';

export function BetaStockGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-stock-beta"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Stock Beta?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stock beta compares an asset’s return series with a benchmark. It is dimensionless and
        answers how much the asset tends to move when the benchmark moves.
      </p>

      <h2
        id="stock-beta-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Stock Beta Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Asset return(t) = Asset(t) ÷ Asset(t−1) − 1</p>
        <p>Benchmark return(t) = Benchmark(t) ÷ Benchmark(t−1) − 1</p>
        <p>β = Cov(asset returns, benchmark returns) ÷ Var(benchmark returns)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Days: asset 50, 55, 50, 60 — benchmark 100, 110, 100, 120</p>
        <p>Returns match: +10%, ≈ −9.09%, +20% for both series</p>
        <p>Stock beta = 1.00</p>
      </div>

      <h2
        id="beta-stock-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BETA_STOCK_FAQS]} />
      </div>
    </article>
  );
}
