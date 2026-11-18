import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALIFORNIA_STIMULUS_CHECK_II_FAQS } from './content';

export function CaliforniaStimulusCheckIiGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="overview-and-history" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Overview & Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Golden State Stimulus II (GSS II) was a one-time California tax-refund payment authorized
              in 2021 to provide short-term relief related to the COVID-19 emergency. Public
              communications noted that Californians began receiving the second round of payments
              around August 27, 2021, and that the program was expected to reach a large share of
              state residents who filed qualifying 2020 returns.
            </p>
            <p>
              This page reconstructs eligibility and payment categories from Franchise Tax Board
              Public Service Bulletin 2021-18 and California Welfare and Institutions Code §8150.2.
              It is not an application portal and does not represent a current state benefit.
            </p>
          </div>
        </article>

        <article id="eligibility-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Eligibility Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>Published GSS II qualification generally required all of the following:</p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>File a 2020 California individual income tax return by October 15, 2021 (limited ITIN extension to February 15, 2022).</li>
              <li>California residency for more than half of tax year 2020, and residency on the payment issue date.</li>
              <li>California AGI of $1–$75,000 ($37,500 married filing separately).</li>
              <li>Wages subject to California withholding of $75,000 or less ($37,500 MFS).</li>
              <li>Not claimable as a dependent by another taxpayer.</li>
            </ul>
            <p>
              The calculator form mirrors the reference screenshot fields only. Wage, dependent-of-another,
              and MFS inputs are therefore treated as assumptions disclosed in the results panel rather
              than invented controls.
            </p>
          </div>
        </article>

        <article id="payment-amounts" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Payment Amounts
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Non–married-filing-separately amounts under §8150.2(c) / FTB guidance were:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>$500 — SSN, qualified for GSS I, claimed one or more dependent exemption credits.</li>
              <li>$600 — did not qualify for GSS I, did not claim a dependent exemption credit.</li>
              <li>$1,000 — ITIN, qualified for GSS I, claimed one or more dependent exemption credits.</li>
              <li>$1,100 — did not qualify for GSS I, claimed one or more dependent exemption credits.</li>
            </ul>
            <p>
              FTB explicitly noted that people who qualified for GSS I and did not claim a dependent
              credit did not qualify for GSS II. Married-filing-separately amounts were half of the
              figures above; this form does not collect filing status, so it reports the full amounts.
            </p>
          </div>
        </article>

        <article id="payment-timing" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Payment Timing
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Payments were issued after return processing. Historical FTB commentary indicated direct
              deposits often appeared within a few business days of issuance, while paper checks could
              take up to about three weeks and were mailed in batches tied to ZIP-code endings.
              Returns filed after September 1, 2021 could take up to about 45 days after processing
              before a payment was scheduled. Statute directed issuance of required payments by July
              15, 2022.
            </p>
            <p>
              Because ZIP code, processing queues, and verification holds are outside this form, the
              calculator provides labeled historical guidance instead of inventing a personal payment
              date.
            </p>
          </div>
        </article>

        <article id="program-status" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Program Status Today
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              According to the Franchise Tax Board, Golden State Stimulus I & II are complete and no
              new GSS payments have been issued since July 15, 2022. Estimates shown here are
              educational reconstructions of the 2021–2022 program rules only.
            </p>
          </div>
        </article>

        <section id="gss2-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={CALIFORNIA_STIMULUS_CHECK_II_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
