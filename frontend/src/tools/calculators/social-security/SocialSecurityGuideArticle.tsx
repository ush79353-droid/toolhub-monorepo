import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOCIAL_SECURITY_FAQS } from './content';

export function SocialSecurityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Social Security Claiming Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool compares U.S. Social Security retirement claiming ages from 62
        to 70. It applies Social Security Administration (SSA) full retirement
        age, early-claim reduction, and delayed-retirement-credit factors to
        your estimated benefit at full retirement age, then ranks ages using
        COLA-adjusted benefits and optional investment growth through your life
        expectancy. It is an educational estimate—not an SSA award letter or
        financial advice. Official estimators remain on{' '}
        <a
          href="https://www.ssa.gov"
          className="font-medium text-primary underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          the U.S. Social Security website
        </a>
        .
      </p>

      <h2
        id="ssa-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        SSA FRA, Early Reduction, and Delayed Credits
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Benefit = PIA × multiplier(claim age, birth year)</p>
        <p>
          Early (first 36 mo): −(5/9)% per month; then −(5/12)% per month
        </p>
        <p>Delay (born 1943+): +(2/3)% per month after FRA through age 70</p>
        <p>FRA: SSA year-of-birth table (66 → 67 for 1960+)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: birth year 1960 (FRA 67), PIA $1,000. Claim at 62 → 70% of PIA
        ($700). Claim at 70 → 124% of PIA ($1,240). Official monthly benefit
        awards use SSA rounding rules; this model keeps estimate precision for
        comparison.
      </p>

      <h2
        id="how-modeled"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Ideal Age Is Modeled
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For each whole claim age 62–70 that is before life expectancy, monthly
        checks begin on that birthday, receive your assumed COLA each claim
        anniversary, and are deposited into a portfolio that compounds at your
        assumed annual return using a monthly effective rate of (1+r)
        <sup>1/12</sup> − 1. The age with the largest portfolio at life
        expectancy is labeled ideal. A nominal break-even versus claiming at 62
        is shown when the ideal age is later.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your birth year and planning life expectancy.</li>
        <li>Set an expected investment return and assumed COLA.</li>
        <li>
          Enter your estimated monthly benefit at full retirement age from SSA
          (replace the illustrative average if shown).
        </li>
        <li>
          Click Calculate to see the ideal age, starting benefit, cumulative and
          invested totals, and the optional ages 62–70 table.
        </li>
        <li>Use Clear or Reload when you want a fresh start.</li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Ignores federal/state income tax on benefits, IRMAA, and Medicare
          premiums.
        </li>
        <li>
          Omits spousal, survivor, divorced-spouse, and disability claiming
          strategies.
        </li>
        <li>
          Does not model the retirement earnings test or deemed filing rules.
        </li>
        <li>
          Birth month is unknown; FRA months follow the SSA year-of-birth table
          and claim ages are whole birthdays.
        </li>
        <li>
          Assumed COLA and investment returns are yours to set—not SSA
          forecasts.
        </li>
      </ul>

      <h2
        id="ss-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...SOCIAL_SECURITY_FAQS]} />
      </div>
    </article>
  );
}
