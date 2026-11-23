export function Te2GuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">T/E2 Index</h2>
      <p>
        The testosterone-to-estradiol ratio (T/E2) is often reported online as a
        mixed-unit numerical index: testosterone in ng/dL divided by estradiol
        in pg/mL. This tool follows that convention. Educational only.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>
          Enter testosterone and choose ng/dL (default), ng/mL, or nmol/L.
        </li>
        <li>
          Enter estradiol (E2) and choose pg/mL (default), ng/mL, or pmol/L.
        </li>
        <li>
          Read Ratio (T/E2). Changing a unit keeps the underlying concentration
          and recomputes the index.
        </li>
      </ol>

      <h2 id="formula">Formula &amp; Units</h2>
      <p>
        Convert testosterone to ng/dL and estradiol to pg/mL, then T/E2 =
        T(ng/dL) ÷ E2(pg/mL). Example: 500 ng/dL and 25 pg/mL → 20. A
        same-mass-unit ratio (both in ng/mL) for those values would be about
        200—we do not use that here. SI conversions use 1 ng/mL testosterone =
        3.467 nmol/L and 1 pg/mL estradiol = 3.6713 pmol/L.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Published T/E2 interpretations depend on assay, sex, age, and clinical
        context. This calculator does not apply diagnostic thresholds or
        recommend treatment. Lab values never leave your browser.
      </p>
    </article>
  );
}