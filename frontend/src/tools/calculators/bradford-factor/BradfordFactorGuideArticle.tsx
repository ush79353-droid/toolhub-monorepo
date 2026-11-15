import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BRADFORD_FACTOR_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-is-bradford-factor',
    title: 'What Is the Bradford Factor?',
    body: [
      'The Bradford Factor measures the impact of absence patterns by giving more weight to frequent short absences than to fewer longer ones. HR teams use it as a screening signal, not a medical diagnosis or automatic disciplinary outcome.',
    ],
  },
  {
    id: 'bradford-formula',
    title: 'Bradford Factor Formula',
    body: [
      'B is spells squared times total days absent. Spells (S) are the number of separate absence episodes. Days (D) are the total calendar or working days missed in the same period.',
    ],
    formula: 'B = S × S × D',
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate',
    body: [
      'Enter the number of times absent and the total days absent. The calculator updates B automatically when both inputs are valid non-negative numbers. Negative values are rejected; zeros are allowed and produce B = 0.',
    ],
  },
  {
    id: 'bradford-examples',
    title: 'Examples',
    body: [
      'S = 4 and D = 12 → B = 4 × 4 × 12 = 192.',
      'One spell of 12 days: S = 1, D = 12 → B = 12. The same total days with four short spells yields a much higher score.',
    ],
  },
  {
    id: 'how-to-interpret',
    title: 'How to Interpret Scores',
    body: [
      'Compare scores within your own policy and period length. A high figure flags frequent disruption; a low figure can still hide long continuous absences. Always review context before acting on the number alone.',
    ],
  },
];

export function BradfordFactorGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="bradford-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BRADFORD_FACTOR_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
