export function SixMinuteWalkGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>6 Minute Walk Test Calculator</h2>
        <p>
          Estimate a healthy-adult predicted six-minute walk distance (6MWD)
          from sex, age, height, and weight, then optionally compare an observed
          walk distance as a percent of that expectation.
        </p>
      </section>
      <section id="equations" className="scroll-mt-28">
        <h2>Enright–Sherrill Equations</h2>
        <p>
          Male predicted metres = 7.57×height(cm) − 5.02×age − 1.76×weight(kg) −
          309. Female predicted metres = 2.11×height(cm) − 2.29×weight(kg) −
          5.78×age + 667. Source: Enright PL, Sherrill DL. Am J Respir Crit Care
          Med. 1998;158:1384–1387.
        </p>
      </section>
      <section id="percent" className="scroll-mt-28">
        <h2>Percent of Expected</h2>
        <p>
          Percent of expected distance = 100 × observed ÷ predicted. Enter the
          distance walked in the comparison section after a predicted value is
          available.
        </p>
      </section>
      <section id="limits" className="scroll-mt-28">
        <h2>Population &amp; Limits</h2>
        <p>
          Equations apply to healthy adults aged 40–80 years. Out-of-domain ages
          and non-positive predictions are suppressed. Educational use only —
          not a diagnosis or supervised test report.
        </p>
      </section>
    </article>
  );
}
