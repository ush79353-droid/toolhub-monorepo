import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PADUA_FAQS } from './content';
import { HIGH_RISK_THRESHOLD, SOURCE_LABEL } from './calculation';

export function PaduaScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Padua Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total the Padua Prediction Score used in research on venous
        thromboembolism risk among hospitalized medical patients. Educational
        only — not a prophylaxis order.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Padua Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Barbar and colleagues described an eleven-item additive score to help
        identify medical inpatients at higher versus lower VTE risk during
        hospitalization.
      </p>

      <h2
        id="points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Weights
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>3 points:</strong> active cancer; previous VTE (not
          superficial); reduced mobility; known thrombophilia
        </li>
        <li>
          <strong>2 points:</strong> trauma and/or surgery within the last month
        </li>
        <li>
          <strong>1 point:</strong> age ≥70; BMI ≥30; hormonal therapy; heart
          and/or respiratory failure; acute MI or ischemic stroke; acute
          infection and/or rheumatologic disorder
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">{SOURCE_LABEL}</p>

      <h2
        id="threshold"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        High-Risk Threshold
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The derivation framed score ≥{HIGH_RISK_THRESHOLD} as higher VTE risk.
        Reference UIs sometimes show prophylaxis wording for that band; this
        tool contextualizes the threshold without issuing treatment orders.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Tick every factor that applies.</li>
        <li>Read the live total (0–20) and educational band.</li>
        <li>Reload or Clear restores unchecked defaults.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age ≥70 alone → <strong>1</strong> (below threshold). Active cancer +
        age ≥70 → <strong>4</strong> (high-risk band framing).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Does not assess bleeding risk or drug choice.</li>
        <li>Does not apply Caprini, IMPROVE, or surgical populations.</li>
        <li>Answers are not stored or shared in URLs.</li>
      </ul>

      <div id="padua-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...PADUA_FAQS]} />
        </div>
      </div>
    </article>
  );
}
