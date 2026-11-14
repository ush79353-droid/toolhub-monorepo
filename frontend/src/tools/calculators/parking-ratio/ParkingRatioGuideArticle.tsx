import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PARKING_RATIO_FAQS } from './content';

export function ParkingRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-parking-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Parking Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Parking ratio measures parking supply relative to rentable area—how many spaces are available
        per 1,000 square meters (or other selected area unit).
      </p>

      <h2
        id="parking-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Parking Ratio = (Parking Spots / Rentable Area) × 1000</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Rentable area = 5,000 m²</p>
        <p>Parking spots = 25</p>
        <p>Parking ratio = (25 / 5,000) × 1000 = 5 : 1000</p>
      </div>

      <h2
        id="parking-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PARKING_RATIO_FAQS]} />
      </div>
    </article>
  );
}
