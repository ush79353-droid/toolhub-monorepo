import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VAT_FAQS } from './content';

export function VatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="vat-definition" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is VAT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Value Added Tax (VAT) is a multi-stage consumption tax applied to most goods and services.
        Each business in the supply chain charges VAT on its taxable sales (output VAT) and may
        reclaim VAT paid on eligible purchases (input VAT). End consumers generally bear the tax as
        part of the final price. Exact registration thresholds, exemptions, and filing rules are set
        by each tax authority.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Input VAT is the tax a business pays on purchases. Output VAT is the tax it charges on
        sales. The net amount payable or reclaimable is typically output VAT minus recoverable
        input VAT for the period, subject to local law.
      </p>

      <h2
        id="vat-gst-sales-tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the difference between VAT, GST, and sales tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VAT and GST are usually collected at multiple stages with credit for tax paid earlier in the
        chain. Traditional retail sales tax is often charged only at the final sale to the consumer.
        Terminology and administration vary widely — a system called “sales tax” in one place may
        behave differently from a GST/VAT system elsewhere.
      </p>

      <h2 id="vat-vs-gst" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is the difference between VAT and GST?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both are broadly designed as value-added consumption taxes. Differences show up in rate
        schedules, exempt categories, place-of-supply rules, digital services treatment, and
        compliance calendars. Do not assume a VAT percentage from one country applies under another
        country’s GST (or vice versa).
      </p>

      <h2 id="margin-and-vat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Margin and VAT procedure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VAT sits on top of (or inside) a selling price; it is not the same as margin or markup.
        Margin is usually profit relative to selling price; markup is profit relative to cost. VAT
        collected from customers is generally a liability to the tax authority, not business
        revenue. Special margin schemes may apply to certain goods — those schemes are jurisdiction
        specific and outside this calculator’s arithmetic.
      </p>

      <h2
        id="how-to-calculate-vat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do I calculate VAT?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Add VAT: VAT = Net × (Rate / 100); Gross = Net + VAT</p>
        <p>Remove VAT: Net = Gross / (1 + Rate / 100); VAT = Gross − Net</p>
        <p>Example add: 100 at 20% → VAT 20 → Gross 120</p>
        <p>Example remove: 120 at 20% → Net 100 → VAT 20</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool rounds money once for display using the selected currency’s fraction digits
        (usually two). Internally it computes with full IEEE floating values then rounds at the
        money boundary (half-up via standard rounding). Reverse VAT always divides by{' '}
        <code>(1 + rate/100)</code>.
      </p>

      <h2 id="vat-refunds" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        When can VAT be refunded?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Businesses often recover input VAT on eligible purchases when registered. Travelers,
        diplomats, or exporters may qualify for refunds or zero-rating under separate programs.
        Eligibility, documentation, and timelines depend entirely on local regulations — this
        calculator does not determine refund rights.
      </p>

      <h2 id="vat-by-country" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Value Added Tax in different countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Countries set their own standard and reduced rates, exemptions, and zero-rated categories.
        Rates change over time and can depend on the product, service, and place of supply. The
        default 20% in this calculator is only an example — never treat it as a live country table.
      </p>

      <h2
        id="tax-system-comparison"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparison of tax systems
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consumption taxes differ from income or payroll taxes: they target spending rather than
        earnings. Within consumption taxes, multi-stage credit-invoice systems (VAT/GST) differ from
        single-stage retail taxes. This page is educational arithmetic, not personalized tax advice.
      </p>

      <h2 id="history-of-vat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        History of VAT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Modern VAT systems expanded through the mid-to-late twentieth century as governments sought
        broad, self-enforcing consumption taxes with invoice credits between businesses. Adoption
        spread across Europe and many other regions under local names and designs. Historical
        adoption stories do not replace current statutory rates.
      </p>

      <h2 id="vat-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...VAT_FAQS]} />
      </div>
    </article>
  );
}
