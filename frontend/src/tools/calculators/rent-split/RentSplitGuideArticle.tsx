import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RENT_SPLIT_FAQS } from './content';

export function RentSplitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rent-split"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Rent Split?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A rent split divides one total rent among the people who live in each bedroom.
        This calculator assumes every person pays the same share, then groups those shares
        by bedroom so housemates can see what each room owes.
      </p>

      <h2
        id="rent-split-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total People = Σ people in each bedroom</p>
        <p>Per-Person Rent = Total Rent ÷ Total People</p>
        <p>Bedroom Share = (People in Bedroom ÷ Total People) × Total Rent</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total rent = PKR 30,000 · Bedroom 1 = 1 person · Bedroom 2 = 2 people</p>
        <p>Total people = 3</p>
        <p>Per-person rent = 30,000 ÷ 3 = 10,000</p>
        <p>Bedroom 1 share = (1 ÷ 3) × 30,000 = PKR 10,000.00</p>
        <p>Bedroom 2 share = (2 ÷ 3) × 30,000 = PKR 20,000.00</p>
      </div>

      <h2
        id="rent-split-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RENT_SPLIT_FAQS]} />
      </div>
    </article>
  );
}
