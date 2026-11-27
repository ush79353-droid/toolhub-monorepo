import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BODY_TYPE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BodyTypeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Body Type Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an apparel body-shape label from bust, waist, high hip, and hip
        circumferences. Designed for female fashion-fit context — not a medical
        or fitness diagnosis. Waist-hip ratio is shown alongside the shape for
        context.
      </p>

      <h2
        id="shapes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Female body shapes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fashion writing often groups shapes as apple/inverted triangle,
        banana/rectangle, pear/triangle, and hourglass. This calculator uses the
        finer seven-way Lee/Istook rule set (including bottom/top hourglass and
        spoon) as published by calculator.net.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Classification rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Measurements are converted to inches before the inch-based
        cutoffs are applied. Overlapping profiles return the first match in that
        order.
      </p>

      <h2
        id="whr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Waist-hip ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WHR = waist ÷ full hip. Example: waist 60 cm and hip 90 cm → 0.667. WHR
        is a separate metric from the apparel shape label and is not used to
        pick the seven FFIT branches.
      </p>

      <div id="bt-faq" className="not-prose mt-8">
        <FAQAccordion items={BODY_TYPE_FAQS} />
      </div>
    </article>
  );
}
