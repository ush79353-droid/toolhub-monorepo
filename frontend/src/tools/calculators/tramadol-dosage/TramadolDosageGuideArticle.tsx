import { TRAMADOL_DOSAGE_FAQS } from './content';

export function TramadolDosageGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What This Calculator Does
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Convert a clinician-prescribed tramadol daily milligram amount into a
          whole number of extended-release tablets (100–300 mg). It does not
          invent starting doses or titration schedules.
        </p>
      </section>

      <section id="conversion" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Prescribed Amount Conversion
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tablets = daily mg ÷ tablet strength, and daily mg = tablets ×
          strength. Both directions stay linked. Non-multiples are rejected so
          ER tablets are never split.
        </p>
      </section>

      <section id="ceilings" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Educational Ceilings
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Chronic teaching max ≈ 300 mg/day</li>
          <li>Acute teaching max ≈ 400 mg/day</li>
          <li>CrCl &lt; 30 mL/min or cirrhosis flag ≈ 200 mg/day educational ceiling</li>
        </ul>
      </section>

      <section id="limits" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Age and Organ Limits
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Under 17: conversion disabled (FDA warns against pediatric use). Over
          75 and organ insufficiency: extra caution copy — clinician
          individualization required.
        </p>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Controlled substance. Does not screen for serotonin syndrome risk,
          seizure risk, or interacting drugs. Immediate-release 50 mg regimens
          are outside the ER tablet-strength UI. Share copies only the page URL.
        </p>
      </section>

      <section id="faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FAQ</h2>
        <dl className="space-y-4">
          {TRAMADOL_DOSAGE_FAQS.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-semibold text-accent">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
