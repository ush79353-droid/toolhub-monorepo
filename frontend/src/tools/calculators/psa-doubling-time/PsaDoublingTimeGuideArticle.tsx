import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PSA_DT_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function PsaDoublingTimeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="psa-dt-how-to-use"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How to use the PSA DT calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the date and PSA level (ng/mL) for an older and a newer blood
        test. The tool computes PSA doubling time when the newer value is higher
        than the older value. Optionally show absolute PSA velocity and
        natural-log slope per year.
      </p>

      <h2
        id="psa-dt-interpreting"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpreting your PSA doubling time
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PSA doubling time (PSADT) describes how quickly serial PSA is rising.
        Shorter doubling times have been studied in active surveillance and
        biochemical recurrence contexts. This calculator reports the numeric
        result only — it does not assign risk bands or recommend biopsy or
        treatment.
      </p>

      <h2
        id="psa-dt-what-is-psa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is PSA, and why do we bother with PSA doubling time?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prostate-specific antigen (PSA) is measured in blood as ng/mL. Elevated
        or rising PSA can occur in benign conditions and in prostate cancer.
        PSADT is one kinetic adjunct when comparing two measurements — not a
        stand-alone diagnosis.
      </p>

      <h2
        id="psa-dt-prostate-cancer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Prostate cancer and PSA DT info
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published doubling-time formulas use exponential growth: DT = Δt × ln(2) /
        ln(PSA₂/PSA₁) with calendar Δt between test dates. {SOURCE_LABEL}
      </p>

      <h2
        id="psa-dt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FAQs
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...PSA_DT_FAQS]} />
      </div>
    </article>
  );
}