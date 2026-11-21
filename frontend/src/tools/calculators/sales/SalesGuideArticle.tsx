import Link from 'next/link';

export function SalesGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-is-sales" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is This Calculator?</h2>
        <p>
          The Sales Calculator turns a product price and units sold into gross revenue, then
          subtracts verified sales deductions (returns, allowances, and discounts) to estimate
 net sales for a chosen period. It is a top-line sales worksheet; not a tax, payroll,
          or full P&amp;L model.
        </p>
        <p>
          For price × quantity without deductions, see the{' '}
          <Link
            href="/tools/revenue-calculator"
            className="font-medium text-primary hover:underline"
          >
            Revenue Calculator
          </Link>
          . For ROS after operating profit, see the{' '}
          <Link
            href="/tools/return-on-sales-calculator"
            className="font-medium text-primary hover:underline"
          >
            Return on Sales Calculator
          </Link>
          .
        </p>
      </section>

      <section id="sales-formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Gross sales = product price × quantity sold (for the quantity period).</li>
          <li>Monthly revenue = gross converted to a monthly equivalent.</li>
          <li>Annual revenue = monthly revenue × 12 (via period conversion).</li>
          <li>
            Net sales = gross sales − sales returns − sales allowances − sales discounts.
          </li>
        </ul>
      </section>

      <section id="sales-deductions" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Sales Deductions</h2>
        <p>
          Returns, allowances, and discounts are contra-revenue items. They reduce reported sales
 but are not operating expenses or cost of goods sold. Leave them blank when unused; 
          blanks count as zero.
        </p>
      </section>

      <section id="sales-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Frequently Asked Questions</h2>
        <p>See the FAQ accordion below for period conversion and FX details.</p>
      </section>
    </div>
  );
}
