import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUN_CREATININE_RATIO_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function BunCreatinineRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Blood urea nitrogen (BUN) vs creatinine
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BUN and creatinine are waste products cleared by the kidneys. Comparing
        them as a ratio can offer a supporting clue about fluid status or urea
        production — never a stand-alone diagnosis.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BUN creatinine ratio calculator — how to calculate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Fixture: BUN 20 mg/dL and creatinine 1 mg/dL → ratio 20.
      </p>

      <h2
        id="high-low"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BUN creatinine ratio — high and low values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A conventional adult teaching band is about 10–20. Values above 20 are
        often discussed as a prerenal pattern (for example dehydration or GI
        bleeding); values below 10 may reflect low urea production or other
        intrinsic patterns. Overlap is large — confirm with clinical context.
      </p>

      <h2
        id="bun-levels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blood urea nitrogen — levels and definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BUN measures the nitrogen content of urea. Labs that report whole urea
        (mg/dL urea or mmol/L urea) are converted to BUN mg/dL before the ratio
        so U.S.-style cut-offs remain comparable.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>

      <div id="bun-cr-faq" className="not-prose mt-8">
        <FAQAccordion items={BUN_CREATININE_RATIO_FAQS} />
      </div>
    </article>
  );
}
