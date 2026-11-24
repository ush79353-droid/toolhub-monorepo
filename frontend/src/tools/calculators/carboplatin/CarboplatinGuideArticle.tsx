export function CarboplatinGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="gfr">GFR estimation</h3>
      <p>
        Cockcroft–Gault uses age, weight, sex, and serum creatinine in mg/dL to
        estimate creatinine clearance as a GFR surrogate.
      </p>
      <h3 id="calvert">Calvert formula</h3>
      <p>
        Carboplatin dose (mg) = target AUC × (GFR + 25). Verify against your
        institutional oncology protocol before any clinical use.
      </p>
    </article>
  );
}