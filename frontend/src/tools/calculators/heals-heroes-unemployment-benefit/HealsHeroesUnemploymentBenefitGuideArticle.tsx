import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEALS_HEROES_UNEMPLOYMENT_FAQS } from './content';
import { ANNUAL_SALARY_CALCULATOR_HREF } from './types';

export function HealsHeroesUnemploymentBenefitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-were-heals-heroes"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Were HEALS and HEROES?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In mid-2020, Congress debated follow-on pandemic relief after the enacted Coronavirus Aid,
        Relief, and Economic Security (CARES) Act. Senate Republicans advanced the HEALS Act
        package, which included the American Workers, Families, and Employers Assistance Act. House
        Democrats had passed the Health and Economic Recovery Omnibus Emergency Solutions (HEROES)
        Act (H.R. 6800). Both proposals addressed pandemic unemployment assistance differently, and
        neither became law in the form debated as HEALS or HEROES.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Contemporaneous public summaries (for example from CRS, CRFB, and major news outlets)
        described the proposals as competing legislative packages — not as permanent benefit
        programs. This page therefore treats them as historical proposals only.
      </p>

      <h2
        id="why-retired"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why This Calculator Is Retired
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Older “HEALS vs HEROES” unemployment calculators estimated proposal-era supplements that
        cannot be claimed today. Showing payout fields would imply benefits that were never enacted
        as written and are not available for new claims in 2026. This page shows a clear historical
        notice instead of unsupported eligibility forms or invented dollar amounts.
      </p>

      <h2
        id="where-to-go"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where to Go Next
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For converting wages between hourly and yearly figures, use our{' '}
        <Link
          href={ANNUAL_SALARY_CALCULATOR_HREF}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Annual Salary Calculator
        </Link>
        . For current unemployment insurance amounts or eligibility, contact your state workforce
        agency — this site does not replace official benefit determinations.
      </p>

      <h2
        id="heals-heroes-unemployment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...HEALS_HEROES_UNEMPLOYMENT_FAQS]} />
      </div>
    </article>
  );
}
