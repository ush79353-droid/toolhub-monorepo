import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RMD_FAQS } from './content';

export function RmdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-rmd" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is an RMD?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A required minimum distribution is the smallest amount many retirement account owners must
        withdraw each year after reaching the applicable beginning age. Under SECURE 2.0, that age
        is generally <strong>73</strong> (born 1951–1959) or <strong>75</strong> (born 1960+), with
        earlier cohorts under prior law. This calculator estimates the common Uniform Lifetime Table
        RMD amount for an owner&apos;s lifetime distributions; it does not decide whether an RMD is
        due for your birth year. Joint-life Table II is unsupported without spouse age.
      </p>
      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm whether your spouse is more than 10 years younger and the sole IRA beneficiary.</li>
        <li>Select your age for the distribution year and enter the Dec 31 prior-year balance.</li>
        <li>Read the life expectancy factor and estimated RMD (or the unavailable notice for joint-life).</li>
      </ol>
      <h2
        id="uniform-lifetime"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Uniform Lifetime Table
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Factors follow IRS Pub. 590-B Appendix B Table III for 2022 and later (age 72 = 27.4). RMD =
        Balance ÷ Factor. The table supports ages 72–120 even when SECURE 2.0 starting ages are 73 or
 75 (selecting an age only looks up the factor. Educational estimate) not tax advice.
      </p>
      <h2 id="rmd-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RMD_FAQS]} />
      </div>
    </article>
  );
}
