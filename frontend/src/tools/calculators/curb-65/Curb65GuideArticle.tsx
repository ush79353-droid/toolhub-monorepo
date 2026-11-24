import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CURB65_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function Curb65GuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Diseases of the lungs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Community-acquired pneumonia severity scores help clinicians discuss
        care setting and mortality risk. CURB-65 is one widely taught tool.
      </p>

      <h2
        id="cap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is community-acquired pneumonia?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CAP is pneumonia acquired outside hospital. Severity varies widely;
        scoring systems support—not replace—bedside assessment.
      </p>

      <h2
        id="criteria"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are the CURB-65 criteria?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CURB-65 calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter confusion, BUN or urea, respiratory rate, blood pressures, and
        age. The score appears when all fields are complete. Example checks:
        age 65 alone scores 1; SBP 90 does not score, SBP 89 does; DBP 60 scores
        1.
      </p>

      <h2
        id="admission"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pneumonia admission criteria
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Local guidelines vary. Common teaching bands: 0–1 low risk, 2
        intermediate, 3–5 higher risk. {DISCLAIMER}
      </p>

      <div id="curb65-faq" className="not-prose mt-8">
        <FAQAccordion items={CURB65_FAQS} />
      </div>
    </article>
  );
}
