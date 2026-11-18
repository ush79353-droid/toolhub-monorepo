import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_LOAN_EMI_FAQS } from './content';

export function HomeLoanEmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-home-loan-emi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Home Loan EMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An equated monthly installment (EMI) is the fixed monthly payment that pays down both
        principal and interest over a home loan term. Enter principal, term, and annual rate to
        estimate EMI, total payable, and total interest.
      </p>

      <h2
        id="home-loan-emi-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EMI Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>n = term in months</p>
        <p>r = annual rate / 12 / 100</p>
        <p>EMI = P × r × (1+r)^n / ((1+r)^n − 1) when r &gt; 0</p>
        <p>EMI = P / n when r = 0</p>
        <p>Total payable = EMI × n</p>
        <p>Total interest = Total payable − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Principal (P) = PKR 1,000,000</p>
        <p>Term = 240 months (20 years)</p>
        <p>Annual rate = 8%</p>
        <p>r = 0.08 / 12</p>
        <p>EMI ≈ PKR 8,364.39</p>
        <p>Total payable ≈ PKR 2,007,453.60</p>
        <p>Total interest ≈ PKR 1,007,453.60</p>
      </div>

      <h2
        id="home-loan-emi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_LOAN_EMI_FAQS]} />
      </div>
    </article>
  );
}
