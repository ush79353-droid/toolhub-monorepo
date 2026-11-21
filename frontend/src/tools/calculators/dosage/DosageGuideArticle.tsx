import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DOSAGE_FAQS } from './content';

export function DosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Dosage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert an already-specified mass-per-kilogram order into a dose amount
        and optional liquid volume. This page is educational arithmetic—not a
        prescribing aid and not a substitute for a clinician or product label.
      </p>

      <h2
        id="what-it-does"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You supply body weight, a dosage rate in mg/kg, mcg/kg, or g/kg, how
        often the medicine is given, and whether that rate is written per day or
        per administration. The tool returns mass per dose and per day. With a
        concentration, it also returns millilitres per administration.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Per day: daily = weight_kg × rate; per dose = daily ÷ frequency</p>
        <p>Per administration: per dose = weight_kg × rate; daily = per dose × frequency</p>
        <p>Liquid mL = mass per dose ÷ concentration (matched mass units)</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter weight and the ordered dosage rate with its mass unit.</li>
        <li>Choose per-day vs per-administration basis.</li>
        <li>Select frequency.</li>
        <li>Optionally open Liquid medicine and enter concentration for mL.</li>
      </ol>

      <h2
        id="liquid"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Liquid Medicine
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Concentration must be positive. Milligrams and micrograms are converted
        explicitly (1 mg = 1,000 mcg). Volume is for the per-administration mass.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No age bands, renal adjustments, max daily caps, or drug-specific
        schedules are applied. Share actions send only the public URL.
      </p>

      <div id="dosage-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...DOSAGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
