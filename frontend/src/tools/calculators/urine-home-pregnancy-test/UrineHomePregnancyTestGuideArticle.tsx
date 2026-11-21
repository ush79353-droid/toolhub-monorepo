export function UrineHomePregnancyTestGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Urine Home Pregnancy Test
        </h2>
        <p>
          This page estimates when a urine home pregnancy test may become
          informative after natural conception or IVF transfer. It is
          educational calendar math only — it does not read a strip, interpret a
          clinic lab value, or confirm pregnancy.
        </p>
      </section>

      <section id="natural" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Natural Conception Timing
        </h2>
        <p>
          Enter cycle length (default 28 days) and the first day of your last
          period. Ovulation is estimated as cycle length minus 14 days from LMP,
          and you can override the ovulation date. Educational defaults place
          qualitative blood timing near 10 days after ovulation and a typical
          urine home test near 14 days (missed-period / ~25 mIU/mL assumption).
        </p>
      </section>

      <section id="ivf" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">IVF Timing</h2>
        <p>
          Enter transfer day and embryo age (default 5-day blastocyst). The
          calculator shifts educational blood and urine windows from the
          transfer calendar day. Clinic beta orders override any educational
          date on this page.
        </p>
      </section>

      <section id="sensitivity" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Sensitivity Threshold
        </h2>
        <p>
          Each section has its own “Show the urine test sensitivity threshold”
          control. Enabling it exposes labeled assay options (10–25 mIU/mL) that
          only adjust that section’s educational urine date. Package inserts and
          urine concentration still vary — earlier dates are not guarantees.
        </p>
      </section>

      <section id="limitations" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p>
          Cycle irregularity, fertility medications, diluted urine, expired
          tests, and user error can change real-world results. This tool never
          stores dates on a server and share links include only the public page
          URL.
        </p>
      </section>

      <section id="related" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Related Calculators
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Pregnancy Test Calculator</li>
          <li>Blood Pregnancy Test: What Do HCG Results Mean?</li>
          <li>What is a False Negative Pregnancy Test?</li>
        </ul>
      </section>
    </div>
  );
}
