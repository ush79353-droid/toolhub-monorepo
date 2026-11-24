export function MicronutrientGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="what-it-shows">What this calculator shows</h3>
      <p>
        Enter age and sex, then choose a mineral element. The tool looks up the
        published Dietary Reference Intake for that life-stage group and reports
        either a Recommended Dietary Allowance (RDA), Adequate Intake (AI), or —
        for sodium — the Chronic Disease Risk Reduction (CDRR) intake, plus any
        Tolerable Upper Intake Level (UL) when one has been established.
      </p>
      <h3 id="rda-ai-ul">RDA, AI, CDRR, and UL</h3>
      <p>
        RDA and AI are planning targets for adequacy. UL is a safety ceiling and
        is deliberately shown separately so it is never confused with the
        recommended amount. Some elements (for example chromium and potassium
        under current DRI updates) have no published UL; the result states that
        clearly instead of inventing a number. Magnesium UL values apply to
        supplemental / pharmacological magnesium in addition to food, per the
        National Academies tables.
      </p>
      <h3 id="sources">Sources</h3>
      <p>
        Values follow Food and Nutrition Board / National Academies DRI reports
        as published through NIH Office of Dietary Supplements fact sheets
        (including Calcium and Vitamin D, 2011; Sodium and Potassium, 2019; and
        earlier element DRI reports for trace minerals). Educational use only.
      </p>
    </article>
  );
}
