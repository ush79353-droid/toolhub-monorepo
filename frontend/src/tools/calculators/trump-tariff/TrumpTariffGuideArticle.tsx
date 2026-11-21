import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TRUMP_TARIFF_FAQS } from './content';

export function TrumpTariffGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Trump Tariff Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how U.S. import tariffs affect the cost of products imported
        from different countries. Choose a product category or country of
        origin, enter a product customs value and applicable tariff rates, and
        calculate estimated import duties, tariff-inclusive value, and landed
        cost. This tool is educational: it runs user-defined (or illustrative
        preset) scenarios. It is not an official Customs and Border Protection
        (CBP), U.S. International Trade Commission (USITC), or Office of the
        United States Trade Representative (USTR) determination, and it does
        not replace a licensed customs broker or trade counsel.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Currency selection here is denomination only; amounts are treated as
        already denominated in the selected currency. For U.S. entry estimates,
        many users work in USD. Results never invent “official” country-wide
        rates; if you have not verified a rate against HTSUS and current
        measures, treat the output as a hypothetical scenario.
      </p>

      <h2
        id="what-are-trump-tariffs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Trump Tariffs?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Import tariffs are duties assessed on merchandise when it enters a
        customs territory. In everyday language, “Trump tariffs” often refers
 to trade actions associated with the Trump administrations; for
        example, Section 301 actions affecting certain goods from China, and
 Section 232 measures affecting certain steel and aluminum products; 
        alongside ordinary customs duties already listed in the Harmonized
        Tariff Schedule of the United States (HTSUS). The label is informal and
        imprecise: each action has its own legal authority, product coverage,
        country scope, effective dates, exclusions, and subsequent amendments.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Distinguish carefully among announced, proposed, effective, suspended,
        modified, and invalidated measures. A speech or campaign proposal is
        not the same as a legally effective duty. A rate that applied in a past
        year may have been narrowed, expanded, or replaced. Never assume that a
        historical headline rate still governs a current entry without checking
        operative notices and the HTSUS as of the relevant date.
      </p>

      <h2
        id="how-tariffs-work"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Tariffs Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Imported goods are declared to customs with a classification, origin,
        and valuation. The importer of record (or responsible party under the
        applicable rules) files entry documentation and is generally liable for
 duties, taxes, and fees that CBP assesses. Customs value; often based
 on transaction value with adjustments under U.S. law; is the usual base
        for ad valorem duties. Specific duties charge a fixed amount per unit;
        compound duties combine percentage and specific elements. After duties
        are determined, businesses may adjust wholesale and retail prices, but
        those price decisions are commercial outcomes, not automatic formulas.
      </p>

      <h2
        id="who-pays-tariffs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who Pays Import Tariffs?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Legally, U.S. import duties are typically paid to CBP by the importer of
        record. Economically, the burden can be distributed among overseas
        producers (via lower ex-factory prices), importers and retailers (via
        thinner margins), and consumers (via higher retail prices). Contracts,
        market power, and substitution possibilities shape that split. It is
        inaccurate to claim that a foreign government automatically pays U.S.
        tariffs simply because goods originate abroad.
      </p>

      <h2
        id="calculate-trump-tariffs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Trump Tariffs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator implements transparent, simplified ad valorem formulas.
        They are appropriate for educational scenarios when percentage duties
        apply to the same customs value and you have affirmed additive stacking.
        They are not a universal customs engine for tariff-rate quotas, specific
        duties, or non-stacking rules.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>V = P × Q</p>
        <p>T_base = V × (r_base / 100)</p>
        <p>T_add = V × (r_add / 100)</p>
        <p>r_combined = r_base + r_add (additive scenario only)</p>
        <p>T = T_base + T_add</p>
        <p>C = V + T</p>
        <p>L = C + S + I + O</p>
        <p>Cost increase % = (T / V) × 100 (when V &gt; 0)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Where V is total customs value, P unit customs value, Q quantity, r rates
        in percent, T total estimated duty, C tariff-inclusive customs value, S
        shipping, I insurance, O other fees, and L estimated landed cost.
      </p>
      <h3 className="mt-6 text-base font-semibold text-accent">
        Worked educational example (hypothetical rates)
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose a U.S. importer buys 10 units at an $800 customs value each,
        with a 5% base duty and a 20% additional duty assumed additive on the
        same base, plus $250 shipping and $50 insurance. These rates are
 hypothetical for teaching; not an official country or product rate.
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Total customs value: 800 × 10 = $8,000.</li>
        <li>Base duty: 8,000 × 0.05 = $400.</li>
        <li>Additional duty: 8,000 × 0.20 = $1,600.</li>
        <li>Total estimated duties: 400 + 1,600 = $2,000 (combined 25%).</li>
        <li>Tariff-inclusive value: 8,000 + 2,000 = $10,000.</li>
        <li>Estimated landed cost: 10,000 + 250 + 50 = $10,300 ($1,030/unit).</li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Trump Tariff Calculator
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Calculate tariffs by product
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select a product category and an illustrative preset (or Custom), choose
        country of origin, enter customs value and quantity, and set base and
        additional rates. Presets may suggest placeholder rates for
        exploration; always overwrite them with verified figures when you have
        them. Affirm additive stacking only when that assumption matches your
        scenario.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Calculate tariffs by country
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Country mode still requires product-level rates. Origin alone cannot
        determine a single official tariff for “everything from Country X.”
        Results remain labeled as a user-defined scenario unless you supply
        verified rates and document their source and effective date yourself.
      </p>

      <h2
        id="rates-by-product-country"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Tariff Rates by Product and Country
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duty rates vary with HTSUS classification, country of origin, preference
        programs, exclusions, and the date of entry. Two products from the same
        country can face entirely different ordinary and additional duties. A
        category label such as “electronics” or “apparel” is only a navigation
 aid in this calculator; it does not legally fix a rate.
      </p>

      <h2
        id="htsus"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an HTS Code?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Harmonized System provides an internationally recognized structure
        for classifying goods; the United States publishes the HTSUS with
        national subdivisions. Classification drives which ordinary rates and
        many additional measures apply. Misclassification can lead to incorrect
        duty payments and compliance risk. Optional HTSUS entry in this tool
 checks format only: a valid-looking code is not proof of the correct
        line. There is no live scraping or fabricated official lookup here;
        enter rates you have verified from USITC, CBP, USTR, or counsel.
      </p>

      <h2
        id="additional-tariffs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Additional Tariffs Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ordinary customs duties appear in the HTSUS columns for the
 classification. Additional trade measures; such as certain Section 301
 or Section 232 actions; may impose further duties on listed products
        from specified origins, subject to exclusions and later changes. Whether
        measures stack, how valuation interacts, and whether specific or
        compound duties apply are legal questions. This calculator adds two
        percentage rates only when you explicitly assume simplified additive ad
        valorem stacking on the same customs value. Uncheck that assumption (and
        clear or set the additional rate) when stacking is uncertain.
      </p>

      <h2
        id="landed-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Total Landed Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Landed cost estimates what it takes to get goods to a defined delivery
        point: product value, duties, freight, insurance, brokerage, and other
        charges. It differs from unit customs value and from retail price. Do
        not double-count freight or insurance already included in the customs
        value you entered. Merchandise processing fees and other CBP charges may
        apply in real entries beyond this simplified model.
      </p>

      <h2
        id="consumer-prices"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Tariffs Affect Consumer Prices?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tariff costs can raise import invoices. Pass-through to consumers depends
        on competition, contracts, inventories, and substitution. Optional
        pass-through math in this tool:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Consumer price increase = added tariff cost × pass-through fraction</p>
        <p>New retail ≈ original retail + consumer price increase</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example scenario: $1,000 retail, $200 added tariff cost per unit, 60%
        pass-through → $120 consumer increase → about $1,120 new retail. That is
        an assumption, not a guaranteed outcome. Cost increase relative to
        customs value equals the effective ad valorem duty rate in a pure
        percentage case; retail markups are a separate layer.
      </p>

      <h2
        id="advantages-disadvantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages and Disadvantages of Tariffs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advocates may cite protection for selected domestic industries,
        government revenue, negotiating leverage, or support for strategic
        sectors. Critics may emphasize higher input costs, consumer price
        pressure, retaliation, supply-chain disruption, and efficiency losses.
        Effects depend on elasticities, retaliation, and how long measures last.
        This guide does not endorse a single policy conclusion; it aims to keep
        estimation math and caveats clear.
      </p>

      <h2
        id="historical-examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Historical Examples of U.S. Tariffs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        U.S. tariff history includes nineteenth- and early twentieth-century
        schedules, mid-century liberalization under GATT/WTO frameworks, and
        more recent use of authorities such as Section 232 (national security)
        and Section 301 (trade practices) during and after the first Trump
        administration, with later administrations modifying lists, rates, and
        exclusions. Treat each episode as dated: cite the proclamation or
        Federal Register notice, product lists, and whether the measure was
        later changed. Do not hardcode expired 2018–2019 headline rates as if
        they were permanent 2026 rates.
      </p>

      <h2
        id="exemptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Tariff Exemptions?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exclusions, preference programs (when eligible), temporary suspensions,
        and special rules can reduce or eliminate duties for qualifying
        merchandise and parties. Eligibility often hinges on correct
        classification, origin documentation, and filing requirements. An
        exemption that applied last year may have expired. This calculator does
        not auto-apply exclusions; reduce your entered rates only when you know
        an exemption applies.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Tariff Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimates can diverge from actual import charges because of
        classification disputes, valuation adjustments, anti-dumping or
        countervailing duties, quota mechanisms, specific/compound rates, fees,
        and rapidly changing legal status. Calculators cannot replace entry
        review. Prefer primary sources: CBP, USITC HTSUS, USTR, Federal Register,
 and Congressional Research Service summaries for context; always with
        dates.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/gst-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GST Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/vat-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            VAT Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/margin-and-markup-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Margin and Markup Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/net-profit-margin-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Net Profit Margin Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="trump-tariff-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TRUMP_TARIFF_FAQS]} />
      </div>
    </article>
  );
}
