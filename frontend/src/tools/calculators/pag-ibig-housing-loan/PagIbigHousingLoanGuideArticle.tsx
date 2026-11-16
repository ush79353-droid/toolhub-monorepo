import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAG_IBIG_FAQS } from './content';

export function PagIbigHousingLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-pag-ibig"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Pag-IBIG Housing Loan?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pag-IBIG Fund (Home Development Mutual Fund) housing loans are Philippines-specific
        mortgage products. This tool sketches monthly principal and interest from a loan amount
        and the reference fixed-pricing example. It does not invent official loanable limits,
        insurance premiums, or eligibility rules.
      </p>

      <h2
        id="pag-ibig-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Computes
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = APR / 100 / 12</p>
        <p className="mt-2">n = repayment years × 12</p>
        <p className="mt-2">M = P × r / (1 − (1 + r)^(−n))</p>
        <p className="mt-2">When r = 0: M = P / n</p>
        <p className="mt-2">
          Total monthly amortization = M + insurance — only when insurance is verified
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = ₱1,000,000 · Repayment = 30 years · Fixed pricing = 30 years (9.750%)</p>
        <p>n = 360 · r = 0.0975 / 12</p>
        <p>Monthly principal and interest ≈ ₱8,591.74</p>
        <p>Insurance and total amortization remain unavailable without official premium rules.</p>
      </div>

      <h2
        id="pag-ibig-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PAG_IBIG_FAQS]} />
      </div>
    </article>
  );
}
