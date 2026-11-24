export function ProstateVolumeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent">
      <h2 id="what-is">What is prostate gland volume?</h2>
      <p>
        Ultrasound or MRI measures three orthogonal diameters. Multiplying them
        by a shape coefficient estimates gland volume in milliliters.
      </p>
      <h2 id="psa">PSA test and normal range</h2>
      <p>
        PSA density adjusts serum PSA for gland size. This worksheet only
        divides PSA by the selected volume — it does not interpret thresholds.
      </p>
      <h2 id="formula">Prostate volume formula</h2>
      <p>
        Ellipsoid: V = L×H×W×π/6. Bullet: V = L×H×W×5π/24 (MacMahon et al.
        2009). Compare mode shows both from the same dimensions.
      </p>
      <h2 id="how-to">How to use this calculator</h2>
      <p>
        Choose a model, enter length, height, and width, then optionally open
        PSA density. Changing models keeps your measurements.
      </p>
    </article>
  );
}
