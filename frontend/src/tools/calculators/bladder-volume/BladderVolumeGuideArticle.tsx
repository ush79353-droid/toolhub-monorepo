export function BladderVolumeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent prose-a:text-primary">
      <h2 id="how-to-use">How to use the bladder volume calculator?</h2>
      <p>
        Choose the ultrasound bladder shape, confirm the coefficient, and enter
        three orthogonal dimensions (width, height, length). Volume updates as
        soon as all three lengths are valid. Changing shape keeps your
        measurements and swaps only the coefficient (unless you pick Custom).
      </p>

      <h2 id="how-to-calculate">How to calculate bladder volume?</h2>
      <p>
        The worksheet uses{' '}
        <strong>volume (mL) = length × width × height × coefficient</strong>{' '}
        with dimensions in centimeters. Source coefficients follow Bih et al.,
        Archives of Physical Medicine and Rehabilitation (1998), plus the
        geometric prolate-ellipsoid factor 0.52 (≈ π/6) and Omni&apos;s
        &quot;I don&apos;t know&quot; factor 0.77.
      </p>

      <h2 id="ultrasound">Bladder volume on ultrasound</h2>
      <p>
        Measure maximal transverse, anterior–posterior, and longitudinal
        diameters. Classify approximate shape (ellipsoid, cuboid, triangular
        prism) when possible — Bih et al. showed shape-matched coefficients
        reduce mean error versus a single global factor.
      </p>

      <h2 id="capacity">How much can a bladder hold?</h2>
      <p>
        Typical adult functional capacity is often cited around 300–500 mL, with
        wide individual variation. Post-void residual and urgency patterns need
        clinical context; this calculator only multiplies measured diameters.
      </p>
    </article>
  );
}
