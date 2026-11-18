import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_FAQS } from './content';

const CONGRESS_TEXT =
  'https://www.congress.gov/bill/116th-congress/house-bill/9051/text';
const CRS_FAQ =
  'https://www.congress.gov/crs_external_products/IN/PDF/IN11575/IN11575.3.pdf';
const OMNI_CASH = 'https://www.omnicalculator.com/finance/cash-act-2020';

export function CashActGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In late December 2020, Congress enacted a second round of Economic Impact Payments at
              $600 per eligible adult ($1,200 for most married couples) plus $600 per qualifying
              child under 17. After the President publicly called for $2,000 checks, the House
              passed the <strong>CASH Act of 2020</strong> (H.R.9051 — Caring for Americans with
              Supplemental Help Act) on December 28, 2020 to amend those amounts upward.
            </p>
            <p>
              The Senate did not pass that amendment, so the $2,000 CASH Act design never became
              law. This page reconstructs the <em>proposed</em> CASH Act rules for historical
              education only and does not imply that anyone can claim those amounts today.
            </p>
          </div>
        </article>

        <article id="verified-payment-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Verified Payment Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The enacted bill text of H.R.9051 amends IRC §6428A (as added by the COVID-related Tax
              Relief Act of 2020) by striking “$600” and inserting “$2,000”, and by striking
              “$1,200” and inserting “$4,000”. It also expands the dependent definition from
              qualifying children under 17 to dependents under IRC §152. Contemporaneous summaries
              describe the resulting proposal as:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$2,000</strong> base for single and head-of-household filers;{' '}
                <strong>$4,000</strong> for married couples filing jointly.
              </li>
              <li>
                <strong>$2,000</strong> for each dependent of any age (not limited to children under
                17).
              </li>
              <li>
                Full payment for AGI up to <strong>$75,000</strong> (single),{' '}
                <strong>$112,500</strong> (head of household), or <strong>$150,000</strong> (joint).
              </li>
              <li>
                Reduction of <strong>5%</strong> of AGI above those thresholds, floored at $0.
              </li>
            </ul>
            <p>
              Primary references include the{' '}
              <a
                href={CONGRESS_TEXT}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                H.R.9051 bill text
              </a>
              , CRS FAQs on the enacted{' '}
              <a
                href={CRS_FAQ}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                $600 second-round payments
              </a>
              , and contemporaneous calculator summaries such as{' '}
              <a
                href={OMNI_CASH}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Omnicalculator’s CASH Act page
              </a>
              .
            </p>
          </div>
        </article>

        <article id="additional-vs-enacted" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Additional vs Enacted $600
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The main result is the proposed CASH Act total. The “How much more will you get?”
              section estimates the <em>additional</em> amount relative to the enacted $600 EIP:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                Enacted base: <strong>$600</strong> (single / head of household) or{' '}
                <strong>$1,200</strong> (married), plus <strong>$600</strong> per qualifying child
                under 17.
              </li>
              <li>Same AGI phase-out thresholds and 5% rate.</li>
              <li>
                Additional = max(0, CASH Act total − enacted estimate). Dependents under 17 cannot
                exceed total dependents.
              </li>
            </ul>
            <p>
              Example: a married couple with two under-17 dependents and AGI at or below $150,000
              would show an $8,000 CASH Act total versus a $2,400 enacted estimate — $5,600 more.
            </p>
          </div>
        </article>

        <article id="phaseout-and-dependents" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Phase-Out & Dependents
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Because the CASH Act raised the base and dependent amounts while keeping the 5%
              phase-out rate, benefits phase out at higher AGI levels than the enacted $600
              payment. Adult dependents and older children who were excluded from the enacted
              under-17 amount would have counted fully under the CASH Act proposal.
            </p>
            <p>
              This calculator does not model every eligibility nuance (nonresident alien status,
              deceased taxpayers, single-SSN married couples, or automatic SSA/SSI/VA non-filer
              paths). Selecting “No” for 2019 filing shows $0 with an eligibility note.
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
                Results are historical and hypothetical. The CASH Act was never enacted; there is no
                claim process.
              </li>
              <li>
                Amounts are fixed USD estimates. This tool does not convert currencies or apply
                later American Rescue Plan (third stimulus) rules.
              </li>
              <li>
                Figures are educational reconstructions, not tax, legal, or benefits advice.
              </li>
            </ul>
          </div>
        </article>

        <article id="cash-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-3.5">
            <FAQAccordion items={CASH_FAQS} />
          </div>
        </article>
      </div>
    </div>
  );
}
