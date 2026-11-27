import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BODY_SHAPE_CLASSIFICATION_NOTE, BODY_SHAPE_FAQS } from './content';

export function BodyShapeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Body Shape Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a female apparel body-shape label from bust, waist, high hip,
        and hip circumferences. Result text follows the form “Body shape is …”
        once all four measurements are valid. Educational context only — not a
        medical or fitness diagnosis.
      </p>

      <h2
        id="shapes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Female body shapes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common fashion writing uses pear (triangle), apple (inverted triangle),
        rectangle, and hourglass. This tool applies the finer seven-way
        Lee/Istook table — including bottom hourglass, top hourglass, and spoon —
        as reproduced by calculator.net.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How classification works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {BODY_SHAPE_CLASSIFICATION_NOTE}
      </p>

      <div id="bs-faq" className="not-prose mt-8">
        <FAQAccordion items={BODY_SHAPE_FAQS} />
      </div>
    </article>
  );
}