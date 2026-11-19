import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COLLEGE_COST_FAQS } from './content';

export function CollegeCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-much-college-cost"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How much does college cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        College expenses rise over time and include more than tuition — fees, housing, meals, books,
        transportation, and personal costs all add up. Families use planners like this calculator to
        project future sticker costs, decide how much to cover with savings, and see whether today’s
        balance is on track. Figures are estimates, often anchored to U.S. reference averages; actual
        prices vary widely by school. Pair this tool with each college’s net price calculator for a
        sharper picture of what you may pay after aid.
      </p>

      <h2
        id="net-price-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        College-specific net price calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many institutions publish net price tools that estimate the cost after grants and
        scholarships using household and student information. Results differ by college because aid
        policies, tuition, and living expenses differ. Use those calculators for school-specific
        packaging; use this College Cost Calculator for multi-year inflation and savings planning.
      </p>

      <h2
        id="higher-education-us"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Higher education in the U.S.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        U.S. higher education includes two-year community colleges and four-year colleges and
        universities, public and private. Public schools often charge lower in-state tuition than
        out-of-state rates. A degree can expand career options, but financing choices — cash,
        savings plans, aid, and loans — shape long-term household budgets. Plan early and revisit
        assumptions as applications and award letters arrive.
      </p>

      <h2
        id="cost-components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much does college cost? Key components
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Tuition and fees</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tuition pays for instruction; fees may cover technology, activities, or facilities. Private
        sticker prices are often higher than public in-state rates, while out-of-state public tuition
        can approach private levels.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Room and board</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On-campus housing and meal plans are major living costs. Off-campus rent and groceries can
        be higher or lower depending on the city and lifestyle.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Textbooks and school supplies</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Books, equipment, software, and course materials add to annual budgets, along with
        transportation and personal expenses that are easy to underestimate.
      </p>

      <h2 id="financial-aid" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Financial aid
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aid helps close the gap between sticker price and what a family can pay. Common categories:
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong className="font-medium text-accent">Loans</strong> — generally repaid with
          interest; may be federal, state, institutional, or private; subsidized vs unsubsidized
          terms differ.
        </li>
        <li>
          <strong className="font-medium text-accent">Grants</strong> — typically need- or
          merit-based awards that do not require repayment when conditions are met.
        </li>
        <li>
          <strong className="font-medium text-accent">Scholarships</strong> — awards for academics,
          athletics, arts, need, or other criteria.
        </li>
        <li>
          <strong className="font-medium text-accent">Work-study</strong> — campus employment that
          helps eligible students earn toward expenses.
        </li>
      </ul>

      <h2
        id="calculating-financial-aid"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculating financial aid
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aid offices compare cost of attendance with a measure of family ability to pay. Historical
        materials often referred to an Expected Family Contribution (EFC); current U.S. federal aid
        uses updated Student Aid Index terminology under Federal Student Aid rules. Packages are
        personalized and this calculator does not determine eligibility — it only helps you plan the
        savings share of projected costs.
      </p>

      <h2 id="529-savings" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        The 529 savings plan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 529 plan is a U.S. education savings vehicle, often state-sponsored, that can offer tax
        advantages on qualified withdrawals when rules are met. Starting early and contributing
        consistently can help investments grow, but market-linked accounts carry risk. Withdrawal and
        tax rules matter — confirm details with the plan and a tax professional. For this calculator,
        enter 0% tax on investment return when modeling eligible tax-advantaged growth.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Qualified expenses</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depending on applicable rules, qualified expenses may include tuition and fees, books and
        required materials, room and board for eligible students, computers and internet access, and
        certain special-needs equipment. Eligibility depends on current law and plan terms.
      </p>

      <h2 id="529-prepaid" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        529 prepaid plan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prepaid tuition plans generally let families purchase tuition credits or contract for future
        tuition at participating institutions, sometimes locking in today’s eligible rates via
        lump-sum or installment payments. Portability and coverage of fees or room and board vary.
        Availability and terms change by state — verify current offerings rather than assuming a
        plan remains open forever. Prepaid structures differ from investment-based 529 savings
        plans.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/student-loan-calculator" className="text-primary hover:underline">
            Student Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/loan-calculator" className="text-primary hover:underline">
            Loan Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="college-cost-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COLLEGE_COST_FAQS]} />
      </div>
    </article>
  );
}
