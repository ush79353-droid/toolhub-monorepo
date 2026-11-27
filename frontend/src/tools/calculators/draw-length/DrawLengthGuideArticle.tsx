import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DRAW_LENGTH_FAQS } from './content';

export function DrawLengthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Draw Length Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate draw length from fingertip-to-fingertip wingspan using the
        common wingspan ÷ 2.5 method. Educational anthropometry only — not bow
        fitting or operating guidance.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is draw length?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In archery teaching materials, draw length describes how far the string
        is drawn relative to the archer&apos;s body. This worksheet estimates that
        length from wingspan only.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate draw length — How do you figure out bow draw length?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measure wingspan fingertip to fingertip with arms outstretched, then
        divide by 2.5. Example: 70 in → 28 in. You can also enter draw length to
        back-solve wingspan (× 2.5). Unit menus convert while preserving physical
        length (1 m = 100 cm).
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why is draw length important in archery?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teaching sources link draw length to comfort and consistency. This tool
        stops at the anthropometric estimate and does not advise equipment setup.
      </p>

      <div id="draw-length-faq" className="not-prose mt-8">
        <FAQAccordion items={DRAW_LENGTH_FAQS} />
      </div>
    </article>
  );
}
