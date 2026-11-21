export function LevothyroxineDosageGuideArticle() {
  return (
    <div className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Levothyroxine Dosage — Educational Explorer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Levothyroxine replaces thyroid hormone in hypothyroidism and related
          indications. Dose selection is individualized. This page mirrors the
          approved screenshot fields and explains why Omega will not emit a
          patient-specific mcg/day result without clinical approval.
        </p>
      </section>

      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter sex, age band, weight, optional height, FT4 Low/Normal, and heart
          disease Yes/No. Review the status message under Levothyroxine dose.
          Share uses the public page URL only — never your measurements.
        </p>
      </section>

      <section id="fda-label" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FDA Label Context</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          SYNTHROID DailyMed labeling (updated February 20, 2024; setid
          1e11ad30-1041-4520-10b0-8f9d30d30fcc) states adult full replacement is
          about 1.6 mcg/kg/day, with lower starting doses for geriatric patients
          or adults with underlying cardiac disease / atrial-fibrillation risk,
          titrated using serum TSH or free-T4. Peak effect of a given dose may
          take 4–6 weeks.
        </p>
      </section>

      <section id="limits" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Why mcg/day Is Not Shown
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Missing or insufficient for automatic prescribing: confirmed diagnosis
          and indication, complete labs, pregnancy status, concomitant drugs,
          exact age, and specialist review. FT4 Low/Normal and heart disease
          Yes/No are not enough to authorize a published personal dose here.
        </p>
      </section>

      <section id="levo-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
      </section>
    </div>
  );
}
