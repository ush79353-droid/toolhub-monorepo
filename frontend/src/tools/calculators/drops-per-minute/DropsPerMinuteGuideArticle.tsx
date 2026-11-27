import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DROPS_PER_MINUTE_FAQS } from './content';

export function DropsPerMinuteGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Drops Per Minute Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate intravenous drops per minute (gtts/min) from infusion volume,
        duration, and tubing drop factor. Educational worksheet only.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate drops per minute
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Drops/min = (volume mL × drop factor gtts/mL) ÷ time minutes. Example:
        100 mL over 60 min with factor 15 → 25 gtts/min, 1500 gtts/h, and 100
        mL/h.
      </p>

      <h2
        id="factor"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Drop factor equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Drop factor is the tubing calibration in drops per millilitre (gtts/mL).
        Common teaching defaults include 10, 15, 20, and 60 gtts/mL. This tool
        defaults to 15.
      </p>

      <div id="dpm-faq" className="not-prose mt-8">
        <FAQAccordion items={DROPS_PER_MINUTE_FAQS} />
      </div>
    </article>
  );
}
