export function KtvDaugirdasGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent prose-a:text-primary">
      <h2 id="what-is-ktv">What does Kt/V stand for in dialysis?</h2>
      <p>
        Kt/V is a dimensionless urea clearance index: dialyzer clearance (K)
        times session time (t) divided by urea distribution volume (V). This
        worksheet estimates single-pool Kt/V from pre/post BUN, session length,
        ultrafiltrate volume, and post-dialysis weight.
      </p>

      <h2 id="normal-ktv">What is normal Kt/V?</h2>
      <p>
        Adequacy targets are guideline- and modality-specific (often cited near
        ≥1.2 for thrice-weekly hemodialysis single-pool Kt/V). This tool does
        not apply targets or prescribe dialysis dose.
      </p>

      <h2 id="ktv-vs-urr">Difference between Kt/V and URR</h2>
      <p>
        URR is simply the fractional drop in BUN. Daugirdas Kt/V adjusts for
        session length and ultrafiltration relative to body weight, so the two
        measures are related but not interchangeable.
      </p>

      <h2 id="how-to-calculate">How to calculate Kt/V in dialysis?</h2>
      <p>
        With R = C<sub>post</sub>/C<sub>pre</sub>, the second-generation
        Daugirdas equation is Kt/V = −ln(R − 0.008×t) + (4 − 3.5×R)×(UF/W).
        Enter consistent BUN units; duration converts to hours; UF to liters;
        weight to kilograms.
      </p>
    </article>
  );
}
