import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  HEROES_ACT_BILL_URL,
  HEROES_ADDITIONAL_PAYMENTS_URL,
  HEROES_CRS_COMPARISON_URL,
  HEROES_FAQS,
  UNEMPLOYMENT_HEALS_VS_HEROES_URL,
} from './content';

export function HeroesGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In May 2020, the House of Representatives passed the{' '}
              <strong>Health and Economic Recovery Omnibus Emergency Solutions Act</strong>{' '}
              (HEROES Act, H.R. 6800). Among many COVID-19 relief titles was a proposed second
              round of individual “additional recovery rebates” — often called a second stimulus
              check.
            </p>
            <p>
              That House-passed package was a negotiating position, not enacted law. The Senate did
              not adopt H.R. 6800 as written, and later COVID relief used different payment
              designs. This page reconstructs the <em>proposed</em> HEROES rebate rules for
              historical education only and does not imply that anyone can claim those amounts
              today.
            </p>
          </div>
        </article>

        <article id="verified-payment-rules" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Verified Payment Rules
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Congressional Research Service comparisons of 2020 second-round proposals summarize
              the HEROES Act direct payment as:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>$1,200</strong> base for single and head-of-household filers;{' '}
                <strong>$2,400</strong> for married couples filing jointly.
              </li>
              <li>
                <strong>$1,200</strong> for each dependent (qualifying children and relatives under
                IRC §152), <strong>capped at three</strong> dependents — so a married couple with
                three or more dependents could receive up to <strong>$6,000</strong> before
                phase-out.
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
                href={HEROES_ACT_BILL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                H.R. 6800 bill page
              </a>{' '}
              and the CRS{' '}
              <a
                href={HEROES_CRS_COMPARISON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                second-round proposal comparison (IN11513)
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
              under 17, HEROES proposed <strong>$1,200 per dependent of any age</strong> under the
              dependent exemption definition, with a hard household cap of three dependents.
            </p>
            <p>
              Phase-out applies to the total rebate (base plus counted dependents). Entering more
              than three dependents does not increase the estimate beyond the three-dependent
              maximum.
            </p>
          </div>
        </article>

        <article id="additional-provisions" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Additional Provisions
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Beyond the one-time check, contemporaneous reporting on the HEROES Act described
              separate unemployment-insurance extensions, essential-worker hazard-pay funding, and
              student-loan relief ideas. Those are{' '}
              <strong>not</strong> included in the rebate estimate above. See a{' '}
              <a
                href={HEROES_ADDITIONAL_PAYMENTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                contemporaneous HEROES Act overview
              </a>{' '}
              and the{' '}
              <a
                href={UNEMPLOYMENT_HEALS_VS_HEROES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                HEALS vs HEROES unemployment reference
              </a>{' '}
              for historical context only.
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
                Fixed <strong>USD</strong> only — no currency conversion of thresholds, dependents,
                or payments.
              </li>
              <li>
                This tool models only the proposed recovery rebate. Hazard pay, unemployment
                supplements, and student-loan provisions are outside the calculator.
              </li>
              <li>
                Distinct from enacted CARES Act payments and later Economic Impact Payments under
                other laws.
              </li>
            </ul>
          </div>
        </article>

        <article id="heroes-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={HEROES_FAQS} />
          </div>
        </article>
      </div>
    </div>
  );
}
