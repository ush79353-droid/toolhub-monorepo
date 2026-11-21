import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AVERAGE_COLLECTION_PERIOD_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-acp-means',
    title: 'What Average Collection Period Means',
    body: [
      'Average collection period estimates how long credit sales remain uncollected. It answers a narrow timing question: the receivables balance you are looking at equals how many days of credit sales?',
      'It is not a forecast for a single invoice, and it is not a credit score. Two businesses can post the same figure for different reasons, one with 30-day terms paid on time, another with shorter terms paid late.',
    ],
  },
  {
    id: 'acp-formulas',
    title: 'Formulas',
    body: [
      'Average accounts receivable = (beginning accounts receivable + ending accounts receivable) ÷ 2.',
      'Collection period (days) = (average accounts receivable ÷ total credit sales) × duration.',
      'When you already know the receivables turnover ratio, collection period (days) = duration ÷ receivables turnover ratio.',
    ],
  },
  {
    id: 'how-to-calculate-acp',
    title: 'How to Calculate',
    body: [
      'Choose the Average accounts receivable method. Set the duration to match the sales period (365 for a full year is common). Enter average receivables and total credit sales in the same currency, or expand Calculate average accounts receivable and fill beginning and ending balances so the average fills in.',
      'The result updates as the inputs become valid. Empty or invalid money fields leave the result blank instead of inventing a number.',
    ],
  },
  {
    id: 'turnover-method',
    title: 'Turnover Ratio Method',
    body: [
      'Switch to Receivables turnover ratio when that ratio is already known. Enter the same duration and the turnover figure. The calculator hides the receivables and sales fields because they are not needed for that path.',
      'Turnover and the average-AR formula are inverses of the same relationship when the inputs line up. If turnover is 10 for a 365-day period, the collection period is 36.5 days.',
    ],
  },
  {
    id: 'terms-of-credit',
    title: 'Terms of Credit',
    body: [
      'Terms of credit are optional and never enter the formula. Use them to compare the calculated collection period with the payment window you offer customers.',
      'A collection period longer than stated terms can mean slow collection or generous informal practice. A shorter period can mean early payment or terms that overstate how long customers actually take.',
    ],
  },
  {
    id: 'acp-examples',
    title: 'Examples',
    body: [
      'Average AR method: average receivables 50,000, total credit sales 500,000, duration 365 days. Collection period = (50,000 ÷ 500,000) × 365 = 36.5 days.',
      'From beginning and ending: beginning 40,000 and ending 60,000 → average 50,000. With the same sales and duration, the result is again 36.5 days.',
      'Turnover method: duration 365 and turnover ratio 10 → collection period = 365 ÷ 10 = 36.5 days.',
    ],
  },
];

export function AverageCollectionPeriodGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
        <section id="acp-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={AVERAGE_COLLECTION_PERIOD_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
