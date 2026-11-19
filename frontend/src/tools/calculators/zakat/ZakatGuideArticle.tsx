import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GOLD_NISAB_GRAMS, GOLD_REFERENCE_SOURCE, METAL_REFERENCE_AS_OF, SILVER_NISAB_GRAMS, SILVER_REFERENCE_SOURCE } from './types';
import { ZAKAT_FAQS } from './content';

export function ZakatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-zakat" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is zakat?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zakat is one of the five pillars of Islam. For a Muslim who meets the conditions, it is an obligation to give a set portion of qualifying wealth to eligible recipients. It is not a voluntary donation. On money, trade goods, and gold and silver that qualify, the rate used here is 2.5%. Whether it is due also depends on Nisab and on the lunar year (Hawl). This calculator estimates the amount. A scholar or your own madhhab decides the ruling.
      </p>

      <h2 id="what-is-nisab" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is nisab?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nisab is the minimum wealth at which Zakat can become due. The gold measure is {GOLD_NISAB_GRAMS} grams, often described as 7.5 tola. The silver measure is {SILVER_NISAB_GRAMS} grams, often described as 52.5 tola. Multiply that weight by a price per gram. Silver’s money threshold is usually lower, so more people meet it. Scholars differ on which benchmark to use. You can also type a custom threshold. The reference metal prices in this tool are dated {METAL_REFERENCE_AS_OF} and are not a live quote.{' '}
        <a className="font-medium text-primary underline-offset-2 hover:underline" href={GOLD_REFERENCE_SOURCE}>
          Gold reference
        </a>
        {' · '}
        <a className="font-medium text-primary underline-offset-2 hover:underline" href={SILVER_REFERENCE_SOURCE}>
          Silver reference
        </a>
        .
      </p>

      <h2 id="how-much-zakat-to-pay" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Zakat calculator – how much zakat to pay
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose gold, silver, or a custom Nisab. Enter cash, savings, loans you expect to be repaid, trade cash, and investments in the selected currency. Gold and silver use weight, purity, and the price per gram. Add stocks, trade inventory, and any other amount you have already judged eligible. Subtract only immediate liabilities you intend to deduct, not every future installment of a long loan. If net wealth meets Nisab, the estimate is 2.5% of that net. Different assets can follow different rules. Enter each asset once.
      </p>

      <h2 id="assets-subject-to-zakat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Assets subject to zakat
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash in hand, bank balances, savings, loans you expect back, gold, silver, business inventory, trade goods, and investments you treat as Zakatable are the fields on this page. A primary home, ordinary clothes, and household items kept for personal use are not given fields, and they are not added for you.
      </p>
      <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        Asset eligibility can vary depending on the type of wealth, its intended use, and the applicable scholarly interpretation.
      </div>

      <h2 id="how-to-calculate-zakat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to calculate zakat: Calculating it the right way
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>List the assets your method treats as Zakatable.</li>
        <li>Value them in one currency. Metal value is weight × purity × price per gram.</li>
        <li>List immediate liabilities you are deducting.</li>
        <li>Net Zakatable wealth = total assets − those liabilities. The result is never below zero.</li>
        <li>Compare that net with the selected Nisab.</li>
        <li>Check whether this wealth has completed one lunar year.</li>
        <li>If Nisab is met, Zakat payable = net wealth × 0.025. If it is not met, the estimate is zero.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The 2.5% figure is shown even when you mark Hawl as incomplete, so you can see the amount separately from the due date. An incomplete lunar year means you should not treat the figure as payable yet.
      </p>

      <h2 id="zakat-calculation-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Zakat calculation example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These numbers are illustrative. Cash in the bank 200,000, cash in hand 50,000, gold 100,000, silver 20,000, eligible investments 80,000, and trade inventory 50,000 add to 500,000. Eligible liabilities of 100,000 leave net wealth of 400,000. If the selected Nisab is 150,000, the wealth meets it. Zakat is 400,000 × 0.025 = 10,000 in the same currency.
      </p>

      <h2 id="zakat-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        FAQs
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={ZAKAT_FAQS} />
      </div>
    </article>
  );
}
