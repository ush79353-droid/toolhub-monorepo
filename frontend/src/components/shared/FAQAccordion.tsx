'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border bg-white shadow-xs transition-colors"
          >
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
            >
              <span className="text-[15px] font-semibold leading-snug text-accent sm:text-base">
                {item.question}
              </span>
              <div
                className={cn(
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition-transform duration-200',
                  isOpen && 'rotate-180 bg-primary text-white'
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border/60 bg-white px-5 pb-4 pt-3 animate-in fade-in duration-200">
                <p className="text-[15px] font-normal leading-[1.7] text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
