import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STUDENT_LOAN_FAQS } from './content';

export function StudentLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-student-loan"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Student Loan Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A student loan calculator estimates the fixed monthly principal-and-interest payment
        needed to amortize an outstanding balance over a remaining term at a nominal annual
        rate. It does not model income-driven repayment, forgiveness, deferment, or fees.
      </p>

      <h2
        id="student-loan-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Monthly Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>n = years × 12 + months</p>
        <p>r = APR / 100 / 12</p>
        <p>M = P × r × (1 + r)^n / ((1 + r)^n − 1)</p>
        <p>When r = 0: M = P / n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan balance = 100,000 PKR</p>
        <p>Remaining term = 10 years 0 months (120 monthly payments)</p>
        <p>Interest rate = 6%</p>
        <p>Monthly payment ≈ 1,110.21 PKR</p>
      </div>

      <h2
        id="student-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...STUDENT_LOAN_FAQS]} />
      </div>
    </article>
  );
}
