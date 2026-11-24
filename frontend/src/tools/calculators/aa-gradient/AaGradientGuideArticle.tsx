import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AA_GRADIENT_FAQS, SOURCE_LABEL } from './content';

export function AaGradientGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Aa Gradient Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the difference between alveolar and arterial oxygen tension to
        help frame causes of hypoxemia. Educational only — not a substitute for
        clinical ABG interpretation.
      </p>

      <h2
        id="use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Aa Gradient Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A normal (age-appropriate) gradient with low PaO₂ points toward
        hypoventilation or low inspired oxygen. A widened gradient suggests
        intrapulmonary V/Q mismatch, shunt, or diffusion limitation.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PAO₂ = FiO₂ × (Patm − 47 mmHg) − PaCO₂ / 0.8, then A–a = PAO₂ − PaO₂.
        FiO₂ is entered as a percent; water vapor assumes body temperature 37 °C.
      </p>

      <h2
        id="expected"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Expected for Age
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expected A–a ≈ age/4 + 4 mmHg when age is provided. Leave age blank to
        compute only the measured gradient.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gradients rise on supplemental oxygen; R varies with metabolism; use the
        correct barometric pressure at altitude. This tool does not replace
        PaO₂/FiO₂ or clinical judgment.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="aa-gradient-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...AA_GRADIENT_FAQS]} />
      </div>
    </article>
  );
}
