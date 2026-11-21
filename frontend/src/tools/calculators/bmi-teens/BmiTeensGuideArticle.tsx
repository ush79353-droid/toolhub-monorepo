export function BmiTeensGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2>BMI Calculator for Teens</h2>
        <p>
          This tool computes body mass index from height and weight, shows BMI
          Prime for reference, and—when sex and age (10–20 years) are
          provided—places BMI on the CDC 2000 BMI-for-age growth charts.
        </p>
      </section>

      <section id="what-is" className="scroll-mt-24">
        <h2>What Is Teen BMI?</h2>
        <p>
          BMI is weight in kilograms divided by height in meters squared. For
          adolescents, the same number means different things at different ages
          and for female vs male teens, so clinicians use BMI-for-age
          percentiles instead of adult WHO cut-offs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-24">
        <h2>BMI, BMI Prime, and Percentiles</h2>
        <p>
          <strong>BMI</strong> = weight<sub>kg</sub> / height<sub>m</sub>
          <sup>2</sup>. <strong>BMI Prime</strong> = BMI / 25. Percentiles use
          the CDC LMS method: a sex- and age-specific z-score is converted to a
          percentile with the standard normal distribution.
        </p>
      </section>

      <section id="categories" className="scroll-mt-24">
        <h2>CDC Weight-Status Categories</h2>
        <ul>
          <li>Underweight: below the 5th percentile</li>
          <li>Healthy weight: 5th to under the 85th percentile</li>
          <li>Overweight: 85th to under the 95th percentile</li>
          <li>Obesity: at or above the 95th percentile</li>
        </ul>
        <p>
          BMI Prime is never used to assign these teen categories.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-24">
        <h2>How to Use the Calculator</h2>
        <ol>
          <li>Enter height and weight (units convert while preserving mass/length).</li>
          <li>Read BMI and BMI Prime in the first panel.</li>
          <li>
            Select Female or Male and enter age from 10 to 20 years to see the
            CDC percentile and weight-status band.
          </li>
        </ol>
      </section>

      <section id="age-bounds" className="scroll-mt-24">
        <h2>Age 10–20 Bounds</h2>
        <p>
          The field label limits interpretation to ages 10–20. At age 20 the CDC
          charts still provide LMS parameters through 240.5 months; adult WHO
          categories also begin around age 20—this teens tool keeps the CDC
          path for the full labeled range and does not silently switch to adult
          cut-offs inside 10–20.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-24">
        <h2>Limitations</h2>
        <p>
          BMI cannot separate muscle from fat. Percentiles are a screening aid,
          not a diagnosis. Extended CDC charts for very high BMIs above the 95th
          percentile are not applied here; high percentiles still classify as
          obesity on the standard 2000 cut-offs.
        </p>
      </section>

      <section id="related" className="scroll-mt-24">
        <h2>Related Calculators</h2>
        <p>
          See the adult BMI Calculator, BMI Percentile, and BMI for Kids tools
          for neighboring age groups and chart scopes.
        </p>
      </section>
    </article>
  );
}
