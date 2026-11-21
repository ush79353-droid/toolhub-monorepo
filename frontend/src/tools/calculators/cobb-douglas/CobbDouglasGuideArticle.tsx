import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COBB_DOUGLAS_FAQS } from './content';

export function CobbDouglasGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Cobb-Douglas Production Function?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Cobb-Douglas production function is a standard economics model that
        links total output to labor, capital, and a productivity factor. It is
        widely used in microeconomics and macroeconomics for teaching, planning
        illustrations, and empirical work. It is a simplification — not a complete
        description of every real production process.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cobb-Douglas Production Function Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Y = A × L^α × K^β</p>
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Y — total production (output units)</li>
        <li>A — total factor productivity</li>
        <li>L — labor input</li>
        <li>K — capital input</li>
        <li>α — output elasticity of labor</li>
        <li>β — output elasticity of capital</li>
      </ul>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Production Using the Cobb-Douglas Function
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>A=2 · L=100 · K=50 · α=0.6 · β=0.4</p>
        <p>100^0.6 ≈ 15.8489 · 50^0.4 ≈ 4.7818</p>
        <p>Y = 2 × 15.8489 × 4.7818 ≈ 151.57</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Units follow the model&apos;s calibrated A — physical or index units, not
        currency by default.
      </p>

      <h2
        id="characteristics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cobb-Douglas Production Function Characteristics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With positive A, L, K, α, and β, output rises in each input. The function
        is homogeneous of degree α+β. When 0&lt;α&lt;1, labor shows diminishing
        marginal returns — distinct from decreasing returns to scale (α+β&lt;1).
        Labor and capital are substitutes; the standard two-input form has
        elasticity of substitution equal to 1.
      </p>

      <h2
        id="tfp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Total Factor Productivity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A scales how effectively labor and capital become output. Technology,
        management, and organization often enter through A: higher A means more Y
        for the same L and K.
      </p>

      <h2
        id="elasticities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor and Capital Elasticity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If α = 0.6, a 1% rise in labor (capital fixed) raises output by about
        0.6%. If β = 0.4, a 1% rise in capital raises output by about 0.4%. Values
        above 1 are allowed here with a warning as nonstandard cases.
      </p>

      <h2
        id="returns-to-scale"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Returns to Scale
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Constant: α + β ≈ 1</li>
        <li>Increasing: α + β &gt; 1</li>
        <li>Decreasing: α + β &lt; 1</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classification uses a small floating-point tolerance around 1.
      </p>

      <h2
        id="mpl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Product of Labor
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MPL = α A L^(α−1) K^β = α Y / L (L &gt; 0)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Firms compare MPL with wage costs when deciding whether extra labor is
        worthwhile under competitive approximations.
      </p>

      <h2
        id="mpk"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Product of Capital
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MPK = β A L^α K^(β−1) = β Y / K (K &gt; 0)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MPK informs capital budgeting when the rental cost of capital is compared
        with incremental output.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cobb-Douglas Production Function Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A small manufacturer measures L as production-worker hours and K as
        machine-hour capacity. With A = 2, L = 100, K = 50, α = 0.6, β = 0.4,
        estimated output is about 151.57 units — illustrating how both workforce
        and machinery contribute under constant returns (α+β = 1).
      </p>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Applications in Economics and Business
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Uses include production planning, labor and capital allocation,
        productivity analysis, growth models, manufacturing and agriculture
        illustrations, and classroom research on elasticities and returns to scale.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions of the Cobb-Douglas Model
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Stable functional form over the modeled period</li>
        <li>Consistent input and output measurement</li>
        <li>Constant output elasticities in the standard form</li>
        <li>Simplified two-input technology</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Cobb-Douglas Function
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calibration can be hard; data quality, omitted factors, technological
        change, industry differences, and endogeneity can undermine causal reading
        of estimated parameters.
      </p>

      <h2
        id="vs-others"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cobb-Douglas vs. Other Production Functions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leontief uses fixed proportions; CES generalizes substitution elasticity;
        linear forms assume perfect substitutes. Cobb-Douglas is the CES case with
        elasticity of substitution equal to one.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total factor productivity A (default 1).</li>
        <li>Enter labor L.</li>
        <li>Enter labor elasticity α.</li>
        <li>Enter capital K.</li>
        <li>Enter capital elasticity β.</li>
        <li>Read total production Y.</li>
        <li>Review returns to scale and optional MPL/MPK/APL/APK.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/economic-profit-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Economic Profit Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/marginal-revenue-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Marginal Revenue Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/marginal-cost-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Marginal Cost Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/productivity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Productivity Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="cobb-douglas-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COBB_DOUGLAS_FAQS]} />
      </div>
    </article>
  );
}
