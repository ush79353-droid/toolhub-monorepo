import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEAD_SPACE_FAQS, SOURCE_LABEL } from './content';

export function DeadSpaceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Dead Space Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate physiologic dead space volume from tidal volume and CO₂
        partial pressures using the Bohr equation. Educational only.
      </p>

      <h2
        id="bohr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bohr Equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VD = VT × (PACO₂ − PECO₂) / PACO₂. Both CO₂ values must use the same
        pressure unit. Zero PACO₂ is rejected (division by zero).
      </p>

      <h2
        id="enghoff"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Enghoff Note
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Substituting arterial PaCO₂ for alveolar PACO₂ (Enghoff) is a common
        bedside approximation and can differ from true alveolar Bohr dead
        space.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Requires mixed-expired PECO₂. Without it, Bohr VD is unavailable. This
        tool does not separate anatomic from alveolar dead space components.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="dead-space-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...DEAD_SPACE_FAQS]} />
      </div>
    </article>
  );
}
