import { PREGNANCY_FAQS } from './content';

export function PregnancyGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Pregnancy Calculator
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estimate an educational pregnancy schedule from due date, last menstrual
          period, ultrasound, conception, or IVF transfer. Default sample uses
          due date March 21, 2027.
        </p>
      </section>

      <section id="methods" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Dating Methods</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Due Date — use an existing EDD as the anchor.</li>
          <li>Last Period — EDD = LMP + 280 days (adjust for cycle length).</li>
          <li>
            Ultrasound — EDD = scan date + (280 − gestational age days at scan).
          </li>
          <li>Conception — EDD = conception + 266 days.</li>
          <li>
            IVF Transfer — day-3 + 263 days; day-5 blastocyst + 261 days.
          </li>
        </ul>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Choose Calculate Based On.</li>
          <li>Enter the matching date and any method-specific fields.</li>
          <li>Click Calculate for due date, gestational age, and milestones.</li>
          <li>Reload restores the sample due date; Clear blanks the form.</li>
        </ol>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Multiples, irregular cycles, and clinical ultrasound revisions can
          change dating. This tool does not replace obstetric care.
        </p>
      </section>

      <section id="pregnancy-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {PREGNANCY_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-sm font-semibold text-accent">
                {faq.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
