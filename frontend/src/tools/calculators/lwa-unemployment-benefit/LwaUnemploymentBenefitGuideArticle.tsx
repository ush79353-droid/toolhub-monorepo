import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LWA_UNEMPLOYMENT_FAQS } from './content';
import { LOAN_CALCULATOR_HREF } from './types';

export function LwaUnemploymentBenefitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-was-lwa"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Was Lost Wages Assistance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lost Wages Assistance (LWA) was a temporary 2020 program that provided supplemental
        lost-wages payments to eligible unemployment claimants during the COVID-19 pandemic.
        It was authorized by the August 8, 2020 Presidential Memorandum on Other Needs
        Assistance for COVID-19 major disaster declarations and administered through FEMA
 grants under the Stafford Act; not as a separately enacted “LWA Act.” States and
        territories paid claimants through their unemployment systems; FEMA did not pay
        individuals directly.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LWA came after the CARES Act’s Federal Pandemic Unemployment Compensation period and
        offered a shorter FEMA-funded bridge while Congress considered further legislation
        (including competing HEALS / HEROES proposals). FEMA guidance states supplemental
        lost-wages payments ended on December 27, 2020, and some states ended earlier when
        funding authority was exhausted.
      </p>

      <h2
        id="why-retired"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why This Calculator Is Retired
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Historical LWA calculators estimated temporary supplements that cannot be claimed for
        new weeks of unemployment in 2026. Showing outdated payout fields would imply a
        benefit that no longer exists. This page therefore shows a clear historical notice
        instead of unsupported eligibility forms or invented dollar amounts.
      </p>

      <h2
        id="where-to-go"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where to Go Next
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For installment-loan estimates (monthly payment and total interest), use our{' '}
        <Link
          href={LOAN_CALCULATOR_HREF}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Loan Calculator
        </Link>
        . For current unemployment insurance amounts or eligibility, contact your state
 workforce agency; this site does not replace official benefit determinations.
      </p>

      <h2
        id="lwa-unemployment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...LWA_UNEMPLOYMENT_FAQS]} />
      </div>
    </article>
  );
}
