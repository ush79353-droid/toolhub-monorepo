import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { UNPAID_WORK_FAQS } from './content';

export function UnpaidWorkGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-unpaid-work"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is unpaid work, exactly?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unpaid work is activity that keeps a household or community going without a
        paycheck. Cooking, cleaning, laundry, childcare, elder care, driving family
        members, repairs, and gardening all count. So can emotional support and
        volunteer time. These tasks create real economic and social value even when
        they never show up as wages or GDP.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unpaid work is not the same as leisure. Rest and hobbies are chosen free
        time. Unpaid work is the labor someone still has to do for the household to
        function. This calculator estimates what it might cost to hire that labor
 out (a replacement cost) and, separately, what those hours could represent
        at your professional hourly rate.
      </p>

      <h2
        id="full-time-part-time-sahm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Full-time, part-time, or SAHM/SAHD?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Full-time workers often add unpaid hours on top of a paid job. Part-time
        workers may trade paid hours for care. Stay-at-home mothers and fathers,
        and other caregivers, can carry most of the household load. In every case
        the time has an opportunity cost: hours spent on unpaid tasks are hours not
        spent on paid work, rest, or study. That does not mean unpaid work should
        be booked as lost wages you are owed. Replacement cost and opportunity cost
        answer different questions and should stay separate.
      </p>
      <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        Illustrative example (not official market prices): meal preparation 10 h ×
        $15 = $150; cleaning 5 h × $20 = $100; laundry 4 h × $12 = $48; childcare
        15 h × $18 = $270; gardening 2 h × $16 = $32. Total 36 hours and $600 per
        week. Monthly ≈ $600 × 52/12 = $2,600. Annual = $600 × 52 = $31,200.
        Weighted average rate = $600 / 36 ≈ $16.67 per hour.
      </div>

      <h2
        id="care-diamond"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why we should care about unpaid work: the Care Diamond
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Care Diamond describes four sources of care: families and households,
        markets and paid services, government and public institutions, and
        non-profit or community organizations. When families supply most of the
        care, that labor is easy to overlook in paychecks and policy. Measuring it
        helps explain gender gaps in paid work, who can take a job, and where
        public services or social protection would change the load.
      </p>

      <h2
        id="triple-r"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Triple &quot;R&quot; Approach: Recognize, Reduce, Redistribute
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <span className="font-semibold text-accent">Recognize.</span> Name the
          economic and social value of household labor and caregiving instead of
          treating it as invisible.
        </li>
        <li>
          <span className="font-semibold text-accent">Reduce.</span> Cut unnecessary
          unpaid work with planning, tools, accessible public services, and simpler
          household routines.
        </li>
        <li>
          <span className="font-semibold text-accent">Redistribute.</span> Share the
          remaining work more fairly among partners, other family members,
          employers, government, and community groups.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The goal is not to dismiss unpaid work. It is to see its value and spread
        the responsibility. In this calculator, “My family will share” is weekly
        hours other people take on, and “I want to outsource” is a weekly budget
        for paid help.
      </p>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...UNPAID_WORK_FAQS]} />
      </div>
    </article>
  );
}
