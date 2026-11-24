import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ASSUMPTIONS, DISCLAIMER, SOURCE_NOTE } from './calculation';
import { DRUG_HALF_LIFE_FAQS } from './content';

export function DrugHalfLifeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-it-works"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Drug Half-Life Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter a drug&apos;s elimination half-life and the initial dosage to see how
        much remains after each successive half-life. The table follows the same
        first-order model used in introductory pharmacokinetics education.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Elimination formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Equivalently, Dosage(t) = Dosage(0) × 2^(−t / t½). At t = 0
        the full dose remains; after two half-lives (t = 2×t½) 25% remains; after
        five half-lives about 3% remains.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions &amp; limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {ASSUMPTIONS} {DISCLAIMER}
      </p>

      <div id="faq" className="not-prose mt-8">
        <FAQAccordion items={DRUG_HALF_LIFE_FAQS} />
      </div>
    </article>
  );
}
