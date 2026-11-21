import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FAQS } from './content';

export function MaintainPregnancyWeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        How to Maintain or Lose Weight During Pregnancy?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Most pregnancies need gradual weight gain, not weight loss. This page
        pairs CDC/IOM educational gain ranges with plain-language guidance so you
        can talk with your clinician about healthy trends—not crash diets.
      </p>
      <h2 id="what-it-shows" className="mt-8 text-lg font-bold text-accent">What This Tool Shows</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter pre-pregnancy height and weight to get BMI, then choose gestational
        week and singleton vs twins. The calculator returns educational minimum and
        maximum recommended cumulative gain and absolute weight for that week.
      </p>
      <h2 id="iom" className="mt-8 text-lg font-bold text-accent">IOM Gain Ranges</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total recommended gain depends on pre-pregnancy BMI category. Week values
        scale that total by week ÷ 40 for a simple cumulative schedule.
      </p>
      <h2 id="how-to-use" className="mt-8 text-lg font-bold text-accent">How to Use</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>Enter height and weight from before pregnancy.</li>
        <li>Confirm the calculated BMI category.</li>
        <li>Set pregnancy week and whether you are expecting twins.</li>
        <li>Read the educational min/max weight and gain fields.</li>
      </ol>
      <h2 id="not-weight-loss" className="mt-8 text-lg font-bold text-accent">Not a Weight-Loss Plan</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The page title reflects common search questions, but the calculator does
        not prescribe calorie deficits or restrictive menus. If weight concerns
        arise, ask a qualified clinician or registered dietitian.
      </p>
      <div id="faq" className="mt-10">
        <h2 className="text-lg font-bold text-accent">Frequently Asked Questions</h2>
        <div className="mt-4"><FAQAccordion faqs={[...FAQS]} /></div>
      </div>
    </article>
  );
}
