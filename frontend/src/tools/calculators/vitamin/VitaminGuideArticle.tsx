export function VitaminGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="what-it-shows">What this calculator shows</h3>
      <p>
        Enter chronological age and sex, then choose a vitamin. The tool maps age
        to the published Dietary Reference Intake life-stage band and reports the
        Recommended Dietary Allowance (RDA) or Adequate Intake (AI) for that
        group, plus any Tolerable Upper Intake Level (UL) when one has been
        established. Unit conversion between IU and mcg for vitamin A is a
        separate converter and is not performed here.
      </p>
      <h3 id="rda-ai-ul">RDA, AI, and UL</h3>
      <p>
        RDA and AI are planning targets for adequacy. UL is a safety ceiling and
        is shown separately so it is never confused with the recommended amount.
        Some vitamins (for example vitamin K, thiamin, riboflavin, B₁₂, pantothenic
        acid, and biotin) have no published UL; the result states that clearly
        instead of inventing a number. Where a UL applies only to preformed or
        supplemental forms (vitamin A, E, niacin, folate), a short note explains
        the scope.
      </p>
      <h3 id="sources">Sources</h3>
      <p>
        Recommendation rows reuse the shared NIH ODS / National Academies DRI
        vitamin table used by the DRI Calculator. Tolerable Upper Intake Levels
        follow Food and Nutrition Board vitamin UL tables as published through
        NIH ODS (including Dietary Reference Intakes for Calcium and Vitamin D,
        2011, for updated vitamin D ULs). Educational use only.
      </p>
    </article>
  );
}
