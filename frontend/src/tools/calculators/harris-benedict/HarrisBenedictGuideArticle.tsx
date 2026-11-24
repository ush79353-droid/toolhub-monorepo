export function HarrisBenedictGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="introduction">Harris–Benedict BMR</h3>
      <p>
        Basal metabolic rate (BMR) estimates the energy used at complete rest in a
        post-absorptive state. Enter sex, age, height, and weight; the calculator
        returns basal kilocalories per day. No activity multiplier is applied.
      </p>
      <h3 id="formula">Revised equation</h3>
      <p>
        This tool uses the revised Harris–Benedict resting equations from Roza and
        Shizgal (American Journal of Clinical Nutrition, 1984), which recalculated
        regression coefficients on an expanded Harris–Benedict cohort. Men:{' '}
        <code>88.362 + 13.397×kg + 4.799×cm − 5.677×age</code>. Women:{' '}
        <code>447.593 + 9.247×kg + 3.098×cm − 4.330×age</code>. The same basal
        helper powers the BEE calculator.
      </p>
      <p>
        The original 1919 Harris &amp; Benedict equations (PNAS / Carnegie
        Institution Publication No. 279) remain historically important but are not
        the live formula here.
      </p>
    </article>
  );
}
