import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_CARBS_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function NetCarbsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Net Carbs Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the grams printed on a nutrition label to estimate digestible “net”
        carbohydrates for a serving, per 100 g, or a whole meal. “Net carbs” is
        an educational convention — not an FDA-regulated term.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Meal total net carbs = net carbs × servings consumed.
        Calories from net carbs ≈ total net carbs × 4 kcal/g.
      </p>

      <h2
        id="labels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        US/Canada vs elsewhere
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US and Canadian Total Carbohydrate includes dietary fiber, so fiber is
        subtracted. In many other regions the carbohydrate figure already
        excludes fiber — this tool does not subtract fiber again, avoiding
        double subtraction when you answer “No” to USA/Canada.
      </p>

      <h2
        id="polyols"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sugar alcohols
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When the product’s sugar alcohols are only erythritol, xylitol,
        mannitol, or lactitol, the full gram amount is deducted. Other or mixed
        polyols use a half deduction so partially absorbed sugar alcohols are
        not treated as fully non-digestible.
      </p>

      <div id="net-carbs-faq" className="not-prose mt-8">
        <FAQAccordion items={NET_CARBS_FAQS} />
      </div>
    </article>
  );
}
