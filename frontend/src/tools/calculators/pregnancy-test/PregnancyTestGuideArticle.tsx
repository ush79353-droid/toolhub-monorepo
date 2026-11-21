export function PregnancyTestGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2>Pregnancy Test Calculator</h2>
        <p>
          This canonical timing widget estimates when urine and blood pregnancy
          tests are more likely to be informative after natural conception or
          IVF transfer. It does not interpret lab hCG values or confirm
          viability.
        </p>
      </section>
      <section id="natural" className="scroll-mt-24">
        <h2>Natural Conception Timing</h2>
        <p>
          Enter cycle length (default 28 days) and last period. Ovulation is
          suggested as LMP + (cycle − 14) unless you set ovulation yourself.
          Suggested urine and blood test dates follow educational days-after-
          ovulation defaults.
        </p>
      </section>
      <section id="ivf" className="scroll-mt-24">
        <h2>IVF Timing</h2>
        <p>
          Enter transfer day and embryo age (default 5-day blastocyst). The
          fertilization-equivalent date is transfer minus embryo age. Clinic
          protocols always take priority over these estimates.
        </p>
      </section>
      <section id="sensitivity" className="scroll-mt-24">
        <h2>Test Sensitivity</h2>
        <p>
          Optional urine sensitivity selection adjusts the educational
          days-after-ovulation offset. It is not a guaranteed earliest positive
          day for every brand.
        </p>
      </section>
      <section id="limitations" className="scroll-mt-24">
        <h2>Limitations</h2>
        <p>
          Implantation timing varies. Follow package inserts and clinician
          guidance. This tool shares educational calendar math with related
          pregnancy-test timing pages on Omega Calculators.
        </p>
      </section>
      <section id="related" className="scroll-mt-24">
        <h2>Related Calculators</h2>
        <p>
          Blood Pregnancy Test: What Do HCG Results Mean?, Due Date Calculator,
          and IVF Due Date Calculator.
        </p>
      </section>
    </article>
  );
}
