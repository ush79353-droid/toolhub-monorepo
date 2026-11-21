import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EFFECTIVE_DURATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Effective Duration Calculator' },
  { id: 'definition', label: 'What Is Effective Duration?' },
  { id: 'formula', label: 'Effective Duration Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Effective Duration' },
  { id: 'coupons', label: 'Bond Coupon Payments' },
  { id: 'bond-price', label: 'How to Calculate a Bond Price' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'interpret', label: 'How to Interpret Effective Duration' },
  { id: 'vs-modified', label: 'Effective vs Modified Duration' },
  { id: 'vs-macaulay', label: 'Effective vs Macaulay Duration' },
  { id: 'vs-convexity', label: 'Effective Duration vs Convexity' },
  { id: 'callable', label: 'Callable Bonds' },
  { id: 'putable', label: 'Putable Bonds' },
  { id: 'mbs', label: 'Mortgage-Backed Securities' },
  { id: 'importance', label: 'Why Effective Duration Matters' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ed-faq', label: 'Frequently Asked Questions' },
];

export const EFFECTIVE_DURATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is effective duration?',
    answer:
      'Effective duration estimates how sensitive a bond’s price is to a parallel yield change by repricing the bond in up and down yield scenarios. When cash flows can change with yields (embedded options), scenario prices must come from option-aware models.',
  },
  {
    question: 'What is the effective duration formula?',
    answer:
      'D_eff = (P− − P+) / (2 × P0 × Δy), where P− and P+ are prices after yield decreases and increases, P0 is the base price, and Δy is the yield shock as a decimal.',
  },
  {
    question: 'How do you calculate effective duration?',
    answer:
      'Obtain (or compute) P0, P−, and P+, convert the yield differential to a decimal, then apply the central-difference formula. For fixed-cash-flow bonds, reprice contractual coupons and principal at shocked yields.',
  },
  {
    question: 'What does an effective duration of 5 years mean?',
    answer:
      'As a first-order approximation, a 1 percentage-point parallel yield increase suggests about a 5% price decline (before convexity), and a 1 bp move suggests about 0.05%. Finite shocks and options can change the realized move.',
  },
  {
    question: 'Is a higher effective duration better?',
    answer:
      'Not inherently. Higher duration means greater interest-rate sensitivity; useful for some views and risky for others. Suitability depends on portfolio objectives, horizons, and risk limits.',
  },
  {
    question: 'Can effective duration be negative?',
    answer:
      'Yes, for some instruments when scenario prices rise as yields rise (or fall as yields fall), which can occur with certain option-embedded or structured cash flows. Do not treat every negative result as an arithmetic error.',
  },
  {
    question: 'Can effective duration be zero?',
    answer:
      'It can be near zero when scenario prices barely respond to the chosen yield shock, or when P− ≈ P+. Floating-rate and very short instruments often show low effective duration.',
  },
  {
    question: 'Why is effective duration important?',
    answer:
      'It translates interest-rate risk into an intuitive sensitivity measure for portfolio management, hedging, ALM, and comparing bonds whose cash flows may change with rates.',
  },
  {
    question:
      'What is the difference between effective duration and modified duration?',
    answer:
      'Modified duration typically assumes fixed cash flows and uses an analytical derivative of price with respect to yield. Effective duration uses scenario repricing and can incorporate changing expected cash flows when those scenarios do.',
  },
  {
    question:
      'What is the difference between effective duration and Macaulay duration?',
    answer:
      'Macaulay duration is a present-value-weighted average time to cash flows (in periods/years). Effective duration is a price-sensitivity estimate from yield shocks, not a cash-flow timing average.',
  },
  {
    question: 'Is effective duration expressed in years?',
    answer:
      'Yes, conventionally in years, even though it measures price sensitivity. The units arise from expressing Δy as an annualized decimal yield change.',
  },
  {
    question: 'What is yield differential?',
    answer:
      'The size of the parallel yield shock used for P− and P+. A 1% differential means a one-percentage-point (100 bp) shift: Δy = 0.01 in the formula.',
  },
  {
    question: 'How does an increase in interest rates affect bond prices?',
    answer:
      'For typical fixed-coupon bonds, higher yields lower present values of remaining cash flows, so prices fall. Option-embedded securities may respond differently if expected cash flows also change.',
  },
  {
    question: 'How do coupon rates affect bond duration?',
    answer:
      'All else equal, higher coupons usually shorten duration because more cash arrives earlier. Zero-coupon bonds tend to have longer duration (closer to maturity) than otherwise similar coupon bonds.',
  },
  {
    question: 'How does maturity affect duration?',
    answer:
      'Longer maturities generally increase duration for option-free bonds, though coupon, yield, and frequency also matter. Embedded options can cap or alter that relationship.',
  },
  {
    question: 'What is the effective duration of a callable bond?',
    answer:
      'It depends on how call decisions change with yields. Falling rates can raise call probability and limit price appreciation, often producing a shorter effective duration than an otherwise similar option-free bond.',
  },
  {
    question: 'How do embedded options affect effective duration?',
    answer:
      'Options can change expected cash flows when yields move. True effective duration therefore needs scenario prices from models that allow those cash-flow changes; not a fixed coupon schedule alone.',
  },
  {
    question: 'How does convexity affect duration estimates?',
    answer:
      'Duration is a first-order (linear) approximation. Convexity captures curvature so large yield moves produce price changes that differ from −D × Δy. This calculator also reports an approximate effective convexity from the same three prices.',
  },
  {
    question: 'What is the difference between DV01 and duration?',
    answer:
      'Duration is a relative sensitivity (often years). DV01 approximates the currency price change for a one-basis-point yield move, roughly D × P × 0.0001.',
  },
  {
    question: 'Can effective duration be greater than a bond’s maturity?',
    answer:
      'For standard option-free fixed coupons, effective duration is typically less than or equal to maturity-related horizons. Unusual scenario prices or leveraged/structured instruments can produce atypical results that need model review.',
  },
];
