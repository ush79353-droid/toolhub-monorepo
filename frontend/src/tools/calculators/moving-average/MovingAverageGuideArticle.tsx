import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MOVING_AVERAGE_FAQS } from './content';

export function MovingAverageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-moving-average"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Moving Average?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simple moving average (SMA) averages the most recent prices over a chosen length. Traders
        and analysts use it to smooth noise and highlight the underlying trend of a price series.
      </p>

      <h2
        id="moving-average-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>SMA = Sum of the latest N prices / N</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Length = 3</p>
        <p>Price #1 = PKR 100, Price #2 = PKR 120, Price #3 = PKR 140</p>
        <p>SMA = (100 + 120 + 140) / 3 = PKR 120</p>
        <p className="mt-2">With a fourth price of PKR 160, latest SMA = (120 + 140 + 160) / 3 = PKR 140</p>
      </div>

      <h2
        id="moving-average-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MOVING_AVERAGE_FAQS]} />
      </div>
    </article>
  );
}
