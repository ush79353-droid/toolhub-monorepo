import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CIWA_FAQS, SOURCE_LABEL } from './content';

export function CiwaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        CIWA Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Score the revised Clinical Institute Withdrawal Assessment for Alcohol
        (CIWA-Ar) items to obtain an educational total from 0 to 67. This
        worksheet does not diagnose withdrawal or prescribe medication.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For each of the ten items, choose the published descriptor that matches
        the observation. Use 0 when the symptom is observed to be absent. Use
        “Not assessed” when the item was not rated. The total updates as you
        change selections. Share copies only the public page URL.
      </p>

      <h2
        id="ciwa-ar"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CIWA-Ar Items
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Nausea/vomiting, tremor, paroxysmal sweats, anxiety, agitation</li>
        <li>Tactile, auditory, and visual disturbances; headache</li>
        <li>Orientation and clouding of sensorium (0–4 only)</li>
      </ul>

      <h2
        id="scoring"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nine items score 0–7; orientation scores 0–4. Maximum total is 67.
        Literature often discusses educational bands under 10, 10–20, and over
        20 — these are severity context only, never automatic drug orders.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CIWA-Ar belongs in appropriate clinical settings with trained
        observers. Intermediate unlabeled scores on the original form are kept
        as intermediate points. Do not use this page for self-dosing.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="ciwa-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CIWA_FAQS]} />
      </div>
    </article>
  );
}
