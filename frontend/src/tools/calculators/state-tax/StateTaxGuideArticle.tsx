import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STATE_TAX_FAQS } from './content';

export function StateTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-state-tax-navigator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the State Tax Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page is a navigator. Pick the state where you live to open that
        state’s dedicated tax calculator when Omega Calculators has published one.
        It does not estimate brackets or withholdings itself.
      </p>
      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Tool
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select your state (default Alabama).</li>
        <li>
          If a dedicated calculator is available, click the Visit our… Tax
          Calculator link.
        </li>
        <li>If none is available, the page says so clearly.</li>
      </ol>
      <h2
        id="available-states"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Available State Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Live destinations currently include Alabama, California, and Illinois.
        Links are only shown for catalog tools that are developed and active —
        never invented URLs.
      </p>
      <h2
        id="state-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...STATE_TAX_FAQS]} />
      </div>
    </article>
  );
}
