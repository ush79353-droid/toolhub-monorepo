import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MAP_FAQS, SOURCE_LABEL } from './content';

export function MeanAirwayPressureGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is mean airway pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mean airway pressure (Pmean or Paw) summarizes the average pressure
        applied to the airway over the respiratory cycle. This worksheet is
        educational only.
      </p>

      <h2
        id="inspiratory-time"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate inspiratory time?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inspiratory time (Ti) is the portion of the cycle spent in inspiration.
        It must not exceed total cycle time (Ttot).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate mean airway pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pmean = PEEP + k × (PIP − PEEP) × (Ti / Ttot). With frequency selected,
        Ttot (seconds) = 60 / frequency. Example: PEEP 5, PIP 25, k 1, duty 0.25
        → 10 cmH₂O.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the mean airway pressure calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose total cycle time or frequency, enter Ti, waveform factor k, PEEP,
        and PIP. The result updates when inputs are valid.
      </p>

      <h2
        id="normal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the normal mean airway pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Acceptable ranges depend on mode, disease, and goals of ventilation.
        This page does not prescribe targets.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="map-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MAP_FAQS]} />
      </div>
    </article>
  );
}
