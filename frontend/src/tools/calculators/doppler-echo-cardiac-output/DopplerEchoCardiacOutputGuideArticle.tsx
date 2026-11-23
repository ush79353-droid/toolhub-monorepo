import Link from 'next/link';

export function DopplerEchoCardiacOutputGuideArticle() {
  return (
    <article className="prose prose-accent max-w-none prose-headings:text-accent prose-p:text-foreground/90">
      <section id="introduction">
        <h2>Doppler Echo Cardiac Output Calculator</h2>
        <p>
          Estimate cardiac output from echocardiographic LVOT diameter and
          pulsed-wave Doppler velocity-time integral (VTI), with optional body
          surface area (BSA) for cardiac index. This is an educational worksheet
          aligned with common teaching formulas — not interpreted
          echocardiography.
        </p>
      </section>

      <section id="what-is">
        <h2>What Is LVOT Doppler Cardiac Output?</h2>
        <p>
          Cardiac output is the volume of blood the left ventricle ejects per
          minute. Doppler echocardiography often estimates stroke volume at the
          left ventricular outflow tract (LVOT) by multiplying the cross-sectional
          area of the outflow tract by the LVOT stroke distance (VTI), then
          multiplying stroke volume by heart rate.
        </p>
      </section>

      <section id="formula">
        <h2>Formulas Used</h2>
        <ul>
          <li>
            LVOT area (cm²) = π × (diameter<sub>cm</sub> ÷ 2)²
          </li>
          <li>
            Stroke volume (mL) = LVOT area × LVOT VTI<sub>cm</sub>
          </li>
          <li>Cardiac output (L/min) = stroke volume × heart rate ÷ 1000</li>
          <li>
            BSA (m²) = √(height<sub>cm</sub> × weight<sub>kg</sub> ÷ 3600)
            (Mosteller)
          </li>
          <li>Cardiac index (L/min/m²) = cardiac output ÷ BSA</li>
        </ul>
      </section>

      <section id="how-to-use">
        <h2>How to Use the Calculator</h2>
        <ol>
          <li>Enter height and weight if you want BSA and cardiac index.</li>
          <li>Enter heart rate (bpm).</li>
          <li>Enter LVOT VTI and LVOT diameter with units.</li>
          <li>Review stroke volume, LVOT area, cardiac output, and index.</li>
        </ol>
      </section>

      <section id="example">
        <h2>Worked Example</h2>
        <p>
          LVOT diameter <strong>20</strong> mm (2 cm), LVOT VTI{' '}
          <strong>20</strong> cm, heart rate <strong>80</strong> bpm:
        </p>
        <ul>
          <li>Area = π × 1² ≈ 3.1416 cm²</li>
          <li>Stroke volume ≈ 62.83 mL</li>
          <li>Cardiac output ≈ 5.03 L/min</li>
        </ul>
        <p>
          With height and weight entered, cardiac index divides this output by
          Mosteller BSA.
        </p>
      </section>

      <section id="limits">
        <h2>Limits and Safety</h2>
        <ul>
          <li>Assumes a circular LVOT and well-aligned Doppler sampling.</li>
          <li>
            Does not correct for arrhythmia, regurgitant lesions, or outflow
            obstruction without a qualified interpreter.
          </li>
          <li>
            Not a substitute for formally reported echocardiography or invasive
            hemodynamics.
          </li>
        </ul>
        <p>
          Related tools:{' '}
          <Link href="/tools/cardiac-index-calculator">Cardiac Index Calculator</Link>{' '}
          and{' '}
          <Link href="/tools/aortic-valve-area-calculator">
            Aortic Valve Area Calculator
          </Link>
          .
        </p>
      </section>
    </article>
  );
}