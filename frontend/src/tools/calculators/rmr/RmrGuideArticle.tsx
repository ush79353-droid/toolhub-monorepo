export function RmrGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="introduction">Resting metabolic rate</h3>
      <p>
        Resting metabolic rate (RMR) estimates the energy your body uses at rest,
        including a modest allowance for digesting food. Enter sex, age, height,
        and weight; the calculator returns resting kilocalories per day. No
        activity multiplier is applied.
      </p>
      <h3 id="formula">Equation</h3>
      <p>
        This tool reuses the original Harris–Benedict (1919) coefficients already
        shared by the DRI calculator, then multiplies by a thermic-effect-of-food
        factor of 1.1 (about 10%). Men:{' '}
        <code>(66.473 + 13.7516×kg + 5.0033×cm − 6.755×age) × 1.1</code>. Women:{' '}
        <code>(655.0955 + 9.5634×kg + 1.8496×cm − 4.6756×age) × 1.1</code>. Adult
        eligibility mirrors sibling resting-energy tools (ages 15–100).
      </p>
    </article>
  );
}
