import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ATTRITION_RATE_FAQS } from './content';

export function AttritionRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-attrition-rate" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Attrition Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Employee attrition rate is an essential workforce metric that tracks the proportion of individuals leaving an organization over a given period—typically a month, quarter, or year. High attrition can signal underlying cultural friction, uncompetitive compensation, or management challenges, while unusually low attrition might suggest workforce stagnation or limited upward mobility.
      </p>

      <h2 id="formula-and-calculation" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Attrition Rate Formula & Mathematical Logic
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The standard industry formula divides the total number of departures by the average number of employees active during the measurement window:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Average Employees = (Employees at start + Employees at end) / 2</p>
        <p className="mt-2">Attrition Rate (%) = (Employees that left / Average employees) × 100</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Using the average of beginning and ending headcounts ensures that workforce fluctuations—such as ongoing recruiting or phased downsizing—do not skew the retention rate calculation.
      </p>

      <h2 id="step-by-step-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step-by-Step Example Walkthrough
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider a company analyzing its workforce changes over a calendar year:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li><strong>Employees at the start:</strong> 100</li>
        <li><strong>Employees at the end:</strong> 90</li>
        <li><strong>Employees that left:</strong> 10</li>
      </ul>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>1. Average Headcount = (100 + 90) / 2 = 95</p>
        <p>2. Attrition Rate = (10 / 95) × 100 = 10.5263...%</p>
        <p>3. <strong>Final Result: 10.53%</strong></p>
      </div>

      <h2 id="attrition-vs-turnover" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Employee Attrition vs. Turnover: Understanding the Difference
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        While frequently used interchangeably, human resource professionals make a specific distinction between attrition and turnover:
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-accent">Employee Attrition</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Refers to permanent departures where positions are intentionally left unfulfilled or phased out (e.g. through retirement, workforce restructuring, or voluntary resignations during hiring freezes).
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-accent">Employee Turnover</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Refers to routine employee exits where the company immediately or actively seeks to recruit backfills for the vacated roles to sustain normal business operations.
          </p>
        </div>
      </div>

      <h2 id="healthy-attrition-rate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Healthy Attrition Rate?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Across most modern corporate environments, an annual voluntary attrition rate between <strong>10% and 15%</strong> is considered standard and healthy. Some natural turnover brings fresh perspectives and technical skills into the organization. However, rates consistently exceeding 20% often warrant comprehensive exit interview reviews and management audits.
      </p>

      <h2 id="how-to-reduce-attrition" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Proven Strategies to Reduce Employee Attrition
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li><strong>Competitive Compensation & Regular Market Adjustments:</strong> Ensure salaries, health benefits, and retirement matches align with regional industry standards.</li>
        <li><strong>Clear Internal Career Progression:</strong> Provide employees with concrete advancement pathways, ongoing training budgets, and internal promotion opportunities.</li>
        <li><strong>Comprehensive Onboarding:</strong> First impressions matter; structured 90-day onboarding programs dramatically reduce early-tenure turnover.</li>
        <li><strong>Workplace Flexibility:</strong> Remote or hybrid arrangements and schedule autonomy consistently rank as primary retention drivers.</li>
      </ul>

      <h2 id="attrition-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={ATTRITION_RATE_FAQS} />
      </div>
    </article>
  );
}
