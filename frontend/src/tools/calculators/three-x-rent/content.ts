import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const THREE_X_RENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-the-3x-rent-rule', label: 'What is the 3x rent rule?' },
  { id: 'how-to-calculate', label: 'How to calculate 3 times the rent' },
  { id: 'monthly-vs-annual', label: 'Required monthly vs annual income' },
  { id: 'rent-examples', label: 'Examples for different rents' },
  { id: 'multiple-tenants', label: 'Multiple tenants and combined incomes' },
  { id: 'gross-vs-net', label: 'Gross vs net income' },
  { id: 'besides-income', label: 'What else landlords may consider' },
  { id: 'limitations', label: 'Limitations of the guideline' },
  { id: 'three-x-rent-faq', label: 'Frequently asked questions' },
];

export interface RentExampleRow {
  rent: string;
  monthly: string;
  annual: string;
}

export interface ThreeXRentGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  examples?: readonly RentExampleRow[];
}

export const THREE_X_RENT_GUIDE_SECTIONS: readonly ThreeXRentGuideSection[] = [
  {
    id: 'what-is-the-3x-rent-rule',
    title: 'What is the 3x rent rule?',
    paragraphs: [
      'The 3x rent rule is a screening shortcut some landlords and listing sites use. It says a household’s gross monthly income should be at least three times the monthly rent. Gross income means pay before taxes and other deductions, not the amount that lands in a bank account.',
      'Three times the rent is the same statement as “rent is about one third of gross monthly income.” On a 1,500 rent, three times is 4,500 a month. Divide 1,500 by 4,500 and the rent is 33.33% of that gross income.',
      'The figure is a guideline, not a statute and not a promise that a particular landlord will use it. Some ask for 2.5 times rent, some ask for 4 times, and some never publish a multiple at all. Housing programs, vouchers, and local rent rules can follow an entirely different test. Use the result to prepare an application, then read the listing and the application itself.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to calculate 3 times the rent',
    paragraphs: [
      'Start from the rent you would pay each month. Multiply by the guideline multiple. The default multiple here is 3. The product is the gross monthly income the shortcut asks for. Multiply that monthly figure by 12 when you want the same requirement as a yearly salary.',
      'The other direction starts from income. Divide gross monthly income by the same multiple. The result is the highest monthly rent that still meets the shortcut. A gross income of 4,500 divided by 3 is a 1,500 rent.',
      'Changing the multiple is deliberate. A 4× screen on a 1,500 rent asks for 6,000 a month. A 2.5× screen on a 1,000 rent asks for 2,500. The rent-to-income percentage moves with the multiple: 3× is 33.33%, 4× is 25%, and 2.5× is 40%.',
    ],
    formula: 'Required gross monthly income = monthly rent × multiplier',
    formulaNote: 'Maximum monthly rent = gross monthly income ÷ multiplier. Annual amounts are the monthly amount × 12.',
  },
  {
    id: 'monthly-vs-annual',
    title: 'Required monthly vs annual income',
    paragraphs: [
      'Monthly income is the number most rent ads compare with the rent. Annual income is that same requirement stretched across a year, which is easier to set next to a salary offer or a tax form. This calculator takes the rounded monthly result and multiplies by 12. It does not rebuild the year from weekly paychecks or from a 52-week schedule.',
      'A 2,000 rent at 3× needs 6,000 in gross income each month and 72,000 across the year. An 800 rent at 3× needs 2,400 a month and 28,800 a year. If the rent includes a few cents, the monthly product is rounded to the nearest hundredth before the year is calculated, so the annual line matches twelve times the monthly line you see.',
    ],
  },
  {
    id: 'rent-examples',
    title: 'Examples for different rent amounts',
    paragraphs: [
      'Each row uses a multiplier of 3 and one household. The income columns are gross, before taxes. Currency symbols are left off because the calculator only changes the symbol you read, not the arithmetic.',
    ],
    examples: [
      { rent: '800', monthly: '2,400', annual: '28,800' },
      { rent: '1,200', monthly: '3,600', annual: '43,200' },
      { rent: '1,500', monthly: '4,500', annual: '54,000' },
      { rent: '2,000', monthly: '6,000', annual: '72,000' },
      { rent: '2,500', monthly: '7,500', annual: '90,000' },
    ],
  },
  {
    id: 'multiple-tenants',
    title: 'Multiple tenants and combined incomes',
    paragraphs: [
      'When more than one person will be on the lease, many landlords add the household’s gross incomes and compare that total with the rent. They do not always require each roommate to earn three times the full rent, and they do not always require an even split.',
      'The equal split in this calculator is only an assumption. A 1,500 rent at 3× still needs 4,500 of gross household income. Split evenly between two people, that is 2,250 each per month, or 27,000 each per year. If one person earns more, switch on unequal shares and enter the percent of the requirement each person will cover. Shares of 60% and 40% on that same 4,500 are 2,700 and 1,800 a month. The shares have to add up to 100%.',
      'Affordable-rent mode can take each person’s gross monthly income separately. Those amounts are added first. Two incomes of 2,000 and 2,500 are a combined 4,500, and at 3× the rent that combined income lines up with is 1,500 a month. A person listed at zero still counts as a tenant, but they do not add income.',
    ],
    formula: 'Income per tenant (equal split) = (monthly rent × multiplier) ÷ number of tenants',
    formulaNote: 'Combined gross monthly income = the sum of each tenant’s gross monthly income.',
  },
  {
    id: 'gross-vs-net',
    title: 'Gross vs net income',
    paragraphs: [
      'Every income field on this page is gross income before taxes. Gross pay is the wage before income tax, social contributions, health insurance, and retirement deductions. Net pay, or take-home pay, is what remains after those amounts.',
      'A 3× screen that secretly used take-home pay would describe a different household than the one most listings mean. If your pay stub shows both numbers, use the gross line here. If you only know take-home pay, this result will sit below the gross income a landlord may ask to see. Bonuses, overtime, and commissions belong in the figure only when you are willing to treat them as income you can document.',
    ],
  },
  {
    id: 'besides-income',
    title: 'What else landlords may consider',
    paragraphs: [
      'Income is one screen, not the whole application. A landlord may also look at credit history, past-due rent, eviction records, debt payments, savings, how long you have been in the job, and whether a guarantor will sign. A household that clears 3× rent can still be declined. A household under 3× can still be accepted when the rest of the file is strong or when the landlord uses another rule.',
      'Student aid, housing vouchers, and employer housing stipends are sometimes counted and sometimes not. Roommates who will not be on the lease may be ignored even if they help pay. The application form is the list that matters for that property.',
    ],
  },
  {
    id: 'limitations',
    title: 'Limitations of the guideline',
    paragraphs: [
      'The 3× shortcut ignores taxes, debt, childcare, and the rest of a budget. A household can meet the multiple and still have little left after other bills. It can also miss the multiple and pay the rent comfortably because expenses are low.',
      'The calculator does not know local occupancy rules, rent-control formulas, or fair-housing limits on what a landlord may ask. It does not convert currencies, and it does not check that a salary is real. Equal roommate shares are a planning assumption, including the leftover cent when a total does not divide evenly. Treat the result as arithmetic for a conversation, not as an approval and not as legal or financial advice.',
    ],
  },
];

export const THREE_X_RENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Is the 3x rent rule a legal requirement?',
    answer:
      'No. It is a screening guideline some landlords use. Laws, voucher programs, and individual landlords can require something else, including no published income multiple at all.',
  },
  {
    question: 'Does this calculator use gross or net income?',
    answer:
      'Gross income before taxes. Enter pay before tax and other deductions. Take-home pay is a smaller number and is not what the usual 3× comparison uses.',
  },
  {
    question: 'How much income do I need for 1,500 in rent?',
    answer:
      'At a 3× multiple, gross monthly income of 4,500 and gross annual income of 54,000. That is the guideline, not a quote from a specific landlord.',
  },
  {
    question: 'How should roommates split the requirement?',
    answer:
      'Add every leaseholder’s gross income first if the landlord looks at the household. An equal split of a 4,500 requirement is 2,250 each, but that even split is only an assumption. Use unequal shares when one person will cover more of the income screen.',
  },
  {
    question: 'What rent can a given income afford under this rule?',
    answer:
      'Divide gross monthly income by the multiplier. Income of 4,500 at 3× lines up with 1,500 a month, or 18,000 of rent across a year. Debt and other bills are not subtracted.',
  },
  {
    question: 'Does changing the currency convert my rent?',
    answer:
      'No. The currency control changes the symbol and the number format only. Type the rent or income in the currency you want to read.',
  },
];
