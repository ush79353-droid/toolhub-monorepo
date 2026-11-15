import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ACCUMULATED_DEPRECIATION_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-accumulated-depreciation',
    title: 'What Accumulated Depreciation Means',
    body: [
      'When a business buys a long-lived asset, the purchase cost usually stays on the books. Depreciation moves part of that cost into expense over time. Accumulated depreciation is the total already moved: every prior period’s charge, added together, through the date you are looking at.',
      'On the balance sheet it sits opposite the asset as a contra account. Readers can still see original cost, while net book value shows how much of that cost remains unallocated.',
    ],
  },
  {
    id: 'accumulated-vs-annual',
    title: 'Accumulated vs Annual Depreciation',
    body: [
      'Annual depreciation is one year’s (or one period’s) expense. Accumulated depreciation is the sum of those expenses from acquisition through the reporting date. After two equal straight-line years, annual depreciation might be 1,466.67 while accumulated depreciation is 2,933.33.',
      'This calculator focuses on the cumulative total and the resulting book value. It does not print a full amortization-style schedule or tax worksheets.',
    ],
  },
  {
    id: 'net-book-value',
    title: 'Net Book Value',
    body: [
      'Net book value = asset cost − accumulated depreciation. With a 25,000 cost and 2,933.33 of accumulated depreciation, book value is 22,066.67. Salvage value is the floor for these methods: once accumulated depreciation reaches cost minus salvage, further depreciation stops in the model.',
      'Book value is not a quote from a dealer, an appraiser, or a liquidation auction. It is the carrying amount that follows the method and inputs you entered.',
    ],
  },
  {
    id: 'straight-line',
    title: 'Straight-Line Method',
    body: [
      'Depreciable amount = cost − salvage. Annual depreciation = depreciable amount ÷ useful life. Accumulated depreciation = annual depreciation × years elapsed (not beyond useful life).',
      'Default example: cost 25,000, salvage 3,000, life 15 years, 2 years elapsed. Depreciable amount 22,000. Annual charge 22,000 ÷ 15. After two years, accumulated depreciation is 2,933.33 and net book value is 22,066.67.',
    ],
  },
  {
    id: 'declining-balance',
    title: 'Declining-Balance Method',
    body: [
      'This tool uses 200% declining balance (double-declining). Rate = 2 ÷ useful life. Each year, depreciation = opening book value × rate, but never more than the room down to salvage. Opening book value then falls by that year’s charge.',
      'The salvage cap is a true-up inside the same method. The calculator does not rewrite later years as straight-line. Document the rate when you share results so readers know you used double-declining.',
    ],
  },
  {
    id: 'sum-of-years',
    title: "Sum of the Year's Digits",
    body: [
      'Sum of years = useful life × (useful life + 1) ÷ 2. Depreciation in year Y = (cost − salvage) × (useful life − Y + 1) ÷ sum of years. Accumulated depreciation is the sum of those yearly amounts through the selected year.',
      'Like straight line, the depreciable base is fixed. Unlike straight line, earlier years take a larger share of that base.',
    ],
  },
  {
    id: 'units-of-production',
    title: 'Units of Production',
    body: [
      'Depreciation per unit = (cost − salvage) ÷ estimated lifetime units. Accumulated depreciation = depreciation per unit × cumulative units produced, capped at lifetime capacity and at the depreciable amount.',
      'Year fields hide for this method because time is not the driver. Enter nonnegative production quantities, and keep cumulative units at or below the lifetime estimate under the standard model.',
    ],
  },
  {
    id: 'worked-examples',
    title: 'Worked Examples',
    body: [
      'Straight line (defaults): 25,000 cost, 3,000 salvage, 15-year life, 2 years → accumulated depreciation 2,933.33, net book value 22,066.67.',
      'Units of production: same cost and salvage, 100,000 lifetime units, 10,000 produced → 2,200 of accumulated depreciation and 22,800 of book value.',
      'Full life: after 15 straight-line years the entire 22,000 depreciable amount is recognized and book value equals the 3,000 salvage.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Calculator',
    body: [
      'Choose a method, enter cost and salvage in one currency, then fill the year fields or the production fields that belong to that method. Results update as you type. Reset restores the default straight-line example. Copy or share exports a short text summary.',
      'Use whole years for the time-based methods. Currency changes the display symbol only; it does not convert amounts.',
    ],
  },
];

export function AccumulatedDepreciationGuideArticle() {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">{section.title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
      <section id="accumulated-depreciation-faq" className="scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ACCUMULATED_DEPRECIATION_FAQS]} />
        </div>
      </section>
    </div>
  );
}
