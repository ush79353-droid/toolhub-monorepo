import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MTD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Miles to Dollars Calculator' },
  { id: 'what-is', label: 'What Is a Miles to Dollars Calculator?' },
  { id: 'airline-miles', label: 'Airline Miles and Their Value' },
  { id: 'how-get', label: 'How to Get Airline Miles' },
  { id: 'how-much', label: 'How Much Is an Airline Mile Worth?' },
  { id: 'why-change', label: 'Why Mile Values Change' },
  { id: 'fees', label: 'Fees When Redeeming Awards' },
  { id: 'avg-price', label: 'Average Price per Mile' },
  { id: 'estimated', label: 'Estimated Value of a Mile' },
  { id: 'book', label: 'How to Book With Miles' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: '40k', label: 'How Much Is 40,000 Miles Worth?' },
  { id: 'choose', label: 'Choosing Cash vs Miles' },
  { id: 'cpm', label: 'How to Calculate Cents per Mile' },
  { id: 'good-value', label: 'What Is a Good Redemption?' },
  { id: 'cash-or-miles', label: 'Pay Cash or Use Miles?' },
  { id: 'save', label: 'When to Save Miles' },
  { id: 'expire', label: 'Airline Miles Expiration' },
  { id: 'limits', label: 'Assumptions and Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mtd-faq', label: 'Frequently Asked Questions' },
];

export const MTD_FAQS: readonly FAQItem[] = [
  {
    question: 'How much is one airline mile worth?',
    answer:
      'There is no fixed cash rate. Value depends on the redemption. Use an assumed cents-per-mile for planning, then compare with actual redemption value: (cash fare − fees) ÷ miles × 100.',
  },
  {
    question: 'How do I convert airline miles into dollars?',
    answer:
      'Multiply miles by your assumed dollars-per-mile (cents ÷ 100). Example: 40,000 × 0.015 = $600 at 1.5¢/mi — illustrative only.',
  },
  {
    question: 'How much are 1,000 airline miles worth?',
    answer: 'At an illustrative 1.5¢/mi: 1,000 × 0.015 = $15.',
  },
  {
    question: 'How much are 5,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 5,000 × 0.015 = $75.',
  },
  {
    question: 'How much are 10,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 10,000 × 0.015 = $150.',
  },
  {
    question: 'How much are 20,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 20,000 × 0.015 = $300.',
  },
  {
    question: 'How much are 25,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 25,000 × 0.015 = $375.',
  },
  {
    question: 'How much are 40,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 40,000 × 0.015 = $600. At 1¢/mi = $400; at 2¢/mi = $800.',
  },
  {
    question: 'How much are 50,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 50,000 × 0.015 = $750.',
  },
  {
    question: 'How much are 60,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 60,000 × 0.015 = $900.',
  },
  {
    question: 'How much are 75,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 75,000 × 0.015 = $1,125.',
  },
  {
    question: 'How much are 100,000 airline miles worth?',
    answer: 'At 1.5¢/mi: 100,000 × 0.015 = $1,500.',
  },
  {
    question: 'How do I calculate cents per mile?',
    answer:
      'Cents per mile = ((cash ticket price − award taxes/fees) ÷ miles required) × 100.',
  },
  {
    question: 'What is a good cents-per-mile redemption value?',
    answer:
      'No single threshold fits every program. Compare the redemption to your usual cash fares and to your assumed benchmark for that program.',
  },
  {
    question: 'How do I compare miles and cash flight prices?',
    answer:
      'Estimate award-equivalent cost = (miles × assumed $/mi) + fees, then subtract from the cash fare. Also check actual ¢/mi.',
  },
  {
    question: 'Should I use miles or pay cash for a flight?',
    answer:
      'Use miles when the redemption ¢/mi and total economics beat paying cash and keeping miles for a better trip — considering fees and opportunity cost.',
  },
  {
    question: 'Do airline miles have a fixed dollar value?',
    answer:
      'Usually no. Most programs do not publish a guaranteed cash conversion rate for award flights.',
  },
  {
    question: 'Can airline miles be converted into cash?',
    answer:
      'Some programs allow limited cash-like redemptions or gift cards at low rates. Award flights are typically not a cash payout.',
  },
  {
    question: 'Why are airline miles worth different amounts?',
    answer:
      'Dynamic award pricing, cabin, route, taxes/surcharges, partner awards, and program rules all change effective value.',
  },
  {
    question: 'Do airline miles expire?',
    answer:
      'Rules are program-specific and can change. Check the loyalty program’s current expiration and activity policies.',
  },
  {
    question: 'Can I transfer miles between airlines?',
    answer:
      'Direct airline-to-airline transfers are uncommon. Credit-card transferable points often move to partner airlines; airline miles usually stay in-program unless a rare transfer partnership exists.',
  },
  {
    question: 'Can I book flights for other people using miles?',
    answer:
      'Many programs allow awards for others, sometimes with household or traveler restrictions. Check your program’s booking rules.',
  },
  {
    question: 'Do I earn miles when booking an award flight?',
    answer:
      'Often little or none on the award ticket itself; partner or elite policies vary. Confirm before assuming earnings.',
  },
  {
    question: 'Are award flights completely free?',
    answer:
      'Rarely. Government taxes and often carrier surcharges or booking fees still require cash.',
  },
  {
    question: 'Why do I have to pay taxes on award flights?',
    answer:
      'Airports and governments still levy taxes and fees; airlines may pass through fuel or carrier surcharges on awards.',
  },
  {
    question: 'What is an airline fuel surcharge?',
    answer:
      'A cash fee some carriers add to tickets (including awards). It reduces effective cents-per-mile because you pay cash on top of miles.',
  },
  {
    question: 'How do I calculate the value of an award ticket?',
    answer:
      'Award-equivalent cost = miles × assumed $/mi + cash fees. Actual cash paid is only the fees; economic cost includes the assumed mile value.',
  },
  {
    question: 'What is an airline loyalty program?',
    answer:
      'A frequent-flyer or rewards program that issues miles/points for flying, cards, shopping, and partners, redeemable for awards.',
  },
  {
    question: 'What is the difference between miles and points?',
    answer:
      'Naming differs by brand. Functionally both are loyalty currency; transfer and redemption rules matter more than the label.',
  },
  {
    question: 'What is the difference between award miles and flight miles?',
    answer:
      'Flight (status) miles often track distance or spend for elite status. Award miles are the redeemable currency for tickets and other rewards.',
  },
  {
    question: 'How do travel credit card miles work?',
    answer:
      'Cards earn points or miles for spending; some transfer to airlines. Valuations depend on transfer partners and redemptions.',
  },
  {
    question: 'Is it worth buying airline miles?',
    answer:
      'Only if the purchase cost per mile is below the value you will redeem — including bonuses, taxes, and opportunity cost. Often a poor deal without a known high-value award.',
  },
  {
    question: 'How can I maximize the value of airline miles?',
    answer:
      'Target high ¢/mi awards, minimize surcharges, use transfer bonuses carefully, and avoid low-value merchandise or poor cash conversions.',
  },
  {
    question: 'What happens when airlines devalue miles?',
    answer:
      'Awards may need more miles or higher dynamic prices, lowering ¢/mi. Holding large balances carries devaluation risk.',
  },
  {
    question: 'Can I use miles for hotel bookings?',
    answer:
      'Some programs allow hotel or transfer-partner redemptions. Value varies widely — compare ¢/mi with flight awards.',
  },
  {
    question: 'Can I use miles for upgrades?',
    answer:
      'Many programs offer cabin upgrades for miles plus cash. Value depends on the cash upgrade price you avoid.',
  },
  {
    question: 'How do I calculate the value of transferred credit card points?',
    answer:
      'After transfer, treat them as airline miles and use the same (cash − fees) ÷ miles formula for the award you book.',
  },
  {
    question: 'Is 1.5 cents per airline mile a good value?',
    answer:
      'It is a common illustrative planning figure, not a rule. Some awards beat it; others fall short. Compare to your cash alternative.',
  },
  {
    question: 'How much cash is saved when using 25,000 miles?',
    answer:
      'Example: $600 cash − ($375 assumed miles + $50 fees) = $175 estimated economic savings at 1.5¢/mi — not a bank deposit.',
  },
  {
    question: 'How do I find the break-even value for an award flight?',
    answer:
      'Break-even ¢/mi ≈ ((cash fare − award fees) ÷ miles) × 100. If your assumed value is lower, the award looks attractive under that assumption.',
  },
];
