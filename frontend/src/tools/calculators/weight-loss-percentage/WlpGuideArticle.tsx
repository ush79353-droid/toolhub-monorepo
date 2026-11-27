import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WLP_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function WlpGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Weight Loss Percentage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute total weight change and percent change from a past weight and a
        current weight. Educational tracking worksheet — not medical advice.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weight loss percentage formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: past 80 kg, current 72 kg → loss 8 kg and 10%.
      </p>

      <div id="wlp-faq" className="not-prose mt-8">
        <FAQAccordion items={WLP_FAQS} />
      </div>
    </article>
  );
}
