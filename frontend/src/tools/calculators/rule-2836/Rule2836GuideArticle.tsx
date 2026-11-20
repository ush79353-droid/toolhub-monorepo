import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RULE_2836_FAQS } from './content';

export function Rule2836GuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-2836"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the 28/36 Rule?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The 28/36 rule is a long-standing mortgage affordability guideline. It
        suggests that monthly housing costs generally stay at or below 28% of
        gross monthly income, and that total monthly debt obligations —
        including housing — generally stay at or below 36% of that same income.
        Lenders may use similar ideas when reviewing debt-to-income (DTI), but
        the rule itself is a planning benchmark, not a universal approval
        requirement.
      </p>

      <h2
        id="front-end-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Front-End Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The front-end ratio isolates housing. Divide monthly housing expenses by
        gross monthly income and multiply by 100. A result at or under 28% is
        within the traditional housing guideline. Property taxes, insurance, and
        required association fees usually belong in this housing total when you
        estimate a full payment.
      </p>

      <h2
        id="back-end-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Back-End Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The back-end ratio looks at the broader debt picture. Add other monthly
        debt payments to housing costs, divide by gross monthly income, and
        multiply by 100. Staying at or under 36% matches the classic total-debt
        guideline. A strong front-end ratio does not offset a back-end ratio that
        exceeds 36% when you are applying both parts of the rule.
      </p>

      <h2
        id="housing-expenses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Counts as Housing Expenses?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Housing expenses typically include mortgage principal and interest,
        property taxes, homeowners insurance, and required homeowners association
        or condominium fees. Some analyses also include mortgage insurance or
        other recurring housing charges. This calculator lets you enter one
        combined housing amount or itemize those components so totals are not
        double-counted.
      </p>

      <h2
        id="other-debt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Counts as Other Monthly Debt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Other debts are recurring monthly obligations that are not already in
        the housing total — for example auto loans, student loans, personal
        loans, and minimum credit card payments. Do not add the housing payment
        a second time. Everyday living costs such as groceries and utilities are
        usually outside classic DTI, though they still matter for your real
        budget.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        28/36 Rule Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Front-end ratio = (Housing costs / Gross monthly income) × 100</p>
        <p>
          Back-end ratio = ((Housing costs + Other debts) / Gross monthly
          income) × 100
        </p>
        <p>Maximum housing (28%) = Income × 0.28</p>
        <p>Maximum total debt (36%) = Income × 0.36</p>
        <p>
          Housing capacity = max(0, min(0.28 × I, 0.36 × I − other debts))
        </p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the 28/36 Rule
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter gross monthly household income (before taxes).</li>
        <li>
          Enter combined housing costs, or switch to itemized expenses and sum
          mortgage, taxes, insurance, HOA, and other housing.
        </li>
        <li>Enter other monthly debt payments (excluding housing).</li>
        <li>Read the front-end and back-end ratios and compare to 28% and 36%.</li>
        <li>
          Optionally review maximum housing, maximum total debt, and housing
          capacity under both guidelines.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        28/36 Rule Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose gross monthly income is $5,000, housing costs are $1,200, and
        other monthly debts are $400.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Front-end = 1,200 / 5,000 × 100 = 24.00%</p>
        <p>Total debt = 1,200 + 400 = 1,600</p>
        <p>Back-end = 1,600 / 5,000 × 100 = 32.00%</p>
        <p>Max housing (28%) = 1,400 · Max total debt (36%) = 1,800</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both ratios fall within the traditional limits. That is a planning
        signal only — actual eligibility depends on the lender, loan program,
        credit, reserves, and documentation.
      </p>

      <h2
        id="housing-share"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much of My Income Should Go Toward Housing?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under the front-end guideline, about 28% of gross monthly income is the
        classic ceiling for housing. Households in high-cost areas may exceed
        that in practice, but stretching the housing share leaves less room for
        savings and unexpected costs. Pair the percentage with a cash-flow
        review of your actual take-home budget.
      </p>

      <h2
        id="total-debt-share"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Total Debt Is Acceptable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The back-end guideline points to about 36% of gross monthly income for
        housing plus other qualifying debts. For $6,000 monthly income, 36% is
        $2,160 of total monthly debt. Lower ratios usually leave more financial
        flexibility; higher ratios can still appear in some loan programs with
        compensating factors.
      </p>

      <h2
        id="house-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What House Price Can I Afford Under the 28/36 Rule?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The rule estimates a housing payment budget, not a purchase price by
        itself. Price depends on interest rate, term, down payment, taxes,
        insurance, and fees. Use the housing capacity from this tool as an upper
        payment target, then run a mortgage or home affordability calculator to
        translate that payment into a price range.
      </p>

      <h2
        id="mortgage-budget"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate a Mortgage Budget
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with gross income and other debts to find a housing capacity under
        both guidelines. Then layer rate, amortization term, down payment,
        property taxes, insurance, and any mortgage insurance or HOA. Stress-test
        the payment if rates rise or income dips. Keep cash for closing costs and
        reserves outside the ratio math.
      </p>

      <h2
        id="above-28"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens if My Front-End Ratio Is Above 28%?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A front-end ratio above 28% means housing alone is heavier than the
        traditional guideline. Some lenders focus more on overall DTI; others
        still scrutinize housing burden. Options include a lower price, larger
        down payment, longer term (with care), or reducing escrowed costs where
        realistic.
      </p>

      <h2
        id="above-36"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens if My Back-End Ratio Is Above 36%?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A back-end ratio above 36% signals that combined debts exceed the classic
        total-debt guideline. Paying down installment or revolving balances,
        avoiding new debt before applying, or reducing the housing target can
        help. If other debts already exceed 36% of income, no positive housing
        payment fits both guidelines until those debts fall.
      </p>

      <h2
        id="above-limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can I Get a Mortgage Above the 28/36 Limits?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Possibly. Automated underwriting and certain government or portfolio
        programs may allow higher DTI with strong credit, reserves, or residual
        income. Crossing 28/36 does not automatically mean denial, and staying
        under it does not guarantee approval. Always confirm with a lender for
        your situation.
      </p>

      <h2
        id="improve-dti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Your Debt-to-Income Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reduce or pay off revolving and installment balances.</li>
        <li>Avoid new car loans or large credit draws before applying.</li>
        <li>Increase documented qualifying income when eligible.</li>
        <li>Target a lower housing payment or larger down payment.</li>
        <li>Include only debts and income the lender will actually count.</li>
      </ul>

      <h2
        id="vs-dti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        28/36 Rule vs. Debt-to-Income Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Debt-to-income is the general concept of monthly debts divided by gross
        income. The 28/36 rule is a specific pair of traditional thresholds: one
        for housing-only DTI and one for total DTI. Many lenders emphasize a
        single back-end DTI; others still discuss both ratios.
      </p>

      <h2
        id="vs-affordability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        28/36 Rule vs. Mortgage Affordability Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator checks whether an entered payment and debt load fit the
        28% and 36% guidelines. A home or mortgage affordability calculator goes
        further — solving for loan size or price given rate, term, taxes, and
        insurance. Use both: ratios for guideline checks, affordability tools for
        price exploration.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the 28/36 Rule
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Regional housing costs, tax brackets, childcare, medical expenses, and
        savings goals are outside the ratios. Lender overlays differ. Gross
        income ignores take-home differences. The housing capacity figure is a
        payment budget estimate — never treat it as an approved loan amount or
        guaranteed purchase price.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Mistakes When Using the 28/36 Rule
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using net (take-home) income instead of gross.</li>
        <li>Mixing annual income with monthly housing or debt figures.</li>
        <li>Omitting taxes, insurance, or HOA from housing costs.</li>
        <li>Double-counting housing inside “other debts.”</li>
        <li>Treating guideline results as a firm mortgage approval.</li>
      </ul>

      <h2
        id="rule-2836-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={RULE_2836_FAQS} />
      </div>
    </article>
  );
}
