import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INR_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function InrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        INR Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the patient’s prothrombin time, the laboratory mean normal PT
        (shown as Control PT), and the thromboplastin’s ISI to compute the
        International Normalized Ratio. Values stay in your browser; share uses
        the public page URL only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WHO formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Equal patient and mean normal PT yields INR 1 for any
        positive ISI. This tool does not invent therapeutic target ranges.
      </p>

      <div id="inr-faq" className="not-prose mt-8">
        <FAQAccordion items={INR_FAQS} />
      </div>
    </article>
  );
}
