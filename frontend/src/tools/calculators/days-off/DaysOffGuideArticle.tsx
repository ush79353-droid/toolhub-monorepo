import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DAYS_OFF_FAQS } from './content';

export function DaysOffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-days-off"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare how paid days off are usually treated for United States, United Kingdom, and Poland
        workers across full-time, part-time, and freelance / contract arrangements. The result is
        informational text, not a leave-balance spreadsheet.
      </p>

      <h2 id="how-it-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose a country and contract type. The calculator shows a concise summary that separates
        statutory entitlements, typical employer practice, and contractor arrangements where those
        differ.
      </p>

      <h2 id="days-off-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DAYS_OFF_FAQS]} />
      </div>
    </article>
  );
}
