export function PgE2GuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">Pg/E2 Ratio</h2>
      <p>
        The progesterone-to-estradiol ratio (Pg/E2 or P/E2) compares serum
        progesterone with estradiol after both concentrations are expressed in
        the same mass unit. This tool reproduces the common mass-normalized
        reporting convention used in reproductive endocrinology literature.
        Educational only.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>
          Enter progesterone and choose ng/mL (default), pg/mL, or nmol/L.
        </li>
        <li>
          Enter estradiol (E2) and choose pg/mL (default), ng/mL, or pmol/L.
        </li>
        <li>
          Read the dimensionless Ratio (Pg/E2 or P/E2). Changing a unit keeps
          the underlying concentration and recomputes the ratio.
        </li>
      </ol>

      <h2 id="formula">Formula &amp; Units</h2>
      <p>
        Convert both analytes to pg/mL, then divide: ratio = P(pg/mL) ÷
        E2(pg/mL). When progesterone is in ng/mL and estradiol in pg/mL, that is
        identical to 1000 × P(ng/mL) / E2(pg/mL). Example: 10 ng/mL and 100
        pg/mL → 100. SI conversions use 1 ng/mL progesterone = 3.18 nmol/L and
        1 pg/mL estradiol = 3.6713 pmol/L.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Published IVF or luteal cutoffs depend on assay, cycle day, and study
        population. This calculator does not apply clinical thresholds or
        recommend treatment. Lab values never leave your browser.
      </p>
    </article>
  );
}
