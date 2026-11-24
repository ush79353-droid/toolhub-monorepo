import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SODIUM_IN_SALT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SodiumInSaltGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sodium in Salt Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how much sodium is in a measured spoon or gram of kitchen salt,
        or work backward from a sodium target to culinary salt and pure NaCl.
        Results are educational conversions — not a personalized intake plan.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Volume entries use each salt’s sodium milligrams per level
        teaspoon; mass entries use that type’s grams per teaspoon. Pure NaCl
        grams = sodium mg ÷ (1000 × 22.99/58.44).
      </p>

      <h2
        id="salt-types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Salt types & density
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fine iodized table salt packs the most sodium per teaspoon (~2,300 mg).
        Coarse kosher and coarse sea salt are fluffier, so the same spoon holds
        less sodium. Potassium salt substitutes contribute 0 mg sodium here
        (they supply potassium instead). Brand crystal size still varies — weigh
        when precision matters.
      </p>

      <div id="sodium-in-salt-faq" className="not-prose mt-8">
        <FAQAccordion items={SODIUM_IN_SALT_FAQS} />
      </div>
    </article>
  );
}
