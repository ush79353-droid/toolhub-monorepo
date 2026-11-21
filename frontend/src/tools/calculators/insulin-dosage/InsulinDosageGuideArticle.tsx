import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INSULIN_DOSAGE_FAQS } from './content';

export function InsulinDosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Insulin Dosage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this educational helper to rehearse mealtime insulin arithmetic:
        carbohydrate coverage, high-blood-sugar correction, and their sum. It
        does not replace a diabetes care plan, continuous glucose monitoring
        guidance, or clinician instructions.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Arithmetic Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Carb coverage = carbohydrate grams ÷ ICR (g/unit)</p>
        <p>Correction = max(0, (current − target) ÷ ISF)</p>
        <p>Total = coverage + correction</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sample ICR 15 g/unit, target 100 mg/dL, and ISF 50 mg/dL match the
        reference UI so you can inspect the math. Replace them with settings
        from your clinician. Zero or negative divisors are rejected.
      </p>

      <h2
        id="tdd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Daily Dose Notes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Checking &quot;I know my total daily insulin dose&quot; reveals an
        optional TDD field and educational Rule of 500 / Rule of 1800 estimates.
        Those estimates are shown only as labels — they never overwrite your ICR
        or ISF inputs.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Glucose Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current glucose, target, and sensitivity share mg/dL or mmol/L. Switching
        units converts all three fields using 1 mmol/L ≈ 18.0182 mg/dL so the
        arithmetic stays consistent.
      </p>

      <h2
        id="safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Safety and Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Correction is clamped to zero when glucose is at or below target. A soft
        warning appears under about 70 mg/dL. Always verify leaflet
        contraindications and consult your health provider before administering
        insulin. Share copies the page URL only — never your glucose or dose
        numbers.
      </p>

      <h2
        id="insulin-dosage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...INSULIN_DOSAGE_FAQS]} />
      </div>
    </article>
  );
}
