export function BirthWeightPercentileGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:scroll-mt-24 prose-headings:text-accent prose-p:text-muted-foreground prose-li:text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2>Birth Weight Percentile Calculator</h2>
        <p>
          Enter gestational age at birth (weeks and days) and birth weight to see
          where that weight sits among Fetal Medicine Foundation (FMF)
          birth-weight centiles for the same age. The chart overlays the 5th,
          10th, 50th, 75th, and 95th curves with a marker at the entered weight.
        </p>
      </section>

      <section id="how-it-works" className="space-y-3">
        <h2>How the Calculator Works</h2>
        <p>
          Gestational age is converted to an absolute day count (weeks × 7 +
          days). At that day, reference weights for the 5th, 10th, 25th, 50th,
          75th, and 95th percentiles are taken from published mid-week FMF knots
          with linear interpolation between knots. The entered weight (converted
          to grams) is then placed in a band such as “between 10th and 25th
          percentile.”
        </p>
      </section>

      <section id="fmf-chart" className="space-y-3">
        <h2>FMF Birth-Weight Chart</h2>
        <p>
          Source: Nicolaides KH, Wright D, Syngelaki A, Wright A, Akolekar R.
          Fetal Medicine Foundation fetal and neonatal population weight charts.
          Ultrasound Obstet Gynecol. 2018. The calculator uses the birth-weight
          columns of Table 1 (not estimated fetal weight). The reference is
          unisex and covers 20+0 through 41+6 weeks.
        </p>
      </section>

      <section id="how-to-read" className="space-y-3">
        <h2>How to Read the Result</h2>
        <p>
          “Between 10th and 25th percentile” means the weight is heavier than the
          interpolated 10th-centile reference and lighter than the 25th at that
          gestational age. Exact matches (within 0.5 g) are reported as “at” a
          named centile. Weights outside the 5th–95th span are labeled below the
          5th or above the 95th.
        </p>
      </section>

      <section id="limits" className="space-y-3">
        <h2>Limits and Caveats</h2>
        <p>
          This is an educational comparison, not a diagnosis of growth
          restriction or macrosomia. Preterm births are often over-represented in
          traditional birth registries; the FMF BW chart is designed to represent
          the whole population at each age. Different hospitals use different
          charts — always confirm with a clinician.
        </p>
      </section>
    </article>
  );
}
