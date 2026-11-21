import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TIME_AND_A_HALF_FAQS } from './content';

export function TimeAndAHalfGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-time-and-a-half-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Time and a Half Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A time and a half calculator estimates pay when some hours are paid at
 premium multipliers of your standard hourly rate; commonly 1.5×
        (time-and-a-half), 2× (double time), and 3× (triple time). You enter hours
        for each category yourself; the tool does not decide overtime eligibility.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your standard hourly pay rate and choose its currency.</li>
        <li>
          Read the derived time-and-a-half, double-time, and triple-time rates.
        </li>
        <li>Enter hours worked in each category (blank hours count as zero).</li>
        <li>Review category earnings and the total amount of money earned.</li>
      </ol>

      <h2
        id="overtime-pay-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Overtime Pay Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Time-and-Half Rate = Standard × 1.5</p>
        <p>Double-Time Rate = Standard × 2</p>
        <p>Triple-Time Rate = Standard × 3</p>
        <p>Standard Pay = Standard Rate × Standard Hours</p>
        <p>Time-and-Half Pay = Time-and-Half Rate × Those Hours</p>
        <p>Double-Time Pay = Double-Time Rate × Those Hours</p>
        <p>Triple-Time Pay = Triple-Time Rate × Those Hours</p>
        <p>Total = Sum of Category Pays</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Standard rate = 1,000 PKR</p>
        <p>Standard hours = 40 → pay 40,000</p>
        <p>Time-and-a-half hours = 5 → rate 1,500 → pay 7,500</p>
        <p>Double-time hours = 2 → rate 2,000 → pay 4,000</p>
        <p>Triple-time hours = 0 → pay 0</p>
        <p>Total = 51,500 PKR</p>
      </div>

      <h2
        id="time-and-a-half-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TIME_AND_A_HALF_FAQS]} />
      </div>
    </article>
  );
}
