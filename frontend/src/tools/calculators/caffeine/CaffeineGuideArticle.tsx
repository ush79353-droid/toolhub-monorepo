import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAFFEINE_FAQS, SOURCE_LABEL } from './content';

export function CaffeineGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Caffeine Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add documented caffeine servings to estimate daily intake and compare
        it with population upper-limit references. Educational only.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose up to three drink types, enter how many of each you had
        (fractions allowed), and select adult, pregnant, teenager, or child.
        Totals update as you type.
      </p>

      <h2
        id="daily-limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Daily Limits
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Adults: 400 mg upper reference</li>
        <li>Pregnant: 200 mg upper reference</li>
        <li>Teenagers (13–18): about 100 mg</li>
        <li>Children (0–12): generally avoid caffeine (shown as 0 mg)</li>
      </ul>

      <h2
        id="servings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Serving Amounts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Filter coffee mug 140 mg, instant coffee mug 100 mg, tea cup 50 mg,
        green tea cup 40 mg, cola can 40 mg, energy drink 80 mg, espresso shot
        45 mg.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Brand recipes vary. Do not treat upper limits as targets. A lethal oral
        dose is often cited near 10 g — far above typical beverage intake — but
        this tool is not an overdose calculator.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="caffeine-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...CAFFEINE_FAQS]} />
      </div>
    </article>
  );
}
