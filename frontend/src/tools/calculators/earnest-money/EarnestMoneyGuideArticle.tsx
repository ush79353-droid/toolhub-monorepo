import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EARNEST_MONEY_FAQS } from './content';

export function EarnestMoneyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-earnest-money"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Earnest Money? Earnest Money Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnest money is a deposit a buyer offers to show serious intent to
        purchase a property. It is usually held according to the purchase
        agreement and local transaction procedures. Deposit size and handling
        vary by market. Earnest money is not an extra purchase charge on top of
        the price — it is typically applied toward the buyer&apos;s closing funds
        when the sale completes.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Earnest Money Calculator Works
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine the property price.</li>
        <li>Choose an earnest money percentage.</li>
        <li>Convert the percentage to a decimal (divide by 100).</li>
        <li>Multiply property price by that decimal.</li>
        <li>Review the earnest money deposit.</li>
      </ol>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Property price = $1,000,000</p>
        <p>Earnest money percentage = 5%</p>
        <p>Earnest money = 1,000,000 × 0.05 = $50,000</p>
      </div>

      <h2
        id="toward-down-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Earnest Money Go Toward the Down Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When a transaction closes, earnest money is commonly credited toward the
        buyer&apos;s funds due at closing. That credit may reduce remaining down
        payment or other cash-to-close items, depending on the settlement
        documents.
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Property price = $400,000 · Required down payment = $80,000</p>
        <p>Earnest money deposited = $10,000</p>
        <p>Remaining down payment illustration = 80,000 − 10,000 = $70,000</p>
      </div>

      <h2
        id="vs-down-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Earnest Money vs. Down Payment
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Earnest money</strong> — usually paid early; shows commitment;
          held per contract; governed by contingencies and deadlines
        </li>
        <li>
          <strong>Down payment</strong> — buyer&apos;s contribution toward the
          purchase price; typically settled at closing; affects loan size
        </li>
      </ul>

      <h2
        id="how-much-is-typical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Earnest Money Is Typical?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts vary with local market practices, property price, buyer
        competition, financing, seller requirements, and regional rules.
        Illustrative percentages in examples are for math only — they are not
        universal requirements.
      </p>

      <h2
        id="is-refundable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Earnest Money Refundable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Refundability depends on contract terms and applicable law. Contingencies
        may protect the buyer within deadlines. Some cancellations can lead to
        deposit forfeiture. Earnest money is not always refundable.
      </p>

      <h2
        id="when-paid"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is Earnest Money Paid?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnest money is commonly paid after an offer is accepted or within the
        timeframe specified in the purchase agreement. Actual timing varies by
        market and contract.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Earnest Money Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose what to calculate (deposit, percentage, or property price).</li>
        <li>Enter the property purchase price when required.</li>
        <li>Choose the display currency.</li>
        <li>Enter the earnest money percentage or deposit as needed.</li>
        <li>Review the calculated field and Results card.</li>
        <li>Adjust inputs to compare deposit scenarios.</li>
        <li>Reset the calculator to start a new estimate.</li>
      </ol>

      <h2
        id="earnest-money-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Earnest Money Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Earnest Money = Property Price × (Percentage / 100)</p>
        <p>Percentage = (Earnest Money / Property Price) × 100</p>
        <p>Property Price = Earnest Money / (Percentage / 100)</p>
      </div>

      <h2
        id="important-considerations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Important Considerations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator provides a mathematical estimate. It does not determine
        whether a deposit is legally required, whether it is refundable, the
        payment deadline, who may hold escrow, or contract enforcement rights.
        Review the purchase agreement and seek qualified local guidance when
        needed.
      </p>

      <h2
        id="earnest-money-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EARNEST_MONEY_FAQS]} />
      </div>
    </article>
  );
}
