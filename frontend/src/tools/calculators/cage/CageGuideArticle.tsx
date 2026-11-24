import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAGE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function CageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="stand-for"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What does the CAGE questionnaire stand for?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CAGE stands for Cut down, Annoyed, Guilty, and Eye-opener — four lifetime
        questions introduced by Ewing to help clinicians screen for alcohol
        problems.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use this alcohol CAGE questionnaire calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tick each box that has ever applied to you. Unticked boxes count as No
        (0). The score is the number of Yes answers (0–4).
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Alcohol CAGE questionnaire test – results interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="problem-drinking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Problem drinking
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Problem drinking can harm health, relationships, and safety even when
        someone does not meet criteria for dependence. A CAGE screen is a
        starting point for conversation with a clinician — not a label.
      </p>

      <div id="cage-faq" className="not-prose mt-8">
        <FAQAccordion items={CAGE_FAQS} />
      </div>
    </article>
  );
}
