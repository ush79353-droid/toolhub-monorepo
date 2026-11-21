import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CHILD_TAX_CREDIT_FAQS } from './content';

export function ChildTaxCreditGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ctc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Child Tax Credit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Child Tax Credit (CTC) is a U.S. federal income tax credit for qualifying children under
        age 17. For tax year 2025 the maximum credit is $2,200 per qualifying child. Higher-income
        households may see a phaseout. This calculator estimates the credit after the income
        phaseout using filing status, AGI, and up to two children&apos;s ages.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select your filing status (Single, Joint, or Head of household).</li>
        <li>Enter annual AGI in USD.</li>
        <li>
          Enter finished years of age for up to two dependent children listed on your federal
          return.
        </li>
        <li>
          Read the estimated CTC after phaseout, eligible child count, and income-related reduction.
          Refundable ACTC is not computed from these inputs alone.
        </li>
      </ol>

      <h2
        id="ctc-rules-2025"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Year 2025 Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Max credit = $2,200 × qualifying children under age 17</p>
        <p>Phaseout start = $200,000 (single / HoH) or $400,000 (joint)</p>
        <p>Reduction = $50 × ceil(max(0, AGI − threshold) / 1,000)</p>
        <p>Estimated CTC = max(0, Max credit − Reduction)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: IRS Child Tax Credit overview; 2025 Schedule 8812 (Form 1040); Rev. Proc. 2024-40
        (ACTC refundable amount inflation). Money amounts round to the nearest dollar for display.
      </p>

      <h2
        id="eligibility-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Eligibility Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age eligibility uses finished years 0–16. Other Schedule 8812 tests (relationship, residency,
        support, SSN, U.S. status, dependency) are assumed met when an age is entered. The
        refundable Additional Child Tax Credit is not estimated because earned income and tax
        liability are not collected.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Single · AGI $180,000 · children ages 5 and 10 → 2 eligible · max $4,400 · no phaseout →
        estimated CTC <strong>$4,400</strong>. Single · AGI $210,000 · same children → excess
        $10,000 → 10 × $50 = $500 reduction → estimated CTC <strong>$3,900</strong>.
      </p>

      <h2
        id="ctc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CHILD_TAX_CREDIT_FAQS]} />
      </div>
    </article>
  );
}
