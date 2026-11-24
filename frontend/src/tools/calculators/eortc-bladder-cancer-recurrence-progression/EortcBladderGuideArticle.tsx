import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EORTC_BLADDER_FAQS, SOURCE_LABEL } from './content';

export function EortcBladderGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EORTC Bladder Cancer Recurrence and Progression Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate short- and long-term probabilities of{' '}
        <strong>recurrence</strong> and <strong>progression</strong> for
        non–muscle-invasive bladder cancer using the published EORTC risk
        tables. Educational only — it cannot replace urologic judgment.
      </p>

      <h2
        id="about-nmibc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        About NMIBC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Most newly diagnosed bladder cancers are non–muscle-invasive (Ta, T1,
        and/or CIS). Prognosis after transurethral resection depends on tumor
        number, size, prior recurrence pattern, stage, concomitant CIS, and
        grade. Separate estimates for recurrence versus muscle-invasive
        progression help frame follow-up intensity and adjuvant options with a
        clinician.
      </p>

      <h2
        id="how-tables-work"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Risk Tables Work
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sylvester and colleagues (European Urology 2006) pooled 2,596 eligible
        patients from seven EORTC trials and built two additive scores—one for
        recurrence (0–17) and one for progression (0–23)—then mapped score bins
        to 1- and 5-year cumulative incidence estimates. This calculator uses
        those published weights and bins.
      </p>

      <h2
        id="weights"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Weights
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Tumors:</strong> single 0/0; 2–7 → 3/3; 8+ → 6/3
          (recurrence/progression)
        </li>
        <li>
          <strong>Diameter:</strong> &lt;3 cm → 0/0; ≥3 cm → 3/3 (exact 3 cm
          uses the ≥3 cm category)
        </li>
        <li>
          <strong>Prior recurrence:</strong> primary 0/0; ≤1/year → 2/2; &gt;1/year
          → 4/2
        </li>
        <li>
          <strong>Stage:</strong> Ta 0/0; T1 → 1/4
        </li>
        <li>
          <strong>CIS:</strong> no 0/0; yes → 1/6
        </li>
        <li>
          <strong>Grade (WHO 1973):</strong> G1 0/0; G2 → 1/0; G3 → 2/5
        </li>
      </ul>

      <h2
        id="probabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Probability Bins
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Recurrence bins: 0 → 15%/31%; 1–4 → 24%/46%; 5–9 → 38%/62%; 10–17 →
        61%/78% (1 year / 5 years). Progression bins: 0 → 0.2%/0.8%; 2–6 →
        1%/6%; 7–13 → 5%/17%; 14–23 → 17%/45%.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Contemporary Care
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Derivation patients were treated mainly in the 1980s with limited BCG
        maintenance and infrequent immediate postoperative chemotherapy. Modern
        pathways (BCG induction/maintenance, restaging TUR, perioperative
        chemo) can change absolute risks—these tables may overestimate risk
        after contemporary therapy. WHO 2004/2016 grading is not remapped here.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="eortc-bladder-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...EORTC_BLADDER_FAQS]} />
      </div>
    </article>
  );
}
