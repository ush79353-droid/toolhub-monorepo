import { inlineNodes } from '@/components/tools/inline-text';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

export type FAQAccordionProps = {
  className?: string;
} & (
  | { items: readonly FAQItem[]; faqs?: never }
  | { faqs: readonly FAQItem[]; items?: never }
);

/** Accepts `items` (canonical) or legacy `faqs` alias used by many guide articles. */
export function FAQAccordion({
  items,
  faqs,
  className = '',
}: FAQAccordionProps) {
  const list = items ?? faqs ?? [];

  return (
    <div className={cn('divide-y divide-border', className)}>
      {list.map((item, index) => (
        <div key={index} className="py-4 first:pt-0 last:pb-0">
          <h3 className="text-[15px] font-semibold leading-snug text-accent sm:text-base">
            {inlineNodes(item.question, `q-${index}`)}
          </h3>
          <p className="mt-2 text-[15px] font-normal leading-[1.7] text-foreground/85">
            {inlineNodes(item.answer, `a-${index}`)}
          </p>
        </div>
      ))}
    </div>
  );
}
