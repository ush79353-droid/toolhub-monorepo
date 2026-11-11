import * as React from 'react';
import { CheckCircle } from 'lucide-react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  LOAN_FAQS,
  LOAN_FREQUENCY_COMPARISON,
  LOAN_GUIDE_SECTIONS,
  LOAN_TERM_COMPARISON,
  LOAN_WORKED_EXAMPLE,
} from './content';

export function LoanGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {LOAN_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>

            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>

            {section.formula && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
                {section.formulaNote && (
                  <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                    {section.formulaNote}
                  </p>
                )}
              </div>
            )}

            {section.orderedSteps && (
              <ol className="mt-5 space-y-3.5 pl-0.5">
                {section.orderedSteps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="flex items-start gap-3 text-[15px] font-normal leading-[1.7] text-foreground/85 sm:text-base sm:leading-[1.75]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary">
                      {stepIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {section.bullets && (
              <ul className="mt-5 space-y-2.5 pl-0.5 text-[15px] font-normal leading-[1.7] text-foreground/85 sm:text-base sm:leading-[1.75]">
                {section.bullets.map((bullet, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-2.5">
                    <CheckCircle
                      className="mt-1.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.hasTermComparisonTable && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Loan Term
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Monthly Payment
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Total Interest
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Total Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white font-normal text-foreground">
                    {LOAN_TERM_COMPARISON.map((row) => (
                      <tr key={row.yearsLabel} className="hover:bg-muted/35">
                        <td className="px-4 py-3 font-medium text-accent">{row.yearsLabel}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {row.regularPayment}
                        </td>
                        <td className="px-4 py-3 text-right text-primary tabular-nums">
                          {row.totalInterest}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.totalPaid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.hasFrequencyComparisonTable && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[500px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Frequency
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Scheduled Count
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Regular Payment
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Total Interest
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Total Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white font-normal text-foreground">
                    {LOAN_FREQUENCY_COMPARISON.map((row) => (
                      <tr key={row.frequency} className="hover:bg-muted/35">
                        <td className="px-4 py-3 font-medium text-accent">{row.frequency}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.paymentsCount}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {row.periodicPayment}
                        </td>
                        <td className="px-4 py-3 text-right text-primary tabular-nums">
                          {row.totalInterest}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.totalPaid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.hasWorkedExample && (
              <div className="mt-5 space-y-5">
                <p className="rounded-xl border border-border bg-background/70 p-4 text-[15px] font-normal leading-[1.7] text-foreground">
                  {LOAN_WORKED_EXAMPLE.scenarioSummary}
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <h3 className="text-[17px] font-semibold text-accent">Example Inputs</h3>
                    <dl className="mt-3 divide-y divide-border text-xs sm:text-[13px]">
                      {LOAN_WORKED_EXAMPLE.inputs.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-2 py-2"
                        >
                          <dt className="font-normal text-muted-foreground">{item.label}</dt>
                          <dd className="text-right font-medium text-foreground tabular-nums">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="rounded-xl border border-border bg-brand-softTeal/50 p-4">
                    <h3 className="text-[17px] font-semibold text-accent">Calculated Output</h3>
                    <dl className="mt-3 divide-y divide-border text-xs sm:text-[13px]">
                      {LOAN_WORKED_EXAMPLE.outputs.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-2 py-2"
                        >
                          <dt className="font-normal text-muted-foreground">{item.label}</dt>
                          <dd
                            className={`text-right font-semibold tabular-nums ${
                              item.highlight ? 'text-primary' : 'text-accent'
                            }`}
                          >
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <h3 className="text-[17px] font-semibold text-accent">Step-by-Step Math</h3>
                  <ul className="mt-3 space-y-2.5 text-sm font-normal leading-[1.7] text-foreground/85">
                    {LOAN_WORKED_EXAMPLE.steps.map((step) => (
                      <li key={step.label}>
                        <span className="font-medium text-accent">{step.label}:</span>{' '}
                        {step.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </article>
        ))}

        {/* Frequently Asked Questions */}
        <section id="frequently-asked-questions" className="scroll-mt-24 pt-7">
          <h2 className="mb-5 text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={[...LOAN_FAQS]} />
        </section>
      </div>
    </div>
  );
}

