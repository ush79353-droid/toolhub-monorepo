export function LevothyroxineDosageGuideArticle() {
  return (
    <div className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Levothyroxine Dosage — Educational Teaching Estimate
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Levothyroxine replaces thyroid hormone in hypothyroidism. Dose
          selection is individualized. This page mirrors the approved screenshot
          fields and may show an educational teaching mcg/day figure only for the
          verified healthy-adult overt-hypothyroidism branch.
        </p>
      </section>

      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter sex, age band, weight, height, FT4 Low/Normal, and heart disease
          Yes/No. Review the status message under Levothyroxine dose. Share uses
          the public page URL — never treat the teaching figure as a filled
          prescription.
        </p>
      </section>

      <section id="fda-label" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FDA Label Context</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          SYNTHROID DailyMed labeling (updated February 20, 2024; setid
          1e11ad30-1041-4520-10b0-8f9d30d30fcc) states adult full replacement is
          about 1.6 mcg/kg/day, with lower starting doses for geriatric patients
          or adults with underlying cardiac disease, titrated using serum TSH or
          free-T4. Peak effect of a given dose may take 4–6 weeks.
        </p>
      </section>

      <section id="devine" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Devine Ideal Body Weight
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          When height is at least 60 inches (152.4 cm), this tool computes Devine
          IBW (male: 50 + 2.3×(in−60); female: 45.5 + 2.3×(in−60)) and uses the
          lesser of actual weight and IBW as the dosing weight for the educational
          1.6 mcg/kg teaching estimate — matching Omni’s described actual-vs-ideal
          approach without copying Omni’s proprietary code.
        </p>
      </section>

      <section id="limits" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          When mcg/day Is Gated
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Over 50, heart disease Yes, Normal FT4, missing weight/height, or
          height below Devine eligibility do not receive an automatic mcg/day
          figure. TSH goals remain individualized; primary vs central
          hypothyroidism is not diagnosed from these radios alone.
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
