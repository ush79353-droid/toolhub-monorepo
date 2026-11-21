import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GST_FAQS } from './content';

export function GstGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-gst"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a GST Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a <strong>generic GST rate tool</strong>: it converts between a
        GST-exclusive net price and a GST-inclusive gross price for any GST
        percentage you enter. It does not look up country rates or apply
        exemptions, and it is distinct from Canada GST/QST (or other
        jurisdiction-specific) calculators in the catalog.
      </p>

      <h2
        id="gst-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross Price = Net Price × (1 + GST / 100)</p>
        <p>Tax Amount = Gross Price − Net Price</p>
        <p>Net Price = Gross Price / (1 + GST / 100)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>GST = 10%</p>
        <p>Net price = 100 → Tax = 10 · Gross = 110</p>
        <p>Gross price = 110 → Net = 100 · Tax = 10</p>
      </div>

      <h2
        id="gst-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GST_FAQS]} />
      </div>
    </article>
  );
}
