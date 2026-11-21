import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAPITAL_GAINS_TAX_UK_FAQS } from './content';

export function CapitalGainsTaxUkGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Capital Gains Tax UK Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate UK Capital Gains Tax on chargeable gains using HMRC&apos;s basic-rate
        band method. Choose a supported tax year, enter gains and asset details,
        and provide taxable income so unused basic-rate room can be applied.
        Currency is fixed GBP (£); there is no FX conversion.
      </p>

      <h2
        id="how-cgt-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How UK CGT Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deduct the annual exempt amount from gains to find chargeable gains. For
        individuals, any unused basic-rate Income Tax band is filled at the basic
        CGT rate; the remainder is taxed at the higher CGT rate. Trustees of most
        settlements pay a flat trustee rate after a reduced annual exempt amount.
      </p>

      <h2
        id="rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rates and Allowances
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>2026/27:</strong> AEA £3,000 (trustees £1,500); basic band
          £37,700; individuals 18%/24%; trustees 24% (GOV.UK from 6 April 2026).
        </li>
        <li>
          <strong>2025/26:</strong> Same AEA and 18%/24% individual rates for
          standard assets including residential property; trustees 24%.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Official references: GOV.UK Capital Gains Tax rates and the HMRC rates and
        allowances guidance.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select tax year 2026/27 or 2025/26.</li>
        <li>Enter capital gains in pounds and choose asset type.</li>
        <li>Say whether the assets are held in a trust.</li>
        <li>
          Enter taxable annual income and any other taxable income (after Personal
          Allowance).
        </li>
        <li>Read the Capital gains tax estimate and optional step-by-step summary.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GOV.UK example (2026/27): taxable income £20,000 · gains £12,600 → AEA
        £3,000 leaves £9,600 chargeable · all within the £37,700 basic band → CGT{' '}
        <strong>£1,728</strong> at 18%.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool does not model allowable losses, Private Residence Relief,
        Business Asset Disposal Relief, Investors&apos; Relief, carried interest,
        foreign income and gains regime interactions, or multi-settlement trust AEA
        splits. Educational estimate only.
      </p>

      <h2
        id="uk-cgt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CAPITAL_GAINS_TAX_UK_FAQS]} />
      </div>
    </article>
  );
}
