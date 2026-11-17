import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SECOND_STIMULUS_900B_FAQS } from './content';

const IRS_PUB_5475 = 'https://www.irs.gov/pub/irs-pdf/p5475.pdf';
const CRS_IN11575 =
  'https://www.congress.gov/crs_external_products/IN/PDF/IN11575/IN11575.3.pdf';
const USC_6428A = 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section6428A';
const TREASURY_SM1224 =
  'https://home.treasury.gov/news/press-releases/sm1224';

export function SecondStimulus900BillionGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In December 2020, Congress enacted the{' '}
              <strong>Consolidated Appropriations Act, 2021</strong> (P.L. 116-260), which included
              roughly <strong>$900 billion</strong> in COVID-19 relief. Part of that package
              authorized a second round of individual recovery rebates — the IRS{' '}
              <strong>second Economic Impact Payment (EIP2)</strong>.
            </p>
            <p>
              Treasury and the IRS began delivering those payments around late December 2020. This
              page reconstructs the enacted EIP2 formula for historical education only. It does not
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
              The Additional 2020 Recovery Rebate Credit is codified at{' '}
              <strong>26 U.S.C. §6428A</strong>. Contemporaneous IRS and CRS materials summarize the
              advance EIP2 as:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$600</strong> base for an eligible individual (
                <strong>$1,200</strong> for most married couples filing jointly).
              </li>
              <li>
                An additional <strong>$600</strong> for each qualifying child under age 17 (IRC
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
                Eligibility generally required a valid work-eligible Social Security number and that
                the individual not be claimed as a dependent by someone else.
              </li>
            </ul>
            <p>
              Primary references include{' '}
              <a
                href={USC_6428A}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                26 U.S.C. §6428A
              </a>
              , IRS{' '}
              <a
                href={IRS_PUB_5475}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Publication 5475
              </a>
              , CRS{' '}
              <a
                href={CRS_IN11575}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                IN11575
              </a>
              , and the{' '}
              <a
                href={TREASURY_SM1224}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Treasury delivery announcement
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
              dependents did not add $600 under EIP2. Example reconstructions:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>Single, 0 kids, AGI $75,000 → $600.</li>
              <li>Single, 0 kids, AGI $81,000 → $300 (5% × $6,000 excess).</li>
              <li>Married, 2 kids, AGI $150,000 → $2,400.</li>
              <li>Married, 2 kids, AGI $198,000 → $0 (CRS illustration of full phase-out).</li>
            </ul>
            <p>
              Most automatic advances used 2019 tax-return data. Filers who later reconciled on a
              2020 return could claim a Recovery Rebate Credit for any unpaid EIP2 amount — that
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
                confirmations.
              </li>
              <li>
                Currency is fixed <strong>USD</strong>. Kid counts and eligibility rules are never
                currency-converted.
              </li>
              <li>
                Selecting “No” for 2019 filing yields $0 here. SSI / SSDI / RRB / certain VA
                automatic EIP2 paths are acknowledged in copy but not numerically modeled.
              </li>
              <li>
                Joint returns with only one valid SSN, deceased-spouse rules, and nonresident-alien
                exclusions are not interactive inputs on this page.
              </li>
            </ul>
          </div>
        </article>

        <section id="eip2-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...SECOND_STIMULUS_900B_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
