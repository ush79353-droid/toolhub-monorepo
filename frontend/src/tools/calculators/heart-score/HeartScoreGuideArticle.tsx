import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEART_SCORE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function HeartScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        HEART Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate an educational HEART score (0–10) for patients presenting with
        acute chest pain. Each of five domains contributes 0–2 points. The tool
        sums History, ECG, Age, Risk factors, and initial Troponin — it does not
        recommend discharge, observation, or testing pathways.
      </p>

      <h2
        id="components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Five HEART Components
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>History</strong> — slightly/non-suspicious (0), moderately
          suspicious (1), highly suspicious (2).
        </li>
        <li>
          <strong>ECG</strong> — normal (0), abnormal without significant ST
          deviation (1), significant ST deviation (2).
        </li>
        <li>
          <strong>Age</strong> — numeric years mapped to bands below.
        </li>
        <li>
          <strong>Risk factors</strong> — none (0), 1–2 factors (1), ≥3 factors
          or known atherosclerotic disease (2).
        </li>
        <li>
          <strong>Initial troponin</strong> — below assay cutoff (0), 1–3×
          cutoff (1), &gt;3× cutoff (2).
        </li>
      </ul>

      <h2
        id="age-bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Age Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age &lt;45 years → 0 points; 45–64 years → 1 point; ≥65 years → 2 points
        (boundaries: 44→0, 45→1, 64→1, 65→2).
      </p>

      <h2
        id="troponin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Troponin Tiers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Troponin scoring is always relative to the local assay upper reference
        limit. Select the tier that matches the initial result — the calculator
        does not convert absolute ng/L values.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age in years (required before the total appears).</li>
        <li>Confirm ECG, history, troponin tier, and risk-factor selections.</li>
        <li>Read the HEART total and component breakdown in Results.</li>
        <li>Share uses the public page URL only — no PHI in the payload.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age 58; abnormal ECG without significant ST change; moderately
        suspicious history; troponin 1–3× cutoff; 1–2 risk factors →{' '}
        <strong>1 + 1 + 1 + 1 + 1 = 5</strong> points.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Validated in ED chest-pain cohorts (Six 2008; Backus 2010/2013). High-sensitivity
        troponin assays may need tier judgment at the bedside. This page is for
        learning and documentation support — not solitary clinical decisions.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{SOURCE_LABEL}</p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/has-bled-calculator">HAS-BLED Calculator</Link>
        </li>
        <li>
          <Link href="/tools/framingham-risk-calculator">
            Framingham Risk Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cha2ds2-vasc-calculator">
            CHA₂DS₂-VASc Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="heart-score-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...HEART_SCORE_FAQS]} />
      </div>
    </article>
  );
}