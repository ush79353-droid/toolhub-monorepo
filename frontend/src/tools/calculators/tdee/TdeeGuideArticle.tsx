import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TDEE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function TdeeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">
        TDEE Calculator
      </h2>
      <p className="mt-3 text-sm text-foreground/90">
        Educational total daily energy expenditure and basal metabolic rate estimates.
      </p>
      <h2 id="formula" className="mt-8 text-lg font-bold text-accent">
        Formula
      </h2>
      <p className="mt-3 text-sm">{SOURCE_NOTE}</p>
      <div id="faq" className="mt-8">
        <FAQAccordion items={[...TDEE_FAQS]} />
      </div>
    </article>
  );
}
