export function BloodPregnancyHcgGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Blood Pregnancy Test: What Do hCG Results Mean?
        </h2>
        <p>
          This page pairs an educational “when to test” widget with plain-language
          context about blood and urine hCG. It is not a laboratory report reader
          and does not judge pregnancy viability from numbers.
        </p>
      </section>

      <section id="when-to-test" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          When to Take a Pregnancy Test
        </h2>
        <p>
          After natural conception, home urine tests are often reliable around
          the expected period (about 14 days after ovulation for a ~25 mIU/mL
          strip). Qualitative blood tests can turn positive earlier for many
          people. Early-detection strips with lower mIU/mL ratings may allow
          slightly earlier urine testing — still approximate.
        </p>
      </section>

      <section id="natural-vs-ivf" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Natural Conception vs IVF
        </h2>
        <p>
          Natural mode estimates ovulation from cycle length and last period
          (editable). IVF mode starts from transfer day and embryo age (default
          day-5 blastocyst). Clinic beta orders override any educational date
          shown here.
        </p>
      </section>

      <section id="hcg-meaning" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          What hCG Results Mean
        </h2>
        <p>
          hCG (human chorionic gonadotropin) rises after implantation. A
          qualitative blood or urine test answers present/absent above the
          assay’s threshold. A quantitative blood test reports a concentration
          that clinicians interpret with serial trends and ultrasound — not a
          single screenshot-style calculator.
        </p>
      </section>

      <section id="limitations" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Cycle irregularity, late ovulation, medications containing hCG, and
          assay differences change results. False negatives are common when
          testing too early. Seek urgent care for severe pain, heavy bleeding, or
          other emergency symptoms.
        </p>
      </section>
    </div>
  );
}
