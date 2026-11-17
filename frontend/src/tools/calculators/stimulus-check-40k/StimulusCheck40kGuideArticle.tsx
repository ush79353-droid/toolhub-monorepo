import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEROES_ACT_BILL_URL, STIMULUS_40K_FAQS } from './content';

export function StimulusCheck40kGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-context" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In May 2020 the U.S. House passed the Health and Economic Recovery Omnibus Emergency
              Solutions (HEROES) Act, which included a proposed second round of direct payments
              structured like an expanded CARES Act check. Later that summer, Senate Majority Leader
              Mitch McConnell publicly suggested that a Republican package would focus on households
              making about $40,000 a year or less.
            </p>
            <p>
              No enacted statute ever combined the HEROES Act payment schedule with a hard $40,000
              income cap. This page preserves that 2020 discussion as a historical estimate only.
            </p>
          </div>
        </article>

        <article id="how-this-estimate-works" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How This Estimate Works
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>Enter filing status, dependents, and AGI in USD. The estimate:</p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                Applies a <strong>$40,000</strong> AGI cut-off for single and head-of-household
                filers, or <strong>$80,000</strong> for married filers.
              </li>
              <li>
                Pays the full HEROES-structure amount when AGI is at or below that cut-off, and{' '}
                <strong>$0</strong> when AGI is above it.
              </li>
              <li>
                Does not invent a gradual phase-out for the $40k idea — contemporaneous commentary
                noted that McConnell had not specified replacement phase-out rules.
              </li>
            </ul>
          </div>
        </article>

        <article id="payment-assumptions" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Payment Assumptions
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Dollar amounts follow the House-passed HEROES Act payment structure summarized by the
              Congressional Research Service:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>$1,200 for an eligible single or head-of-household filer</li>
              <li>$2,400 for most married joint filers</li>
              <li>$1,200 for each of up to three dependents</li>
            </ul>
            <p>
              Read the bill record on Congress.gov:{' '}
              <a
                href={HEROES_ACT_BILL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                H.R. 6800 — HEROES Act
              </a>
              .
            </p>
          </div>
        </article>

        <article id="what-this-is-not" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What This Is Not
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              This is not tax advice, an IRS tool, or a claim portal. It does not model later enacted
              rounds (for example the December 2020 $600 payments or the American Rescue Plan $1,400
              payments). Fixed USD denomination only — no foreign-exchange conversion.
            </p>
          </div>
        </article>

        <section id="stimulus-40k-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion faqs={[...STIMULUS_40K_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
