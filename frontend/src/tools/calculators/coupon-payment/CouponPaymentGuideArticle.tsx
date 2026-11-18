import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COUPON_PAYMENT_FAQS } from './content';

export function CouponPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-coupon-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Coupon Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A coupon payment is the periodic interest a bond pays to holders. From face value, the
        annual coupon rate, and how many times per year coupons are paid, this calculator reports
        each payment amount. An optional current-yield section compares the annual coupon with the
        bond&apos;s market price.
      </p>

      <h2
        id="coupon-payment-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Coupon Payment Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Coupon = Face Value × Annual Coupon Rate / 100</p>
        <p className="mt-2">Coupon Payment = Annual Coupon / Payments Per Annum</p>
        <p className="mt-2">Current Yield (%) = Annual Coupon / Market Price × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Face value = 1,000 PKR · Annual coupon rate = 5% · Payments per annum = 2</p>
        <p>Annual coupon = 1,000 × 0.05 = 50 PKR</p>
        <p>Coupon payment = 50 / 2 = 25 PKR</p>
        <p>Market price = 980 PKR → Current yield = 50 / 980 × 100 ≈ 5.102%</p>
      </div>

      <h2
        id="coupon-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COUPON_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
