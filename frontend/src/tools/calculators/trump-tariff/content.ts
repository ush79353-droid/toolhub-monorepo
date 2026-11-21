import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRUMP_TARIFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Trump Tariff Calculator' },
  { id: 'what-are-trump-tariffs', label: 'What Are Trump Tariffs?' },
  { id: 'how-tariffs-work', label: 'How Do Tariffs Work?' },
  { id: 'who-pays-tariffs', label: 'Who Pays Import Tariffs?' },
  { id: 'calculate-trump-tariffs', label: 'How to Calculate Trump Tariffs' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  {
    id: 'rates-by-product-country',
    label: 'Rates by Product and Country',
  },
  { id: 'htsus', label: 'What Is an HTS Code?' },
  { id: 'additional-tariffs', label: 'How Do Additional Tariffs Work?' },
  { id: 'landed-cost', label: 'What Is Total Landed Cost?' },
  { id: 'consumer-prices', label: 'Tariffs and Consumer Prices' },
  { id: 'advantages-disadvantages', label: 'Advantages and Disadvantages' },
  { id: 'historical-examples', label: 'Historical U.S. Tariff Examples' },
  { id: 'exemptions', label: 'What Are Tariff Exemptions?' },
  { id: 'limitations', label: 'Limitations of Tariff Calculators' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'trump-tariff-faq', label: 'Frequently Asked Questions' },
];

export const TRUMP_TARIFF_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a tariff?',
    answer:
      'A tariff is a tax or duty assessed on imported goods when they enter a customs territory. In the United States, many tariffs are expressed as an ad valorem percentage of customs value, though specific (per-unit) and compound duties also exist.',
  },
  {
    question: 'What are Trump tariffs?',
    answer:
      '“Trump tariffs” is a common label for trade measures associated with the Trump administrations, including Section 301 actions on certain goods from China and Section 232 measures on steel and aluminum, among others. The phrase is informal: each measure has its own legal authority, product coverage, origin rules, effective dates, and later modifications. Always check whether a given rate is still legally effective.',
  },
  {
    question: 'How do I calculate an import tariff?',
    answer:
      'For a simple ad valorem case: total customs value V = unit value × quantity; duty T = V × (rate / 100). If two additive percentage duties apply to the same base, combine rates or compute each duty separately and add them. Add freight, insurance, and other fees only when estimating landed cost and when they are not already inside customs value.',
  },
  {
    question: 'Who pays U.S. import tariffs?',
    answer:
      'Customs duties are generally paid to U.S. Customs and Border Protection by the importer of record (or the responsible party under applicable rules). The economic burden can be shared among foreign producers, importers, retailers, and consumers through pricing and contract terms. Foreign governments do not automatically “pay” U.S. tariffs.',
  },
  {
    question: 'Do import tariffs increase consumer prices?',
    answer:
      'They can. Higher import costs may be absorbed in margins, offset by exchange rates or sourcing changes, or passed through partly or fully to retail prices. Pass-through is an empirical outcome, not a fixed rule. This calculator’s pass-through section is a scenario tool only.',
  },
  {
    question: 'How do tariffs affect the economy?',
    answer:
      'Effects depend on coverage, rates, retaliation, supply-chain flexibility, and demand. Potential channels include higher input costs, relative-price shifts, revenue for the government, protection for some domestic producers, and efficiency costs. Macro outcomes are debated and context-specific.',
  },
  {
    question: 'How do I calculate tariffs on products from China?',
    answer:
      'Classify the product under HTSUS, identify ordinary column rates and any additional measures that apply to that classification and origin on the entry date, then apply valuation rules. Country alone is never enough. Use CBP, USITC HTSUS, and USTR materials for official guidance; this tool only runs user-defined scenarios.',
  },
  {
    question: 'Are all products from one country subject to the same tariff?',
    answer:
      'No. Duties vary by HTSUS classification, special program eligibility, exclusions, and measure-specific lists. Two shipments from the same country can face very different rates.',
  },
  {
    question: 'What is the difference between customs duty and import tax?',
    answer:
      '“Customs duty” usually means the tariff assessed under the tariff schedule and related trade measures. “Import tax” is a looser phrase that people sometimes use for duties or for other border charges. Sales taxes, VAT/GST, and local taxes are separate concepts.',
  },
  {
    question: 'What is an HTSUS code?',
    answer:
      'The Harmonized Tariff Schedule of the United States (HTSUS) classifies merchandise for duty and statistical purposes. Correct classification is fundamental to determining applicable rates. Format checks in this calculator do not confirm a correct classification.',
  },
  {
    question: 'How do I find the correct tariff rate?',
    answer:
      'Start with the HTSUS classification, then review chapter notes, general notes, and any additional duties or exclusions that apply by origin and date. Authoritative sources include the USITC HTSUS, CBP rulings and guidance, USTR notices, and the Federal Register. Professional advice may be required for complex entries.',
  },
  {
    question: 'Can multiple tariffs apply to one product?',
    answer:
      'Yes. Ordinary customs duties and additional trade measures can both apply when the law and regulations provide for that. Stacking rules are measure-specific; this calculator only adds percentage rates when you explicitly assume additive ad valorem stacking.',
  },
  {
    question: 'Are there exemptions from import tariffs?',
    answer:
      'Possible relief includes product exclusions, temporary suspensions, free-trade or preference programs, and other special rules — each with eligibility conditions (including origin). Exemptions are not automatic.',
  },
  {
    question: 'What is a tariff-inclusive price?',
    answer:
      'In this calculator, tariff-inclusive value means customs value plus estimated duties (C = V + T). It is not necessarily the final retail price.',
  },
  {
    question: 'What is total landed cost?',
    answer:
      'Landed cost estimates the cost of getting goods to a defined point, often including product value, duties, freight, insurance, and other import charges. Avoid double-counting costs already embedded in customs value.',
  },
  {
    question: 'How do tariffs affect imported vehicles?',
    answer:
      'Vehicle duties depend on classification (for example, passenger cars versus trucks), origin, and any additional measures. Use HTSUS and current notices rather than a single “country rate.” Presets here are illustrative only.',
  },
  {
    question: 'How do tariffs affect electronics?',
    answer:
      'Electronics span many HTSUS lines with different ordinary rates and possible additional measures. A smartphone and a television are not interchangeable for duty purposes.',
  },
  {
    question: 'Can tariffs exceed 100%?',
    answer:
      'Yes. Ad valorem rates can exceed 100% when the law provides for them. This calculator does not silently clamp high rates.',
  },
  {
    question: 'What is a reciprocal tariff?',
    answer:
      'In policy discussion, “reciprocal” often means aligning or responding to another country’s tariff levels. Legal meaning depends on the specific statute, proclamation, or negotiation. Do not assume a reciprocal announcement equals an effective duty without checking the operative text and dates.',
  },
  {
    question: 'Are historical Trump tariffs still in effect?',
    answer:
      'Some measures associated with those periods were later modified, continued, suspended, or replaced. Status must be verified for each product, origin, and date. Historical rates must not be presented as current without confirmation.',
  },
  {
    question: 'How can I estimate tariff-related price increases?',
    answer:
      'One approach is to compute duty per unit and apply a pass-through fraction to an original retail price. That is a scenario, not a forecast. Margins, competition, and contracts all matter.',
  },
  {
    question: 'What is the difference between a tariff and a sales tax?',
    answer:
      'A tariff is assessed on imports at the border under trade and customs rules. A sales tax is typically a domestic consumption tax on taxable sales. They can both raise end prices but operate under different laws and bases.',
  },
  {
    question: 'Does the shipping country determine tariff origin?',
    answer:
      'Not necessarily. Country of origin depends on manufacturing and substantial transformation rules. Goods may ship from a third country while originating elsewhere.',
  },
  {
    question: 'Are tariff calculations legally binding?',
    answer:
      'No. Calculator estimates — including this one — are educational. Official liability depends on the entry, classification, valuation, and CBP assessment under applicable law.',
  },
  {
    question: 'Where can I check official U.S. tariff information?',
    answer:
      'Primary references include the USITC Harmonized Tariff Schedule, CBP resources and rulings, USTR announcements, and Federal Register publications. Cross-check effective dates and amendments.',
  },
];
