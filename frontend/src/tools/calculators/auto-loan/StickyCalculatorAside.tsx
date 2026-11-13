'use client';

import * as React from 'react';

interface StickyCalculatorAsideProps {
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Calculator column landmark.
 * Renders in normal document flow so the tool page scrolls as one unit
 * (no sticky pinning, no independent overflow scroll).
 */
export function StickyCalculatorAside({
  ariaLabel,
  className = '',
  children,
}: StickyCalculatorAsideProps) {
  return (
    <aside aria-label={ariaLabel} className={className}>
      {children}
    </aside>
  );
}
