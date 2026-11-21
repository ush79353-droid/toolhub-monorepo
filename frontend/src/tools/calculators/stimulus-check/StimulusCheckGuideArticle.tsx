import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STIMULUS_CHECK_FAQS } from './content';

const IRS_EIP =
  'https://www.irs.gov/coronavirus/economic-impact-payments';
const USC_6428 =
  'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section6428';
const CRS_IN11355 =
  'https://www.congress.gov/crs_external_products/IN/PDF/IN11355/IN11355.7.pdf';
const CARES_ACT =
  'https://www.congress.gov/116/plaws/publ136/PLAW-116publ136.pdf';

export function StimulusCheckGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In March 2020, Congress enacted the{' '}
              <strong>Coronavirus Aid, Relief, and Economic Security (CARES) Act</strong>{' '}
              (P.L. 116-136). Section 2201 authorized the 2020 Recovery Rebate Credit and its
 advance payment: the IRS <strong>first Economic Impact Payment (EIP1)</strong>,
              commonly called the first stimulus check.
            </p>
            <p>
              Treasury and the IRS began delivering those payments in April 2020. This page
              reconstructs the enacted EIP1 formula for historical education only. It does not
              represent a currently available benefit, a claim portal, or personalized IRS advice.
            </p>
          </div>
        </article>

        <article id="verified-payment-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Verified Payment Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The 2020 Recovery Rebate Credit is codified at <strong>26 U.S.C. §6428</strong>.
              Contemporaneous IRS and CRS materials summarize the advance EIP1 as:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$1,200</strong> base for an eligible individual (
                <strong>$2,400</strong> for most married couples filing jointly).
              </li>
              <li>
                An additional <strong>$500</strong> for each qualifying child under age 17 (IRC
                §24(c)).
              </li>
              <li>
                Full payment for 2019 AGI up to <strong>$75,000</strong> (single),{' '}
                <strong>$112,500</strong> (head of household), or <strong>$150,000</strong> (joint /
                surviving spouse).
              </li>
              <li>
                Reduction of <strong>5%</strong> of AGI above those thresholds, floored at $0.
              </li>
              <li>
                Eligibility generally required U.S. residency (or certain nonresident exceptions
                later clarified), a valid work-eligible Social Security number, and that the
                individual not be claimed as a dependent by someone else.
              </li>
            </ul>
            <p>
              Primary references include{' '}
              <a
                href={USC_6428}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                26 U.S.C. §6428
              </a>
              , the{' '}
              <a
                href={CARES_ACT}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                CARES Act (P.L. 116-136)
              </a>
              , CRS{' '}
              <a
                href={CRS_IN11355}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                IN11355
              </a>
              , and the IRS{' '}
              <a
                href={IRS_EIP}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Economic Impact Payments overview
              </a>
              .
            </p>
          </div>
        </article>

        <article id="phaseout-and-kids" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Phase-Out & Kids
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              This calculator’s “How many kids?” field means qualifying children under 17. Adult
              dependents did not add $500 under EIP1. Example reconstructions:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>Single, 0 kids, AGI $75,000 → $1,200.</li>
              <li>Single, 0 kids, AGI $87,000 → $600 (5% × $12,000 excess).</li>
              <li>Married, 2 kids, AGI $150,000 → $3,400.</li>
              <li>Married, 2 kids, AGI $218,000 → $0 (full phase-out).</li>
            </ul>
            <p>
              Most automatic advances used 2019 tax-return data. Filers who later reconciled on a
 2020 return could claim a Recovery Rebate Credit for any unpaid EIP1 amount; that
              reconciliation workflow is outside this tool’s scope.
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
                Figures are <strong>historical estimates</strong>, not IRS transcripts or payment
 confirmations, and not an available 2026 payment.
              </li>
              <li>
                Currency is fixed <strong>USD</strong>. Kid counts and filing status are never
                currency-converted.
              </li>
              <li>
                Selecting “No” for 2019 filing yields $0 here. SSI / SSDI / RRB / certain VA
                automatic EIP1 paths are acknowledged in copy but not numerically modeled.
              </li>
              <li>
                Joint returns with only one valid SSN, deceased-spouse rules, and nonresident-alien
                exclusions are not interactive inputs on this page.
              </li>
              <li>
                Second / third stimulus rounds and proposal variants (HEALS, HEROES, CASH, ARP) have
                separate catalog tools and are not calculated here.
              </li>
            </ul>
          </div>
        </article>

        <section id="eip1-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={STIMULUS_CHECK_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
