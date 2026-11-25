import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RSBI_FAQS, SOURCE_LABEL } from './content';

export function RsbiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RSBI Calculator - Rapid Shallow Breathing Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute the rapid shallow breathing index from respiratory rate and
        tidal volume. Educational only — not a weaning or extubation decision
        tool by itself.
      </p>

      <h2
        id="rsbi-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        RSBI formula – rapid shallow breathing index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        RSBI = f / VT, with frequency in breaths per minute and tidal volume in
        liters. When tidal volume is entered in milliliters, divide by 1000
        first. Example: 20 breaths/min and 400 mL → 20 / 0.4 = 50
        breaths/min/L. Zero tidal volume is rejected.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        RSBI calculator – how to calculate RSBI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the spontaneous respiratory rate and the measured tidal volume in
        mL. The worksheet converts volume to liters and divides. Document how
        and when measurements were taken; spontaneous breathing trial conditions
        affect the index.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not equate a single RSBI threshold with readiness for extubation.
        Interpret alongside gas exchange, airway protection, hemodynamics, and
        local protocols. This page does not store entered values.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="rsbi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...RSBI_FAQS]} />
      </div>
    </article>
  );
}
