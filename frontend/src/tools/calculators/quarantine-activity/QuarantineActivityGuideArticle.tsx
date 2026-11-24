export function QuarantineActivityGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="introduction">Quarantine activity</h3>
      <p>
        Estimate how daily energy needs shift when work, chores, and exercise
        change at home. Enter sex, age, height, and weight, pick activity levels,
        then optionally list everyday activities you stopped or started. The
        result is maintenance kilocalories per day plus any MET-based activity
        delta — not a clinical isolation schedule.
      </p>
      <h3 id="formula">How it works</h3>
      <p>
        Maintenance uses Mifflin–St Jeor basal metabolic rate multiplied by a
        physical activity level (PAL) derived from the sum of work, home, and
        exercise scores (each 0–3). Activity swaps use Compendium-style METs:{' '}
        <code>kcal = MET × 3.5 × kg × minutes / 200</code>. Identical added and
        removed activities of equal duration cancel.
      </p>
    </article>
  );
}
