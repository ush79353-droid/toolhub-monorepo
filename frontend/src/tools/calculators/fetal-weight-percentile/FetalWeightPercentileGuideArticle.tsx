export function FetalWeightPercentileGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:scroll-mt-24 prose-headings:text-accent prose-p:text-muted-foreground prose-li:text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2>Fetal Weight Percentile Calculator</h2>
        <p>
          Enter gestational age and ultrasound biometry to estimate fetal weight
          with the Hadlock four-parameter model, then place that estimate on
          Fetal Medicine Foundation (FMF) EFW centile curves.
        </p>
      </section>
      <section id="hadlock" className="space-y-3">
        <h2>Hadlock Estimated Fetal Weight</h2>
        <p>
          Measurements are converted to centimeters before applying Hadlock FP
          et al., Am J Obstet Gynecol 1985. The screenshot fixture (AC 154 mm,
          HC 180 mm, BPD 56.2 mm, FL 30 mm) yields EFW 334.37 g.
        </p>
      </section>
      <section id="fmf" className="space-y-3">
        <h2>FMF Percentile Chart</h2>
        <p>
          Percentile bands use Nicolaides et al. 2018 Table 1 EFW columns
          (unisex). Girl/Boy selection is shown for UX parity but does not
          change FMF unisex curves. Published 3rd/97th centiles are labeled
          beside screenshot-style 2.5th/97.5th legend names.
        </p>
      </section>
      <section id="limits" className="space-y-3">
        <h2>Limits and Caveats</h2>
        <p>
          Educational only. Clinic software may use INTERGROWTH-21st, WHO, or
          customized charts and can report a different percentile for the same
          biometry.
        </p>
      </section>
    </article>
  );
}
