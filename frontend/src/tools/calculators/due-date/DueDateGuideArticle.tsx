import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DUE_DATE_FAQS } from './content';

export function DueDateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Due Date Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates a pregnancy due date from either the first day of
        the last menstrual period (LMP) or a known conception date. It follows
        common ACOG-discussed calendar dating conventions for education — not
        ultrasound dating, IVF transfer dating, or clinical management.
      </p>

      <h2
        id="acog"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ACOG-Style Dating Methods
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>LMP (28-day cycle): EDD = LMP + 280 days</p>
        <p>LMP (other cycle): EDD = LMP + 280 + (cycle − 28) days</p>
        <p>Conception: EDD = conception date + 266 days</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        See ACOG Committee Opinion No. 700,{' '}
        <em>Methods for Estimating the Due Date</em> (May 2017), for clinical
        context. Official care decisions belong with a qualified clinician.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose LMP or conception dating.</li>
        <li>
          Enter the relevant date. In LMP mode, confirm your average cycle
          length (default 28 days).
        </li>
        <li>Read the estimated due date. Share uses the page URL only.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calendar estimates assume regular ovulation relative to cycle length.
        Irregular cycles, assisted reproduction, and ultrasound measurements
        can change the clinically assigned due date. This page does not store
        or transmit your dates.
      </p>

      <div id="due-date-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...DUE_DATE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
