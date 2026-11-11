import * as React from 'react';
import {
  BookOpen,
  CheckCircle,
  Compass,
  HelpCircle,
  Info,
  Percent,
  Scale,
  ShieldCheck,
  Calculator as CalculatorIcon,
} from 'lucide-react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  AUTO_LOAN_FAQS,
  AUTO_LOAN_GUIDE_SECTIONS,
  AUTO_LOAN_TERM_COMPARISON,
  AUTO_LOAN_WORKED_EXAMPLE,
} from './content';

function SectionIcon({ id }: { id: string }) {
  if (id === 'auto-loan-payment-formula') {
    return <CalculatorIcon className="h-4 w-4" aria-hidden="true" />;
  }
  if (id === 'how-to-use-this-calculator') {
    return <Compass className="h-4 w-4" aria-hidden="true" />;
  }
  if (id === 'interest-rates-and-loan-terms') {
    return <Percent className="h-4 w-4" aria-hidden="true" />;
  }
  if (id === 'trade-in-value-and-equity' || id === 'sales-tax-and-additional-fees') {
    return <Scale className="h-4 w-4" aria-hidden="true" />;
  }
  if (id === 'tips-for-comparing-auto-loans') {
    return <ShieldCheck className="h-4 w-4" aria-hidden="true" />;
  }
  if (id === 'what-is-an-auto-loan') {
    return <Info className="h-4 w-4" aria-hidden="true" />;
  }
  return <BookOpen className="h-4 w-4" aria-hidden="true" />;
}

export function AutoLoanGuideArticle() {
  return (
    <div className="space-y-6">
      {AUTO_LOAN_GUIDE_SECTIONS.map((section) => (
        <article
          key={section.id}
          id={section.id}
          className="scroll-mt-24 rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-7"
        >
          <div className="mb-3.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <SectionIcon id={section.id} />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
              {section.title}
            </h2>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex}>{paragraph}</p>
            ))}
          </div>

          {section.formula && (
            <div className="mt-4 rounded-xl border border-border bg-brand-softTeal px-4 py-3">
              <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
                {section.formula}
              </p>
              {section.formulaNote && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {section.formulaNote}
                </p>
              )}
            </div>
          )}

          {section.orderedSteps && (
            <ol className="mt-4 space-y-3 border-t border-border pt-4">
              {section.orderedSteps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                    {stepIndex + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {section.bullets && (
            <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
              {section.bullets.map((bullet, bIndex) => (
                <li key={bIndex} className="flex items-start gap-2.5">
                  <CheckCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {section.hasTermComparisonTable && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[460px] text-left text-xs sm:text-sm">
                <thead className="border-b border-border bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5">
                      Loan Term
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right">
                      Monthly Payment
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right">
                      Total Interest
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right">
                      Total Loan Payments
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-foreground">
                  {AUTO_LOAN_TERM_COMPARISON.map((row) => (
                    <tr key={row.months} className="hover:bg-muted/35">
                      <td className="px-4 py-2.5 font-semibold text-accent">
                        {row.months} months ({row.yearsLabel})
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                        {row.monthlyPayment}
                      </td>
                      <td className="px-4 py-2.5 text-right text-primary tabular-nums">
                        {row.totalInterest}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{row.totalPayments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.hasWorkedExample && (
            <div className="mt-4 space-y-4">
              <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                {AUTO_LOAN_WORKED_EXAMPLE.scenarioSummary}
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Example Inputs
                  </h3>
                  <dl className="mt-2.5 divide-y divide-border text-xs">
                    {AUTO_LOAN_WORKED_EXAMPLE.inputs.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-2 py-1.5">
                        <dt className="text-muted-foreground">{item.label}</dt>
                        <dd className="text-right font-semibold text-foreground tabular-nums">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-xl border border-border bg-brand-softTeal/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Calculated Output
                  </h3>
                  <dl className="mt-2.5 divide-y divide-border text-xs">
                    {AUTO_LOAN_WORKED_EXAMPLE.outputs.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-2 py-1.5">
                        <dt className="text-muted-foreground">{item.label}</dt>
                        <dd
                          className={`text-right font-bold tabular-nums ${
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

              <div className="rounded-xl border border-border bg-white p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                  Step-by-Step Math
                </h3>
                <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-muted-foreground">
                  {AUTO_LOAN_WORKED_EXAMPLE.steps.map((step) => (
                    <li key={step.label}>
                      <strong className="text-accent">{step.label}:</strong> {step.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </article>
      ))}

      {/* 11. Frequently Asked Questions */}
      <section
        id="frequently-asked-questions"
        className="scroll-mt-24 rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-7"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
            Frequently Asked Questions
          </h2>
        </div>
        <FAQAccordion items={[...AUTO_LOAN_FAQS]} />
      </section>
    </div>
  );
}

