import { IVF_DUE_DATE_FAQS } from './content';

export function IvfDueDateGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          IVF Due Date Calculator
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estimate an educational due date after IVF using ACOG Committee
          Opinion 700 calendar rules. Defaults match the screenshot: pregnant,
          one baby, Day-3 embryo transfer, blank transfer and due dates.
        </p>
      </section>

      <section id="acog-formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          ACOG IVF Dating Formulas
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Day-3 embryo transfer: EDD = transfer + 263 days (266 − 3). Day-5
          transfer: EDD = transfer + 261 days (266 − 5). IVF with own eggs or
          donor eggs when retrieval/fertilization is known: EDD =
          retrieval/fertilization + 266 days. Source: ACOG Committee Opinion
          700 (May 2017), Methods for Estimating the Due Date.
        </p>
      </section>

      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          How to Use the Calculator
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Choose pregnant or planning.</li>
          <li>Select one baby, twins, or triplets (EDD formula unchanged).</li>
          <li>Pick own eggs, donor eggs, Day-3 transfer, or Day-5 transfer.</li>
          <li>Enter the transfer or retrieval/fertilization date.</li>
          <li>Read the approximate due date. Share uses only the page URL.</li>
        </ol>
      </section>

      <section id="plurality" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Twins and Triplets</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Selecting twins or triplets does not change the educational 40-week
          estimated due date. Delivery timing for multiples is decided
          clinically and is not invented here.
        </p>
      </section>

      <section id="planning" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Planning vs Pregnant
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Planning mode uses the same ACOG calendar math for a projected
          transfer or retrieval date. This tool does not invent planning
          intervals or delivery windows beyond the due-date formula.
        </p>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ultrasound dating and clinic protocols may revise an EDD. Fresh vs
          frozen cycles, delayed transfers, and embryo thaw day can affect
          clinical dating. Treat this calculator as educational only.
        </p>
      </section>

      <section id="ivf-due-date-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {IVF_DUE_DATE_FAQS.map((faq) => (
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
