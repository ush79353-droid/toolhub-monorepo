import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AMOXICILLIN_PEDIATRIC_FAQS } from './content';

export function AmoxicillinPediatricDosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This educational tool helps convert a pediatric amoxicillin{' '}
        <strong>mg/kg/dose</strong> requirement into a single-dose mass (mg) and,
        for oral suspension, a volume (mL) at a chosen strength (125 / 200 / 250 /
        400 mg per 5 mL). Optional labeled regimens cover general dosing, Group A
        strep pharyngitis, and endocarditis prophylaxis. It does not replace a
        clinician, the product leaflet, or local formulary rules.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dose and Suspension Math
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>dose_mg = weight_kg × (mg/kg/dose)</p>
        <p>mg_per_mL = strength_mg_per_5_mL ÷ 5</p>
        <p>volume_mL = dose_mg ÷ mg_per_mL</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 10 kg × 15 mg/kg/dose = 150 mg. At 125 mg/5 mL (25 mg/mL), volume
        = 150 ÷ 25 = 6 mL.
      </p>

      <h2
        id="regimens"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labeled Regimen Sources
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>General (oral):</strong> informational WHO-style range about
          15–30 mg/kg/dose every 8 hours (suggested start 15), with common single-dose
          and daily maxima noted in the UI.
        </li>
        <li>
          <strong>General (IV):</strong> informational WHO-style range about
          30–60 mg/kg/dose every 8 hours (suggested start 30). Local IV product
          availability varies.
        </li>
        <li>
          <strong>Strep A (oral):</strong> CDC / IDSA-aligned amoxicillin once-daily
          regimens (50 mg/kg once daily max 1 g; weight bands for fixed doses),
          typically 10 days.
        </li>
        <li>
          <strong>Endocarditis prophylaxis (oral):</strong> AHA single dose 50
          mg/kg (max 2 g) 30–60 minutes before the procedure. IV amoxicillin is
          not offered—AHA lists ampicillin (or alternatives) when oral dosing is
          not possible.
        </li>
      </ul>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age (months or years) and weight (kg or lb).</li>
        <li>Select suspension strength, indication, and route.</li>
        <li>
          Review the suggested requirement and dose, or override mg/kg/dose /
          dose for a clinician-entered check.
        </li>
        <li>Confirm volume only for oral suspension; IV results stay in mg.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Supported ages are 1 month through 18 years. Renal adjustment, allergy,
        culture results, combination products (e.g., with clavulanate), and
        jurisdiction-specific labels are out of scope. Share Result never includes
        clinical inputs—only the public page URL.
      </p>

      <h2
        id="amox-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...AMOXICILLIN_PEDIATRIC_FAQS]} />
      </div>
    </article>
  );
}
