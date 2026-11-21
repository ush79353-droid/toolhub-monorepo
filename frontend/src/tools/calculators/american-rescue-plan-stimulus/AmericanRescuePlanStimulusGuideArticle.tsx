import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARP_STIMULUS_FAQS } from './content';

const IRS_PUB_5514 = 'https://www.irs.gov/pub/irs-pdf/p5514.pdf';
const IRS_FS_2022_22 = 'https://www.irs.gov/pub/taxpros/fs-2022-22.pdf';
const USC_6428B = 'https://www.law.cornell.edu/uscode/text/26/6428B';
const TREASURY_EIP =
  'https://home.treasury.gov/policy-issues/coronavirus/assistance-for-american-families-and-workers/economic-impact-payments';

export function AmericanRescuePlanStimulusGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              On <strong>March 11, 2021</strong>, the{' '}
              <strong>American Rescue Plan Act of 2021</strong> (P.L. 117-2) became law. Among its
 provisions was a third round of individual recovery rebates: the IRS{' '}
 <strong>third Economic Impact Payment (EIP3)</strong>: as an advance of the 2021
              Recovery Rebate Credit under <strong>I.R.C. §6428B</strong>.
            </p>
            <p>
              Treasury and the IRS delivered those payments during 2021. This page reconstructs the
              enacted EIP3 formula for historical education only. It does not represent a currently
              available benefit, a claim portal, or personalized IRS advice.
            </p>
          </div>
        </article>

        <article id="verified-payment-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Verified Payment Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Contemporaneous IRS and Treasury materials summarize the advance EIP3 as:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$1,400</strong> base for an eligible individual (
                <strong>$2,800</strong> for most married couples filing jointly).
              </li>
              <li>
                An additional <strong>$1,400</strong> for each qualifying dependent under IRC §152,
                including qualifying adult dependents.
              </li>
              <li>
                Full payment for AGI up to <strong>$75,000</strong> (single),{' '}
                <strong>$112,500</strong> (head of household), or <strong>$150,000</strong> (joint /
                surviving spouse).
              </li>
              <li>
                Linear reduction to <strong>$0</strong> by <strong>$80,000</strong>,{' '}
                <strong>$120,000</strong>, or <strong>$160,000</strong> respectively (same ratio as
                excess AGI over the start threshold bears to the phase-out range).
              </li>
              <li>
                Eligibility generally required a valid Social Security number and that the
                individual not be claimed as a dependent by someone else.
              </li>
            </ul>
            <p>
              Primary references include{' '}
              <a
                href={USC_6428B}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                26 U.S.C. §6428B
              </a>
              , IRS{' '}
              <a
                href={IRS_PUB_5514}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Publication 5514
              </a>
              , IRS{' '}
              <a
                href={IRS_FS_2022_22}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                FS-2022-22
              </a>
              , and the{' '}
              <a
                href={TREASURY_EIP}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Treasury Economic Impact Payments overview
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
              This calculator’s “How many dependents?” field means qualifying dependents under IRC
              §152 (including adult dependents). Example reconstructions:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>Single, 0 dependents, AGI $75,000 → $1,400.</li>
              <li>Single, 0 dependents, AGI $77,500 → $700 (midpoint of $75k–$80k).</li>
              <li>Single, 0 dependents, AGI $80,000 → $0.</li>
              <li>Married, 2 dependents, AGI $150,000 → $5,600.</li>
              <li>Head of household, 1 dependent, AGI $112,500 → $2,800.</li>
            </ul>
            <p>
              Most automatic advances used 2020 tax-return data when available, otherwise 2019.
              Filers who later reconciled on a 2021 return could claim a Recovery Rebate Credit for
 any unpaid EIP3 amount; that reconciliation workflow is outside this tool’s scope.
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
                confirmations, and not currently available government payments.
              </li>
              <li>
                Currency is fixed <strong>USD</strong>. Dependent counts and eligibility rules are
                never currency-converted.
              </li>
              <li>
                Selecting “No” for 2019/2020 filing yields $0 here. SSI / SSDI / RRB / certain VA
                automatic EIP3 paths are acknowledged in copy but not numerically modeled.
              </li>
              <li>
                Joint returns with only one valid SSN, deceased-spouse rules, and nonresident-alien
                exclusions are not interactive inputs on this page.
              </li>
            </ul>
          </div>
        </article>

        <section id="eip3-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...ARP_STIMULUS_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
