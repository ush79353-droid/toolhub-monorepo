import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TSAT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function TsatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is transferrin saturation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Transferrin is the main iron-transport protein in plasma. Transferrin
        saturation (TSAT) estimates what fraction of its iron-binding sites are
        occupied — used with ferritin and CBC context, not as a standalone
        diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Transferrin saturation formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: Fe 100 µg/dL with TIBC 400 µg/dL → 25%.
      </p>

      <h2
        id="reference"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Transferrin saturation reference values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published adult bands often cite roughly 15–50% (males) and 12–45%
        (females), but laboratory intervals vary. Always use your lab&apos;s
        reference range.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpretation of saturation values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low TSAT may accompany iron deficiency; high TSAT may accompany iron
        overload or recent iron dosing. Inflammation, diurnal variation, and
        assay method affect results — interpret with a clinician.
      </p>

      <div id="tsat-faq" className="not-prose mt-8">
        <FAQAccordion items={TSAT_FAQS} />
      </div>
    </article>
  );
}
