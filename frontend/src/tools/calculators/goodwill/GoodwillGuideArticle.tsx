import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GOODWILL_FAQS } from './content';

export function GoodwillGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-goodwill"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Goodwill Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Goodwill is an intangible asset that may arise when one business
        acquires another. Under a simplified 100% acquisition model, it is the
        excess of purchase consideration over the fair value of identifiable net
        assets — often reflecting synergies, assembled workforce benefits, or
        other unidentifiable economic advantages.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goodwill Calculation Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Goodwill = P − (A − L)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P = purchase price, A = fair value of identifiable assets, L = fair
        value of identifiable liabilities. Net identifiable assets = A − L.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Goodwill
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine acquisition consideration (purchase price).</li>
        <li>Identify acquired assets and measure fair values.</li>
        <li>Identify assumed liabilities and measure fair values.</li>
        <li>Compute net identifiable assets (A − L).</li>
        <li>Subtract net assets from purchase price.</li>
        <li>Positive residual → goodwill; zero → no residual.</li>
        <li>Negative residual → potential bargain purchase (reassess).</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Goodwill Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purchase price 1,000,000; assets 450,000; liabilities 400,000. Net
        assets = 50,000. Goodwill = 1,000,000 − 50,000 ={' '}
        <strong>950,000</strong>.
      </p>

      <h2
        id="negative-goodwill"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Negative Goodwill?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Older terminology sometimes called a negative residual “negative
        goodwill.” Modern acquisition accounting treats that indication as a
        potential bargain purchase after required reassessment — not as a
        negative asset labeled goodwill.
      </p>

      <h2
        id="vs-intangibles"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goodwill vs. Intangible Assets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Patents, trademarks, customer relationships, technology, and licenses
        may be separately identifiable intangibles. Goodwill is only the residual
        after those items (and other identifiable net assets) are recognized.
      </p>

      <h2
        id="vs-book-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goodwill vs. Book Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Book value uses historical carrying amounts. Acquisition goodwill uses
        fair values at the acquisition date. Do not substitute book value for
        fair value without stating that assumption.
      </p>

      <h2
        id="bargain-purchase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Bargain Purchase?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When consideration appears lower than measured identifiable net assets,
        frameworks generally require reassessing assets, liabilities,
        consideration, and recognition criteria before any bargain purchase gain
        is recognized. This calculator does not book income.
      </p>

      <h2
        id="why-pay-more"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Do Companies Pay More Than Net Asset Value?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Expected synergies and integration benefits</li>
        <li>Market position and growth opportunities</li>
        <li>Workforce expertise and operating capabilities</li>
        <li>Strategic combination value</li>
      </ul>

      <h2
        id="financial-statements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goodwill in Financial Statements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After qualifying acquisition accounting, recognized goodwill is typically
        presented as a noncurrent intangible asset on the consolidated balance
        sheet.
      </p>

      <h2
        id="impairment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Goodwill Impairment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Goodwill is generally not depreciated like PP&amp;E. It is subject to
        impairment testing under applicable rules. An impairment reduces the
        carrying amount and can reduce earnings. This calculator estimates an
        initial residual only — not future impairment.
      </p>

      <h2
        id="amortized"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Goodwill Amortized?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IFRS: not amortized; tested for impairment. US GAAP: generally
        impairment-based; certain private-company alternatives may permit
        amortization. Do not assume one treatment for every entity.
      </p>

      <h2
        id="sold-separately"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Goodwill Be Sold Separately?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Generally no. Goodwill is not separable like an individual asset and is
        typically transferred only as part of a business.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Goodwill Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using book value instead of fair value</li>
        <li>Including goodwill in identifiable assets</li>
        <li>Ignoring or double-counting assumed liabilities</li>
        <li>Skipping separately identifiable intangibles</li>
        <li>Treating a negative residual as recognized negative goodwill</li>
        <li>Mixing dates or currencies</li>
        <li>Applying the simplified formula to complex deals without adjustment</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Goodwill Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a simplified educational model. Fair values can be uncertain;
        complex acquisitions may need NCI, previously held interests, contingent
        consideration, and deferred tax. The result does not measure future
        profitability and does not replace a professional purchase price
        allocation.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Educational illustration only — not accounting, audit, valuation, or
        professional advice. Confirm measurements under the applicable framework.
      </p>

      <h2
        id="gw-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...GOODWILL_FAQS]} />
      </div>
    </article>
  );
}
