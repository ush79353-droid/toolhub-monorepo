export function KatchMcardleGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="introduction">Katch–McArdle BMR</h3>
      <p>
        Basal metabolic rate (BMR) estimates resting energy expenditure. The
        Katch–McArdle equation uses lean body mass (LBM) rather than total body
        weight, which can better reflect metabolic tissue when body composition
        is known. Enter the values you know; the calculator returns basal
        kilocalories per day. No activity multiplier is applied.
      </p>
      <h3 id="formula">Formula &amp; LBM modes</h3>
      <p>
        Published Katch–McArdle form:{' '}
        <code>BMR (kcal/day) = 370 + 21.6 × LBM (kg)</code>. When body fat % is
        known, <code>LBM = weight × (1 − fat%/100)</code>. When LBM is unknown,
        this tool estimates LBM with Boer (1984): men{' '}
        <code>0.407×kg + 0.267×cm − 19.2</code>; women{' '}
        <code>0.252×kg + 0.473×cm − 48.3</code>.
      </p>
      <p>
        Primary references include Katch &amp; McArdle nutrition/exercise texts
        for the BMR coefficients and Boer (American Journal of Physiology, 1984)
        for anthropometric lean-mass estimation. Results are educational
        estimates, not individualized medical nutrition therapy.
      </p>
    </article>
  );
}
