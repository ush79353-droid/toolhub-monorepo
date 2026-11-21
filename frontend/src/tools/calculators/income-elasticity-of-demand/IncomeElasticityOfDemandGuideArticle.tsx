import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INCOME_ELASTICITY_OF_DEMAND_FAQS } from './content';

export function IncomeElasticityOfDemandGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-yed"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Income Elasticity of Demand?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income elasticity of demand (YED) measures how the quantity demanded of
        a good or service responds to a change in consumer income. Positive YED
        is consistent with a normal good; negative YED with an inferior good.
        Businesses and economists use YED for forecasting, assortment planning,
 and research; always with matching observation periods for income and
        quantity.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Income Elasticity of Demand Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        YED = %ΔQd / %ΔY
      </div>

      <h2
        id="standard"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Standard Income Elasticity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        %ΔY = (Y₂ − Y₁) / Y₁ × 100
        <br />
        %ΔQd = (Q₂ − Q₁) / Q₁ × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period 1 is the baseline. Both Y₁ and Q₁ must be nonzero (positive under
        the household-income model).
      </p>

      <h2
        id="midpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Midpoint Income Elasticity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        %ΔY = (Y₂ − Y₁) / ((Y₁ + Y₂) / 2) × 100
        <br />
        %ΔQd = (Q₂ − Q₁) / ((Q₁ + Q₂) / 2) × 100
      </div>

      <h2
        id="standard-vs-midpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Standard vs. Midpoint Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The same observations can produce different numerical YED values under
        Standard vs Midpoint because the percentage-change denominators differ.
        Midpoint results are symmetric if you reverse both periods; Standard
        results generally are not.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Income Elasticity of Demand
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose Standard or Midpoint.</li>
        <li>Enter income in periods 1 and 2; compute %ΔY.</li>
        <li>Enter quantity demanded in periods 1 and 2; compute %ΔQd.</li>
        <li>Divide %ΔQd by %ΔY (do not use absolute values).</li>
        <li>Interpret sign and magnitude with industry context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Income Elasticity Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income 1,000 → 1,200; quantity 100 → 130. Standard: %ΔY = +20%, %ΔQd =
        +30%, YED = <strong>1.50</strong>. Midpoint: %ΔY ≈ 18.18%, %ΔQd ≈
        26.09%, YED ≈ <strong>1.43</strong>.
      </p>

      <h2
        id="normal-goods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Normal Goods and Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Normal goods have positive YED. They may be income-inelastic (0 &lt; YED
        &lt; 1) or income-elastic (YED &gt; 1).
      </p>

      <h2
        id="inferior-goods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inferior Goods and Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inferior goods have negative YED under the measured conditions. The label
        describes income response, not product quality.
      </p>

      <h2
        id="necessity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Necessity Goods and Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Necessity-type goods often show 0 &lt; YED &lt; 1; demand rises with
        income but less than proportionally.
      </p>

      <h2
        id="luxury"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Luxury Goods and Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Luxury-type (income-elastic) goods often show YED &gt; 1. Price or brand
        prestige alone does not determine the classification.
      </p>

      <h2
        id="zero-yed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does Zero Income Elasticity Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When income changes but quantity does not, YED = 0. When income does not
 change, YED is undefined; never display Infinity.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Income Elasticity
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>YED &lt; 0: inferior good</li>
        <li>YED = 0: no measured quantity response</li>
        <li>0 &lt; YED &lt; 1: necessity-type normal good</li>
        <li>YED = 1: unit income elasticity</li>
        <li>YED &gt; 1: income-elastic normal good</li>
      </ul>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Applications of Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Demand forecasting, market segmentation, inventory and product strategy,
        economic research, and policy analysis when incomes change. Real-world
        data may move other demand factors at the same time.
      </p>

      <h2
        id="vs-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Income Elasticity vs. Price Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price elasticity of demand relates quantity to own-price changes. YED
        relates quantity to income. Do not use the formulas interchangeably.
      </p>

      <h2
        id="vs-cross"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Income Elasticity vs. Cross-Price Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-price elasticity relates demand for one product to the price of
        another. YED uses income, not another good’s price.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Product nature, income level, preferences, alternatives, economic
        conditions, household characteristics, and time horizon can all shift
        measured YED. Elasticity can change over time and across markets.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing YED with price or cross-price elasticity</li>
        <li>Mixing Standard and Midpoint percentages</li>
        <li>Using absolute values and losing the sign</li>
        <li>Dividing by a zero income change</li>
        <li>Rounding intermediate percentages before dividing</li>
        <li>Displaying YED as a percent</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Income Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Other demand drivers may change simultaneously; two-point calculations do
        not map an entire demand function; small income changes can produce
        unstable coefficients; and observational data may not establish
        causation.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
 Educational illustration only; not professional economic, investment, or
        business advice.
      </p>

      <h2
        id="yed-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...INCOME_ELASTICITY_OF_DEMAND_FAQS]} />
      </div>
    </article>
  );
}
