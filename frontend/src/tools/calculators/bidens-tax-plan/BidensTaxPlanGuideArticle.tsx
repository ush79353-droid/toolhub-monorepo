import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BIDENS_TAX_PLAN_FAQS } from './content';

const IRS_RP_2021_45 = 'https://www.irs.gov/pub/irs-drop/rp-21-45.pdf';
const TAX_FOUNDATION_2022 =
  'https://taxfoundation.org/data/all/federal/2022-tax-brackets/';
const TAX_FOUNDATION_AFP =
  'https://taxfoundation.org/research/all/federal/american-families-plan/';
const IRS_CTC_TOPIC_C =
  'https://www.irs.gov/credits-deductions/2021-child-tax-credit-and-advance-child-tax-credit-payments-topic-c-calculation-of-the-2021-child-tax-credit';
const CRS_IN11656 =
  'https://www.everycrsreport.com/files/2021-05-05_IN11656_8e75b1c82ca7e61e4711044c2d0f291531d1c3a3.pdf';

export function BidensTaxPlanGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In 2021 the Biden Administration proposed the{' '}
              <strong>American Families Plan (AFP)</strong> to fund family and education
              priorities partly through individual income-tax changes. The original calculator copy
 on this product framed the tool around that proposal and the American Families Plan; 
              not as a generic “any year” campaign quiz.
            </p>
            <p>
              This page is labeled a <strong>Historical Biden Tax Plan Comparison</strong>. A
              proposal is not automatically enacted law. Results are educational reconstructions,
              not IRS determinations and not estimates of today’s Form 1040 liability.
            </p>
          </div>
        </article>

        <article id="baseline-and-proposal" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Baseline &amp; Proposal
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              <strong>Baseline (labeled “current tax plan” in the historical UI):</strong> tax year{' '}
              <strong>2022</strong> ordinary brackets and standard deductions under then-current
              TCJA law (
              <a
                className="font-medium text-primary underline-offset-2 hover:underline"
                href={IRS_RP_2021_45}
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Rev. Proc. 2021-45
              </a>
              ;{' '}
              <a
                className="font-medium text-primary underline-offset-2 hover:underline"
                href={TAX_FOUNDATION_2022}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tax Foundation 2022 brackets
              </a>
              ). Child Tax Credit $2,000 per qualifying child under 17 and $500 Credit for Other
              Dependents, with the TCJA phaseout ($50 per $1,000 over $200,000 / $400,000).
            </p>
            <p>
 <strong>Biden plan:</strong> May 2021 AFP ordinary top-rate change; {' '}
              <strong>39.6%</strong> above <strong>$452,700</strong> (single / head of household) or{' '}
 <strong>$509,300</strong> (joint) in 2022 dollars, plus extension of the ARP-style
              CTC (<strong>$3,600</strong> under 6 / <strong>$3,000</strong> ages 6–17) with the
              documented two-step phaseout and full refundability (
              <a
                className="font-medium text-primary underline-offset-2 hover:underline"
                href={TAX_FOUNDATION_AFP}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tax Foundation AFP analysis
              </a>
              ;{' '}
              <a
                className="font-medium text-primary underline-offset-2 hover:underline"
                href={IRS_CTC_TOPIC_C}
                target="_blank"
                rel="noopener noreferrer"
              >
                IRS Topic C
              </a>
              ;{' '}
              <a
                className="font-medium text-primary underline-offset-2 hover:underline"
                href={CRS_IN11656}
                target="_blank"
                rel="noopener noreferrer"
              >
                CRS IN11656
              </a>
              ).
            </p>
            <p>
              <strong>Married</strong> is modeled as married filing jointly. Parent{' '}
              <strong>age ≥ 65</strong> adds the TY2022 additional aged standard deduction ($1,750
              unmarried / $1,400 married). Age does not otherwise change tax in this model.
            </p>
          </div>
        </article>

        <article id="how-estimates-work" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How Estimates Work
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Taxable income</strong> = AGI − applicable standard deduction (not AGI by
                itself).
              </li>
              <li>
                <strong>Ordinary tax</strong> = progressive sum of taxable income in each bracket ×
                that bracket’s rate.
              </li>
              <li>
                <strong>Estimated net tax</strong> = ordinary tax − eligible credits (baseline
                credits are nonrefundable; AFP CTC is treated as fully refundable).
              </li>
              <li>
                <strong>Effective tax rate</strong> = estimated federal income tax ÷ annual AGI ×
                100 (em dash when AGI is $0).
              </li>
              <li>
 <strong>Number of dependents</strong> = other dependents for the $500 ODC only; 
                never re-enter children from the age buckets.
              </li>
            </ul>
          </div>
        </article>

        <article id="important-limitations" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Important Limitations
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>This simplified historical estimate does <strong>not</strong> include:</p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>Long-term capital gains / qualified dividends taxed as ordinary income above $1M (AFP)</li>
              <li>Net Investment Income Tax (NIIT) expansions</li>
              <li>Itemized deductions, QBI (§199A), AMT, EITC, or state income tax</li>
              <li>
 Baseline Additional Child Tax Credit (ACTC); earned income is not an input, so
                refundable ACTC is omitted and baseline tax after credits is floored at $0
              </li>
              <li>
                Within-bucket age-17-only distinctions for the “children between 6 and 17” field
              </li>
            </ul>
            <p>
              Actual tax returns differ because of withholding, credits not modeled here, and later
              law changes. Do not use this tool as a substitute for IRS publications or a tax
              professional.
            </p>
          </div>
        </article>

        <section id="biden-tax-faq" className="scroll-mt-24 py-7 last:pb-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...BIDENS_TAX_PLAN_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
