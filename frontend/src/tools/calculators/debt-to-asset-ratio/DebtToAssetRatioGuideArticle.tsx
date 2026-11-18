import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_TO_ASSET_RATIO_FAQS } from './content';

export function DebtToAssetRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-to-asset-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Debt to Asset Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt to assets ratio shows what share of a firm’s assets is financed by debt. Higher
        ratios mean more leverage; lower ratios mean a larger equity cushion. It is a simple
        balance-sheet snapshot, not a full credit analysis.
      </p>

      <h2
        id="debt-to-asset-ratio-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Debt = Long-term Debt + Short-term Debt</p>
        <p className="mt-2">
          Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100
        </p>
        <p className="mt-2">
          Debts normalize into the total-assets currency before dividing. The ratio percentage is
          never FX-converted.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Long-term debt = 100,000 · Short-term debt = 50,000 · Total assets = 300,000</p>
        <p>Total debt = 100,000 + 50,000 = 150,000</p>
        <p>Debt to assets ratio = (150,000 / 300,000) × 100 = 50%</p>
      </div>

      <h2
        id="debt-to-asset-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_TO_ASSET_RATIO_FAQS]} />
      </div>
    </article>
  );
}
