import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  DISCLAIMER,
  LUNG_CAPACITY_FAQS,
  SOURCE_NOTE,
} from './content';

export function LungCapacityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Lung Capacity Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter measured lung volumes to derive standard capacities used when
        teaching spirometry relationships.
      </p>

      <h2
        id="tlc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total lung capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TLC = IRV + TV + ERV + RV.
      </p>

      <h2
        id="vc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Vital capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VC = IRV + TV + ERV.
      </p>

      <h2
        id="ic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inspiratory capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IC = IRV + TV.
      </p>

      <h2
        id="frc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Functional residual capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FRC = ERV + RV. {SOURCE_NOTE} {DISCLAIMER}
      </p>

      <div id="lung-capacity-faq" className="not-prose mt-8">
        <FAQAccordion items={LUNG_CAPACITY_FAQS} />
      </div>
    </article>
  );
}
