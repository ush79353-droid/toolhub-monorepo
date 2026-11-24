import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VITAMIN_D_FAQS } from './content';

export function VitaminDGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Vitamin D Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Look up educational vitamin D dietary reference intakes by age and,
        optionally, compare an entered serum 25(OH)D value to published NIH ODS
        status bands. The tool never invents a treatment dose from a lab result
        alone.
      </p>

      <h2
        id="dri-vs-serum"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DRI vs serum 25(OH)D
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age drives the IOM / NIH ODS AI or RDA row (mcg/day and IU/day). Choosing
        Yes for serum knowledge reveals 25(OH)D with ng/mL or nmol/L units; that
        path cites Table 1 status wording only. The two tracks stay separate so a
        serum number cannot silently become a milligram prescription.
      </p>

      <h2
        id="sources"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Primary sources
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NIH Office of Dietary Supplements Vitamin D Fact Sheet for Health
        Professionals (DRI Table 2; serum 25(OH)D Table 1; 1 mcg = 40 IU; 1 ng/mL
        = 2.5 nmol/L); Dietary Reference Intakes for Calcium and Vitamin D (IOM
        2011), including Tolerable Upper Intake Levels cited for context.
      </p>

      <div id="vitamin-d-faq" className="not-prose mt-8">
        <FAQAccordion items={VITAMIN_D_FAQS} />
      </div>
    </article>
  );
}
