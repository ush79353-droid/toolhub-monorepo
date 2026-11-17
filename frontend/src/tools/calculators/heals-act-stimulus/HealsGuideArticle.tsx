import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEALS_FAQS } from './content';

const SENATE_PDF =
  'https://www.finance.senate.gov/imo/media/doc/SFC%20CARES%202.0%20Section-by-Section.pdf';
const TAX_FOUNDATION =
  'https://taxfoundation.org/blog/heals-act-gop-phase-4-stimulus-package-republican-coronavirus-relief-bill/';
const CNBC_HEALS =
  'https://www.cnbc.com/2020/07/28/how-the-1200-stimulus-checks-in-the-heals-act-could-differ-from-the-first-payments.html';
const HEROES_OMNI = 'https://www.omnicalculator.com/finance/stimulus-heroes';
const UI_OMNI = 'https://www.omnicalculator.com/finance/unemployment-benefit-heals';

export function HealsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In late July 2020, Senate Republicans released a COVID-19 relief package commonly
              branded the <strong>HEALS Act</strong> (Health, Economic Assistance, Liability
              Protection and Schools Act). Among its tax titles was a proposed second round of
              individual recovery rebates — often called a “second stimulus check.”
            </p>
            <p>
              That package was a negotiating position, not enacted law. Congress later passed other
              relief measures with different payment designs. This page reconstructs the{' '}
              <em>proposed</em> HEALS rebate rules for historical education only and does not imply
              that anyone can claim those amounts today.
            </p>
          </div>
        </article>

        <article id="verified-payment-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Verified Payment Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Contemporaneous primary and secondary sources describe the HEALS recovery rebate as
              structurally aligned with the CARES Act economic impact payments:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$1,200</strong> base for single and head-of-household filers;{' '}
                <strong>$2,400</strong> for married couples filing jointly.
              </li>
              <li>
                Full payment for AGI up to <strong>$75,000</strong> (single),{' '}
                <strong>$112,500</strong> (head of household), or <strong>$150,000</strong> (joint).
              </li>
              <li>
                Reduction of <strong>5%</strong> of AGI above those thresholds, floored at $0.
              </li>
              <li>
                Eligibility framed around U.S. residents with work-eligible Social Security numbers
                who had filed tax paperwork (even with no tax due).
              </li>
            </ul>
            <p>
              Reference materials include the Senate Finance Committee{' '}
              <a
                href={SENATE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                section-by-section summary
              </a>
              , the{' '}
              <a
                href={TAX_FOUNDATION}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Tax Foundation overview
              </a>
              , and{' '}
              <a
                href={CNBC_HEALS}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                contemporaneous CNBC reporting
              </a>
              .
            </p>
          </div>
        </article>

        <article id="phaseout-and-dependents" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Phase-Out & Dependents
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Unlike the first CARES Act round, which limited the extra $500 to qualifying children
              under 17, the HEALS proposal extended <strong>$500 per dependent of any age</strong>{' '}
              and did not impose a household dependent-count cap. The calculator adds $500 ×
              dependents to the base rebate before applying the 5% AGI phase-out.
            </p>
            <p>
              Because phase-out is a percentage of excess AGI against the <em>total</em> rebate,
              the AGI level at which the payment reaches zero rises when more dependents are
              claimed (for example, head of household with one dependent phases out near $146,500,
              matching the Senate summary’s illustrative endpoint).
            </p>
          </div>
        </article>

        <article id="heroes-act-comparison" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            HEROES Act Comparison
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              House Democrats’ earlier <strong>HEROES Act</strong> also proposed another round of
              checks. Public summaries typically kept the same $1,200 / $2,400 bases and similar
              income bands, but used a larger per-dependent amount (often $1,200) with a three-
              dependent household cap. Use the{' '}
              <a
                href={HEROES_OMNI}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                HEROES Act stimulus reference
              </a>{' '}
              for that historical proposal, and the{' '}
              <a
                href={UI_OMNI}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                HEALS vs HEROES unemployment reference
              </a>{' '}
              for the competing federal unemployment supplements discussed at the same time.
            </p>
          </div>
        </article>

        <article id="important-limitations" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Important Limitations
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                Results are <strong>historical and hypothetical</strong>. They are not IRS
                determinations and are not payable benefits.
              </li>
              <li>
                Fixed <strong>USD</strong> only — no currency conversion of thresholds or payments.
              </li>
              <li>
                Benefit-recipient auto-pay paths (SSA, SSI, VA, RRB) and mixed ITIN/SSN household
                edge cases are summarized in sources but not fully simulated in the form.
              </li>
              <li>
                Selecting “No” for 2019 filing returns a $0 estimate because the proposal required
                filed paperwork (or other covered benefit status not modeled here).
              </li>
            </ul>
          </div>
        </article>

        <article id="heals-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...HEALS_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
