import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DAPT_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function DaptGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        DAPT Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total the Yeh 2016 dual antiplatelet therapy (DAPT) score from age and
        selected clinical factors. The tool is educational and does not order
        medication changes.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the DAPT Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yeh and colleagues derived a simple integer score to summarize late
        ischemic versus bleeding risk after coronary stenting when deciding
        whether to continue thienopyridine beyond one year. ACC/AHA summarized
        the same weights in the 2016 DAPT focused update.
      </p>

      <h2
        id="eligibility"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who the Score Applies To
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The published framing applies to patients who completed about 12 months
        of DAPT after PCI without major ischemic or bleeding events and who were
        not on chronic oral anticoagulation. It is not a general ACS triage
        score and does not tell you which drug to start or stop.
      </p>

      <h2
        id="points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Weights
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age &lt;65: 0; 65–74: −1; ≥75: −2</li>
        <li>
          +1: diabetes; smoking (current or within past year); MI at
          presentation; prior MI/PCI; stent &lt;3 mm; paclitaxel-eluting stent
        </li>
        <li>+2: CHF or LVEF &lt;30%; vein-graft stent</li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary source: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose the age band.</li>
        <li>Check any factors that apply.</li>
        <li>Read the live total (−2 to 10).</li>
        <li>Share copies the page URL only—never clinical answers.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age ≥75 with no other factors → <strong>−2</strong>. Age &lt;65 with
        diabetes and smoking → <strong>2</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>No medication start/stop orders.</li>
        <li>Does not replace individualized cardiology assessment.</li>
        <li>Screenshot “past smoker” wording differs from Yeh’s past-year window.</li>
        <li>Answers are not stored or embedded in share URLs.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/cha2ds2-vasc-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CHA₂DS₂-VASc Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/abi-calculator-ankle-brachial-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ABI Calculator
          </Link>
        </li>
      </ul>

      <div id="dapt-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...DAPT_FAQS]} />
        </div>
      </div>
    </article>
  );
}
