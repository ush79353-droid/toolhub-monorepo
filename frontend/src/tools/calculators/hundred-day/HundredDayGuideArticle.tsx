import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HUNDRED_DAY_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-is-100-day',
    title: 'What Is a 100 Day Calculator?',
    body: [
      'A 100 day calculator finds the calendar date that falls a chosen number of days after or before a starting date. The default count is 100, which is a common milestone for projects, study plans, and personal countdowns.',
      'Omega Calculators also counts the calendar days between two dates. Both modes run in your browser and use date-only arithmetic, so daylight saving time cannot shift the selected day.',
    ],
  },
  {
    id: 'add-100-days',
    title: 'How to Calculate 100 Days From a Date',
    body: [
      'With Include start date unchecked, the starting date is day 0. Add 100 calendar days, moving across month and year boundaries and through February 29 when that day exists.',
      'January 1, 2026 plus 100 exclusive days is April 11, 2026. January has 31 days, February 2026 has 28, and March has 31, which accounts for the first 90 days. The remaining 10 land on April 11.',
    ],
  },
  {
    id: 'subtract-100-days',
    title: 'How to Find the Date 100 Days Ago',
    body: [
      'Choose Days before. The same exclusive rule walks backward. January 1, 2026 minus 100 calendar days is September 23, 2025. Weekends stay in the count.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the 100 Day Calculator',
    body: [
      'Add or subtract days uses Starting date, Number of days, Direction, and Include start date. Days between dates uses From date, To date, and the same checkbox. Calculate refreshes the result. Reset restores 100 days, Days after, an unchecked box, and today’s local date.',
      'Swap dates exchanges the two endpoints without changing the counting rule. Copy result places the summary on the clipboard.',
    ],
  },
  {
    id: 'include-start',
    title: 'Does the Starting Date Count as Day One?',
    body: [
      'Unchecked, the start is day 0 and the result is exactly N days away. Checked, the start is day 1, so a positive count lands N − 1 days away. January 1, 2026 plus an inclusive 100 is April 10, 2026. A count of 1 with the box checked stays on the starting date.',
      'Between two dates the checkbox means something different. Exclusive January 1 to January 10 is 9 days. Inclusive counting of that span is 10 because both endpoints are included. The same date is 0 exclusive and 1 inclusive.',
    ],
  },
  {
    id: 'days-between',
    title: 'How to Calculate Days Between Two Dates',
    body: [
      'The signed difference is the to date minus the from date in calendar days. If you enter the later date first, the signed count is negative and the absolute count is still the size of the gap. The form does not silently swap the dates.',
      'Weeks and leftover days come from that absolute count. Seven days is one week and zero leftover days. Nine exclusive days is one week and two days.',
    ],
  },
  {
    id: 'leap-years',
    title: 'How Leap Years Affect Date Calculations',
    body: [
      'A Gregorian leap year is divisible by 4, except century years unless they are divisible by 400. February 28, 2024 plus one day is February 29. February 28, 2023 plus one day is March 1.',
      'February 1, 2024 plus 100 days is May 11, 2024. March 1, 2024 plus 100 days is June 9, 2024. February 30 is never accepted.',
    ],
  },
  {
    id: 'calendar-vs-business',
    title: 'Calendar Days vs. Business Days',
    body: [
      'Every result on this page is a calendar-day count. Saturday and Sunday are included. Holidays are included. A business-day count would skip those days and needs a different calculator.',
    ],
  },
  {
    id: 'examples',
    title: 'Examples of 100-Day Calculations',
    body: [
      'January 1, 2026, 100 days after, exclusive: April 11, 2026, a Saturday. Inclusive: April 10, 2026.',
      'January 1, 2026, 100 days before, exclusive: September 23, 2025. Inclusive: September 24, 2025, because the start counts as day 1 and the walk is 99 days backward.',
      'January 31 plus one day is February 1. December 31, 2025 plus one day is January 1, 2026.',
    ],
  },
  {
    id: 'mistakes',
    title: 'Common Date Calculation Mistakes',
    body: [
      'Inclusive and exclusive counting differ by one day on a forward or backward offset, and by both endpoints on a span. Mixing them is the usual off-by-one.',
      'Month lengths are not all 30 days, and February changes in leap years. Subtracting local timestamps and dividing by 86,400,000 can also be wrong across a daylight-saving change. This calculator stores year, month, and day and adds them in UTC so the civil date does not shift.',
      'One hundred calendar days is not three months, and it is not 100 business days.',
    ],
  },
  {
    id: 'uses',
    title: 'Practical Uses',
    body: [
      'People use a 100-day count for project checkpoints, study plans, event countdowns, habit streaks, and “what date is this due” tracking. Enter the real start date rather than relying on a printed “100 days from today,” because that answer changes overnight.',
    ],
  },
];

export function HundredDayGuideArticle() {
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
        <article id="hundred-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...HUNDRED_DAY_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
