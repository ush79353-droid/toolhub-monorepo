import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BAI_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BaiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BAI Calculator - Body Adiposity Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate percent body fat from height and hip circumference using the
        Body Adiposity Index. Educational cohort estimate — not imaging or
        densitometry.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Body Adiposity Index formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: height 1.75 m, hip 100 cm → BAI ≈ 100 /
        1.75^1.5 − 18 ≈ 25.2%.
      </p>

      <div id="bai-faq" className="not-prose mt-8">
        <FAQAccordion items={BAI_FAQS} />
      </div>
    </article>
  );
}
