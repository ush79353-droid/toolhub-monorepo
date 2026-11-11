'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  label: string;
  text: string;
  align?: 'left' | 'center' | 'right';
}

const ALIGN_CLASSES: Record<NonNullable<InfoTooltipProps['align']>, string> = {
  left: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-0',
};

/** Accessible keyboard-, hover-, and tap-friendly tooltip for financial input terms. */
export function InfoTooltip({ label, text, align = 'left' }: InfoTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();
  const wrapperRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Explain ${label}`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute bottom-full z-30 mb-2 w-56 max-w-[calc(100vw-2rem)] rounded-lg border border-accent bg-accent px-3 py-2 text-[11px] font-normal leading-relaxed text-white shadow-md ${ALIGN_CLASSES[align]}`}
        >
          {text}
        </span>
      )}
    </span>
  );
}
