import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERC_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function PercGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PERC Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Apply the Pulmonary Embolism Rule-Out Criteria (PERC) when you judge
        pretest probability low. Tick criteria that are present, confirm low-risk
        eligibility, and attest that unchecked items were assessed as absent.
        The tool counts positives and shows rule-out language only when all
        gates are satisfied.
      </p>

      <h2
        id="criteria"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Eight PERC Criteria
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age ≥50 years</li>
        <li>Heart rate ≥100 bpm</li>
        <li>Room-air oxygen saturation &lt;95%</li>
        <li>Unilateral leg swelling</li>
        <li>Hemoptysis</li>
        <li>Prior personal DVT or PE</li>
        <li>Surgery or significant trauma within four weeks</li>
        <li>Exogenous estrogen (OCP, HRT, other estrogenic therapy)</li>
      </ul>

      <h2
        id="prerequisite"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Low Pretest Probability
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PERC was studied in emergency patients already judged to have low
        clinical suspicion for PE (&lt;15% pretest probability) before
        definitive testing. The calculator highlights that prerequisite and will
        not show rule-out wording until you confirm it.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm low pretest probability (&lt;15%).</li>
        <li>Tick each PERC criterion that is present.</li>
        <li>Confirm you assessed every criterion; unchecked means absent.</li>
        <li>Read the positive count and interpretation.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low-risk patient, no criteria present, both attestations checked → count{' '}
        <strong>0</strong> with educational rule-out text (overall risk below 2% in
        the validation cohort). Any single positive criterion → PERC cannot
        exclude PE.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_LABEL}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PERC does not replace clinical judgment, shared decision-making, or
        local pathways. Share uses the public page URL only — no patient data in
        the link.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/wells-score-calculator-for-pulmonary-embolism">
            Wells Score for Pulmonary Embolism
          </Link>
        </li>
        <li>
          <Link href="/tools/revised-geneva-score-calculator-for-pulmonary-embolism">
            Revised Geneva Score for Pulmonary Embolism
          </Link>
        </li>
        <li>
          <Link href="/tools/has-bled-calculator">HAS-BLED Calculator</Link>
        </li>
      </ul>

      <h2
        id="perc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={PERC_FAQS} />
      </div>
    </article>
  );
}