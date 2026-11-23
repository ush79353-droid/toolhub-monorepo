export function BreastCancerRecurrenceGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">Breast Cancer Recurrence Risk</h2>
      <p>
        This calculator reproduces the additive local-recurrence index described
        by O&apos;Rourke and colleagues for women treated with simple mastectomy
        and node biopsy without postoperative irradiation or systemic adjuvant
        therapy. It is educational only and is not a modern prognostic model.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>Select histologic tumor grade (I, II, or III).</li>
        <li>Select lymph-node status (negative or positive).</li>
        <li>
          Select whether lymphatic or vascular invasion was none or present.
        </li>
        <li>
          Read the summed recurrence risk score and the mapped local recurrence
          percentage. Nothing appears until all three factors are chosen.
        </li>
      </ol>

      <h2 id="scoring">Scoring &amp; Risk Table</h2>
      <p>
        Points: grade I = 6, II = 12, III = 18; node-negative = 6,
        node-positive = 12; LVI none = 4, present = 8. Published score totals map
        to local recurrence risks of 8.5%, 12.5%, 15.8%, 10%, 15.5%, 33%, 38.5%,
        and 48% for scores 16, 20, 22, 26, 28, 32, 34, and 38 respectively.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        The historical cohort predates routine adjuvant radiation and systemic
        therapy. Risk figures do not apply unchanged to contemporary
        breast-conserving surgery, reconstruction, or treated patients. This
        tool never recommends induction of therapy and cannot replace pathology
        review or oncology counseling.
      </p>
    </article>
  );
}
