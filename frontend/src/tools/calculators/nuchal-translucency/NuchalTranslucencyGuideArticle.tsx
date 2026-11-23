import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NT_FAQS } from './content';
import {
  CHUNG_INTERCEPT,
  CHUNG_SLOPE,
  ROBINSON_INTERCEPT,
  ROBINSON_SQRT_COEFF,
  SOURCE_CENTILES,
  SOURCE_EXPECTED_NT,
  centileSnapshotAtCrl,
  expectedNtMmFromCrl,
  gestationalAgeDaysFromCrlMm,
  percentileFromNtAtCrl,
} from './calculation';

export function NuchalTranslucencyGuideArticle() {
  const ga45 = gestationalAgeDaysFromCrlMm(45);
  const expected45 = expectedNtMmFromCrl(45);
  const snap45 = centileSnapshotAtCrl(45);
  const p134 = percentileFromNtAtCrl(1.34, 45);

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Nuchal Translucency Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate expected median nuchal translucency (NT) from crown–rump length,
        then place a measured NT on educational centile curves for early
        pregnancy. Educational reference only — not a diagnosis of fetal
        chromosomal conditions.
      </p>

      <h2
        id="what-is-nt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is NT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nuchal translucency is the sonographic fluid collection behind the fetal
        neck in the first trimester. It is one component of combined first-trimester
        screening when paired with maternal serum markers and specialist
        interpretation — a single NT value alone is not a genetic test result.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas and Tables
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        GA days = {ROBINSON_SQRT_COEFF} × √(CRL_mm) + {ROBINSON_INTERCEPT}{' '}
        (rounded once)
      </p>
      <p className="mt-2 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Expected NT_mm = {CHUNG_INTERCEPT} + {CHUNG_SLOPE} × CRL_mm
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_EXPECTED_NT}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_CENTILES}
      </p>

      <h2
        id="discrepancies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Reference vs Screenshot
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
        <li>
          <strong>CRL 45 mm → GA:</strong> Robinson–Fleming gives{' '}
          <strong>{ga45 ?? '—'} days</strong> after rounding, not 79 days shown in
          some reference UIs.
        </li>
        <li>
          <strong>Expected NT at CRL 45 mm:</strong> Chung median ≈{' '}
          <strong>{expected45?.toFixed(2) ?? '—'} mm</strong> (matches ~1.32 mm in
          reference materials).
        </li>
        <li>
          <strong>NT 1.34 mm at CRL 45 mm:</strong> interpolated 75th ≈{' '}
          {snap45.p75.toFixed(2)} mm and 95th ≈ {snap45.p95.toFixed(2)} mm → about
          the <strong>{Math.round(p134)}th percentile</strong>, not a strict 75th
          claim.
        </li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter CRL to see Robinson GA and Chung expected NT.</li>
        <li>Enter measured NT and gestational age for centile and chart.</li>
        <li>Use Load example (CRL 45, NT 1.34) to compare published math vs UI screenshots.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Centile knots are clamped and interpolated for CRL 45–80 mm. Assessment
        is gated near the usual NT window (~45–84 mm CRL). Results are
        educational; follow your prenatal care team for screening decisions.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
        <li>
          <Link
            href="/tools/crown-rump-length-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Crown-rump length calculator
          </Link>{' '}
          — standalone CRL dating.
        </li>
      </ul>

      <h2
        id="nt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={NT_FAQS} />
      </div>
    </article>
  );
}