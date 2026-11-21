export function IbuprofenDosageGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">Ibuprofen Dosage Calculator</h2>
      <p>
        Compare a child&apos;s weight to published US OTC Motirin (ibuprofen)
        oral suspension charts. This is an educational label lookup — not a
        prescription and not a substitute for the carton or clinical advice.
      </p>

      <h2 id="products">Supported Products</h2>
      <ul>
        <li>
          <strong>Infants’ MOTRIN® Oral Suspension Drops</strong> — 50 mg
          ibuprofen per 1.25 mL (weight bands about 12–23 lb).
        </li>
        <li>
          <strong>Children’s MOTRIN® Oral Suspension</strong> — 100 mg
          ibuprofen per 5 mL (weight bands about 24–95 lb).
        </li>
      </ul>
      <p>
        Under 6 months, under 12 lb, or over 95 lb: the labeled charts say ask a
        doctor. Generics and other markets can differ — confirm your bottle.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>Confirm the child is at least 6 months old (checkbox).</li>
        <li>Enter weight in kg or lb (prefer weight over age).</li>
        <li>
          Read the matching mL dose, concentration, and 24-hour maximum from the
          result panel.
        </li>
        <li>Double-check the leaflet and ask a clinician when unsure.</li>
      </ol>

      <h2 id="examples">Weight Examples</h2>
      <ul>
        <li>
          <strong>9.6 kg</strong> maps to the Infants’ drops 18–23 lb band →{' '}
          <strong>1.875 mL</strong> (75 mg).
        </li>
        <li>
          <strong>31.8 kg</strong> maps to the Children’s suspension 60–71 lb
          band → <strong>12.5 mL</strong> (250 mg).
        </li>
      </ul>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Do not round a converted weight into a neighboring product band. Repeat
        only every 6–8 hours and never more than 4 doses in 24 hours. NSAID
        allergy, stomach bleeding, heart surgery timing, and other Drug Facts
        warnings still apply — read the full label.
      </p>
    </article>
  );
}
