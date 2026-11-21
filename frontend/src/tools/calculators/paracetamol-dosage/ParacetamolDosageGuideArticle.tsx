import Link from 'next/link';
import { PARACETAMOL_DOSAGE_FAQS } from './content';

export function ParacetamolDosageGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What This Calculator Does
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enter a child’s age and weight to see educational maximum single and
          daily paracetamol (acetaminophen) amounts in milligrams, plus spacing
          notes (max 4 doses / 24 hours; ≥ 4 hours apart). It does not measure
          liquid mL for a specific bottle strength.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">mg/kg Formula</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Single dose ≈ 15 mg/kg (cap 1,000 mg)</li>
          <li>Daily maximum ≈ 60 mg/kg (cap 4,000 mg)</li>
          <li>Example: 21 kg → 315 mg single · 1,260 mg/day</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          These coefficients match common teaching calculators and sit inside the
          widely cited 10–15 mg/kg pediatric oral range. Local protocols and
          labeled products may differ.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Enter age (years or months) and weight (kg or lb).</li>
          <li>Read maximum single and daily mg ceilings.</li>
          <li>
            For US OTC label forms, open the{' '}
            <Link
              href="/tools/infant-tylenol-dosage-calculator"
              className="text-primary underline-offset-2 hover:underline"
            >
              Infant Tylenol Dosage Calculator
            </Link>
            .
          </li>
          <li>Share copies only the page URL — never your child’s data.</li>
        </ol>
      </section>

      <section id="limits" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Age Gates and Caps
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Under 3 months: no automatic dose — ask a clinician. Ages over 17:
          use adult labeling. Heavy teens may hit the adult 1,000 mg / 4,000 mg
          caps before the raw mg/kg figures.
        </p>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Not a prescription. Does not check liver disease, interacting
          medicines, or other acetaminophen products. Never combine
          paracetamol-containing medicines. Prefer the measuring device supplied
          with liquid medicines.
        </p>
      </section>

      <section id="faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FAQ</h2>
        <dl className="space-y-4">
          {PARACETAMOL_DOSAGE_FAQS.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-semibold text-accent">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
