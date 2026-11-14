import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IMPERMANENT_LOSS_FAQS } from './content';

export function ImpermanentLossGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-il" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Impermanent Loss?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Impermanent loss is the difference between holding tokens in a liquidity pool versus holding
        the same starting allocation outside the pool when prices change. This tool models a
        constant-weight AMM without fees or rewards.
      </p>

      <h2 id="il-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>rA = Future A / Initial A, rB = Future B / Initial B</p>
        <p className="mt-2">HODL = Deposit × (wA × rA + wB × rB)</p>
        <p className="mt-2">Pool = Deposit × rA^wA × rB^wB</p>
        <p className="mt-2">IL% = (Pool / HODL − 1) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>50/50 pool, deposit PKR 10,000</p>
        <p>Token A doubles; Token B unchanged</p>
        <p className="mt-2">HODL value = PKR 15,000</p>
        <p>Pool value ≈ PKR 14,142.14</p>
        <p>Impermanent loss ≈ −5.72%</p>
        <p>Net loss vs. holding ≈ PKR 857.86</p>
      </div>

      <h2 id="il-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...IMPERMANENT_LOSS_FAQS]} />
      </div>
    </article>
  );
}
