import { INFANT_TYLENOL_FAQS } from './content';

export function InfantTylenolDosageGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Infant Tylenol Dosage Calculator
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Look up educational US OTC acetaminophen (Tylenol®) pediatric label
          doses by child&apos;s weight and product type. Defaults are blank age,
          blank weight, and no medication selected. This tool does not replace
          the carton or clinical advice.
        </p>
      </section>

      <section id="products" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Supported Products
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Infant&apos;s Tylenol® suspension 160 mg/5 mL (label chart mainly
            24–35 lb → 5 mL; under 24 lb ask a doctor).
          </li>
          <li>
            Children&apos;s Tylenol® suspension 160 mg/5 mL (full pediatric
            weight chart through 72–95 lb).
          </li>
          <li>Chewable tablet 160 mg (including label 1½ / 2½ steps).</li>
          <li>
            Children&apos;s dissolve pack 160 mg (not for under 48 lb; whole
            packets only).
          </li>
        </ul>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Optionally enter age (years or months).</li>
          <li>Enter weight in kg or lb (preferred for dosing).</li>
          <li>Select one medication type.</li>
          <li>Read the label band, frequency, and acetaminophen warning.</li>
          <li>Share uses only the public page URL — never entered measurements.</li>
        </ol>
      </section>

      <section id="warnings" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Acetaminophen Warnings
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Do not combine with other acetaminophen-containing products. Do not
          exceed 5 doses in 24 hours for these pediatric charts. Use only the
          dosing device that came with the product. In overdose, contact Poison
          Control (US: 1-800-222-1222).
        </p>
      </section>

      <section id="infant-tylenol-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {INFANT_TYLENOL_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-sm font-semibold text-accent">
                {faq.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
