import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { URINE_OUTPUT_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function UrineOutputGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-to-use"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How to use the urine output calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter patient age group, body weight, collection interval, and measured
        urine volume. Optional fluid intake supports a simple balance estimate.
        Values are not saved.
      </p>

      <h2
        id="rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate urine output in ml/kg/hr
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Fixture: 1680 mL over 24 hours at 70 kg → 1.0 mL/kg/h.
      </p>

      <h2
        id="fluid-balance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fluid balance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When intake is entered, balance = intake − urine. Insensible water loss
        (~400–800 mL/day in adults, higher with fever or burns), stool, sweat,
        and unmeasured losses are intentionally omitted — this is not a full
        I&amp;O sheet.
      </p>

      <h2
        id="normal-output"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What&apos;s the normal hourly urine output?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many references cite roughly 0.5–2 mL/kg/h as a common adult range.
        Pediatric teaching often uses a 1 mL/kg/h floor when screening for
        oliguria. Individual targets depend on clinical context — confirm with
        your care team.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>

      <div id="urine-output-faq" className="not-prose mt-8">
        <FAQAccordion items={URINE_OUTPUT_FAQS} />
      </div>
    </article>
  );
}