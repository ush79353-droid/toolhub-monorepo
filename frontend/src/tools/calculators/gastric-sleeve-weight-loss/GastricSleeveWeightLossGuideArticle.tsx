export function GastricSleeveWeightLossGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <p>
        Sleeve gastrectomy (gastric sleeve) removes most of the stomach along the
        greater curvature, leaving a tubular remnant. Published cohorts report
        weight change as percent excess weight loss (%EWL) or percent total
        weight loss (%TWL) at defined follow-up intervals.
      </p>

      <h3 id="ewl-vs-twl">%EWL vs %TWL</h3>
      <p>
        %TWL = (baseline weight − follow-up weight) ÷ baseline weight × 100.
        %EWL = (baseline weight − follow-up weight) ÷ (baseline weight −
        reference weight) × 100. This tool uses %EWL with reference weight at BMI
        25 kg/m² (upper end of the WHO normal range), then rearranges to an
        estimated follow-up weight = baseline − (excess weight × %EWL).
      </p>

      <h3 id="population-estimate">Population estimate</h3>
      <p>
        The applied year-1 sleeve gastrectomy %EWL is the observational
        meta-analysis mean from Chang et al., JAMA Surgery 2014 (≈ 51.5%). The
        result is a population teaching estimate with a one-year horizon — not a
        personalized prediction interval.
      </p>

      <h3 id="limits">Limits</h3>
      <p>
        Excess weight must be positive (BMI above the reference). Other
        procedures (bypass, banding, etc.) are out of scope for this
        screenshot-first tool. Outcomes are educational only and do not replace
        bariatric surgical counseling.
      </p>
    </article>
  );
}
