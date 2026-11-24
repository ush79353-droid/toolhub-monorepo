import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CIGARETTE_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function CigaretteGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Is cigarette smoking an addiction?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nicotine dependence is common among people who smoke regularly. This
        calculator only estimates cumulative cigarette counts from the habits
        you enter — it does not diagnose addiction or prescribe treatment.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does the cigarette calculator work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: 1 pack/day × 20 cigarettes/pack for 1 year (365
        days) → 7,300 cigarettes.
      </p>

      <h2
        id="risks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are the risks of smoking?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cigarette smoking is linked to higher risks of many cancers,
        cardiovascular disease, and other conditions. Talk with a clinician
        about cessation support. {DISCLAIMER}
      </p>

      <div id="cigarette-faq" className="not-prose mt-8">
        <FAQAccordion items={CIGARETTE_FAQS} />
      </div>
    </article>
  );
}
