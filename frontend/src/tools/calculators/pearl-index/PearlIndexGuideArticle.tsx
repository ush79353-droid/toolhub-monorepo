import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PEARL_INDEX_FAQS } from './content';
import { ILLUSTRATIVE_COMPARISONS, SOURCE_NOTE } from './calculation';

export function PearlIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Pearl Index Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the number of women, study duration, and observed pregnancies to
        compute a classic Pearl Index under equal full follow-up. Educational
        use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Pearl Index Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Equivalently, Pearl = 1,200 × pregnancies / woman-months.
      </p>

      <h2
        id="assumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Equal Follow-Up Assumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exposure is women × duration. If participants leave early or start late,
        published analyses usually accumulate actual person-time or use life
        tables; this tool does not invent those adjustments.
      </p>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparison Figures
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {ILLUSTRATIVE_COMPARISONS.map((row) => (
          <li key={row.method}>
            {row.method}: {row.pearl}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These match the reference screenshot for orientation. They are not
        outputs of your study inputs.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not use this page to choose contraception or to interpret clinical
        trial superiority. Pearl indices from trials of different lengths are not
        always comparable.
      </p>

      <h2
        id="pi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PEARL_INDEX_FAQS]} />
      </div>
    </article>
  );
}
