import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SHARPE_RATIO_FAQS } from './content';

export function SharpeRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-sharpe-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Sharpe Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Sharpe ratio compares an investment&apos;s excess return over the risk-free rate to
        its total volatility. It answers how much risk premium you earned for each unit of
        standard deviation.
      </p>

      <h2
        id="sharpe-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sharpe Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Risk Premium (%) = Investment Return − Risk-Free Return</p>
        <p className="mt-2">Sharpe Ratio = Risk Premium ÷ Standard Deviation</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Return = 12%</p>
        <p>Risk-free return = 4%</p>
        <p>Standard deviation = 8%</p>
        <p>Risk premium = 12 − 4 = 8%</p>
        <p>Sharpe ratio = 8 ÷ 8 = 1.00</p>
      </div>

      <h2
        id="sharpe-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SHARPE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
