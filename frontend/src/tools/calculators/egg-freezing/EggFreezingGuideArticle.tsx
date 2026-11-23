import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EGG_FREEZING_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function EggFreezingGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Egg Freezing Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a modeled chance of at least one live birth from frozen mature
        eggs using the Goldman et al. 2017 counseling equations. The tool is
        educational and does not replace clinic counseling.
      </p>

      <h2
        id="model"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goldman 2017 Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The model combines age-specific blastocyst formation (with thaw
        survival), euploidy rates from Reprogenetics aCGH data, and a 60% live
        birth assumption per transferred euploid blastocyst. It was built from
        surrogate ICSI cycles with uncompromised ovarian reserve, not from women
        who later warmed electively frozen eggs.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary source: {SOURCE_LABEL}
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Probability Is Calculated
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          p(blast) = S × exp(2.8043 − 0.1112 × Age*), with S = 0.95 if age &lt;
          36 else 0.85; Age* = 35 for ages ≤ 35.
        </li>
        <li>p(euploid) from Supplementary Table SI by age.</li>
        <li>
          P(≥1 live birth) = 1 − (1 − 0.6 × p(euploid) × p(blast))^n for n
          mature eggs.
        </li>
      </ul>

      <h2
        id="population"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Population and Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Supported ages are 25–44 years. Zero mature eggs yield 0%. The estimate
        never reaches a guaranteed 100% birth. Center-specific survival and
        transfer outcomes may differ.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age at freezing in whole years.</li>
        <li>Enter the number of frozen mature (MII) eggs.</li>
        <li>Read the modeled chance of at least one live birth.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age <strong>35</strong> · <strong>10</strong> mature eggs → about{' '}
        <strong>69%</strong> chance of at least one live birth (matches Goldman
        Table SII).
      </p>

      <h2
        id="egg-freezing-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...EGG_FREEZING_FAQS]} />
      </div>
    </article>
  );
}
