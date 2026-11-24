import type { ReactNode } from 'react';

interface GuideSectionHeadingProps {
  children: ReactNode;
  className?: string;
}

/** Shared h2 for calculator guide sections (id lives on the parent `<section>`). */
export function GuideSectionHeading({
  children,
  className = '',
}: GuideSectionHeadingProps) {
  return (
    <h2
      className={`text-lg font-bold tracking-tight text-accent sm:text-xl${className ? ` ${className}` : ''}`}
    >
      {children}
    </h2>
  );
}
