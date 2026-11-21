import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TDS_INTEREST_FAQS } from './content';

export function TdsInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-tds-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is TDS Interest / Late Fee?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Indian tax law charges simple interest when Tax Deducted at Source (TDS) is deducted late or
        deposited late (Section 201(1A)), and a daily fee when the quarterly TDS statement is filed
 late (Section 234E). This calculator estimates those amounts in INR for instructional use; 
        confirm the latest Income Tax / TRACES guidance and any CBDT due-date extensions before
        filing.
      </p>

      <h2
        id="tds-interest-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sections 201(1A) and 234E
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Late deduction: Interest = TDS × 1% × inclusive calendar months (deductible → deducted)</p>
        <p className="mt-2">
          Late payment: Interest = TDS × 1.5% × inclusive months (deducted → paid) if paid after Rule
          30 due date
        </p>
        <p className="mt-2">
          Late filing (234E): Fee = min(₹200 × days after due date, TDS amount)
        </p>
        <p className="mt-2">
          Return due dates (FY start year Y): Q1 31 Jul Y · Q2 31 Oct Y · Q3 31 Jan Y+1 · Q4 31 May
          Y+1
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Late filing: TDS ₹10,000 · FY start 2027 · 1st quarter · filed 17 Nov 2026</p>
        <p>Due date = 31 Jul 2027 → still within the deadline (no 234E fee yet)</p>
        <p className="mt-2">Late deduction: ₹10,000 · deductible 15 Apr 2025 · deducted 2 May 2025</p>
        <p>Months = 2 (Apr + May) · Interest = 10,000 × 1% × 2 = ₹200</p>
        <p className="mt-2">Late payment: ₹10,000 deducted Apr · paid 12 May (after 7 May due)</p>
        <p>Months = 2 · Interest = 10,000 × 1.5% × 2 = ₹300</p>
      </div>

      <h2
        id="tds-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TDS_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
