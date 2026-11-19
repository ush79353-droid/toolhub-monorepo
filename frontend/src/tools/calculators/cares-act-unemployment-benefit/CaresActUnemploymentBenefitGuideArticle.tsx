import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARES_ACT_UNEMPLOYMENT_FAQS } from './content';
import { UNEMPLOYMENT_CALCULATOR_HREF } from './types';

export function CaresActUnemploymentBenefitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-was-cares"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Was the CARES Act?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Coronavirus Aid, Relief, and Economic Security (CARES) Act (Pub. L. 116-136) was a
        2020 U.S. relief package that included temporary pandemic unemployment programs for
        workers affected by COVID-19. Those programs were time-limited legislation, not a
        permanent replacement for regular state unemployment insurance.
      </p>

      <h2
        id="why-retired"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why This Calculator Is Retired
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Historical CARES Act unemployment benefit calculators estimated temporary supplements that
        are no longer available for new claims. Showing outdated payout fields would imply a
        benefit that cannot be claimed in 2026. This page therefore shows a clear historical notice
        instead of unsupported eligibility forms or invented dollar amounts.
      </p>

      <h2
        id="where-to-go"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where to Go Next
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For unemployment-<em>rate</em> calculations (labor-force statistics), use our{' '}
        <Link
          href={UNEMPLOYMENT_CALCULATOR_HREF}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Unemployment calculator
        </Link>
        . For current unemployment insurance amounts or eligibility, contact your state workforce
        agency — this site does not replace official benefit determinations.
      </p>

      <h2
        id="cares-unemployment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CARES_ACT_UNEMPLOYMENT_FAQS]} />
      </div>
    </article>
  );
}
