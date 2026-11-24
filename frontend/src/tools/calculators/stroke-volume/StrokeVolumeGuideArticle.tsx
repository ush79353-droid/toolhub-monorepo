import Link from 'next/link';

export function StrokeVolumeGuideArticle() {
  return (
    <article className="prose prose-accent max-w-none prose-headings:text-accent prose-p:text-foreground/90">
      <section id="introduction">
        <h2>Stroke Volume Calculator</h2>
        <p>
          Estimate stroke volume from cardiac output and heart rate, then
          optionally normalize by Mosteller body surface area for cardiac index
          and stroke volume index. This is an educational physiology worksheet —
          not a bedside hemodynamic monitor.
        </p>
      </section>

      <section id="what-is">
        <h2>What Is Stroke Volume?</h2>
        <p>
          Stroke volume is the volume of blood ejected by the ventricle with each
          beat. When cardiac output (volume per minute) and heart rate are known,
          stroke volume follows from rearranging CO = SV × HR.
        </p>
      </section>

      <section id="formula">
        <h2>Formulas Used</h2>
        <ul>
          <li>
            Stroke volume (mL) = 1000 × cardiac output (L/min) ÷ heart rate
            (bpm)
          </li>
          <li>
            BSA (m²) = √(height<sub>cm</sub> × weight<sub>kg</sub> ÷ 3600)
            (Mosteller)
          </li>
          <li>Cardiac index (L/min/m²) = cardiac output ÷ BSA</li>
          <li>Stroke volume index (mL/m²) = stroke volume ÷ BSA</li>
        </ul>
      </section>

      <section id="how-to-use">
        <h2>How to Use the Calculator</h2>
        <ol>
          <li>Enter cardiac output and heart rate to see stroke volume.</li>
          <li>Enter height and weight to see Mosteller BSA.</li>
          <li>
            Review cardiac index and stroke volume index once both CO/SV and BSA
            are available.
          </li>
        </ol>
      </section>

      <section id="example">
        <h2>Worked Example</h2>
        <p>
          Cardiac output <strong>5</strong> L/min, heart rate{' '}
          <strong>100</strong> bpm, BSA <strong>2</strong> m² (Mosteller for
          height 180 cm and weight 80 kg):
        </p>
        <ul>
          <li>Stroke volume = 1000 × 5 ÷ 100 = 50 mL</li>
          <li>Cardiac index = 5 ÷ 2 = 2.5 L/min/m²</li>
          <li>Stroke volume index = 50 ÷ 2 = 25 mL/m²</li>
        </ul>
      </section>

      <section id="limits">
        <h2>Limits and Safety</h2>
        <ul>
          <li>
            Assumes simultaneous, consistent CO and HR measurements; does not
            correct for arrhythmia or regurgitant lesions.
          </li>
          <li>
            Rejects zero or non-positive heart rate and body-surface inputs that
            would divide by zero.
          </li>
          <li>
            Not a substitute for formally measured hemodynamics or clinical
            judgment.
          </li>
        </ul>
      </section>

      <section id="related">
        <h2>Related Calculators</h2>
        <p>
          Related tools:{' '}
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
          ,{' '}
          <Link href="/tools/cardiac-index-calculator">
            Cardiac Index Calculator
          </Link>
          , and{' '}
          <Link href="/tools/ejection-fraction-calculator">
            Ejection Fraction Calculator
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
