'use client';

import * as React from 'react';

const HEADER_OFFSET_PX = 84;
const BOTTOM_MARGIN_PX = 20;
const MIN_DESKTOP_WIDTH = 1024;
const MIN_STICKY_HEIGHT = 560;

interface StickyCalculatorAsideProps {
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Viewport-capped sticky calculator panel:
 * - Sticky only on desktop (>= 1024px) with enough viewport height.
 * - Caps panel height to the visible area under the site header.
 * - Scrolls internally when inputs / results / amortization expand past that height,
 *   so users do not need to scroll the whole page to reach the table.
 * - Uses overscroll-contain to avoid scroll chaining into the page.
 */
export function StickyCalculatorAside({
  ariaLabel,
  className = '',
  children,
}: StickyCalculatorAsideProps) {
  const asideRef = React.useRef<HTMLElement>(null);
  const focusTimerRef = React.useRef<number | null>(null);
  const [stickyEnabled, setStickyEnabled] = React.useState(false);
  const [maxHeightPx, setMaxHeightPx] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < MIN_DESKTOP_WIDTH || vh < MIN_STICKY_HEIGHT) {
        setStickyEnabled(false);
        setMaxHeightPx(null);
        return;
      }

      setStickyEnabled(true);
      setMaxHeightPx(Math.max(320, vh - HEADER_OFFSET_PX - BOTTOM_MARGIN_PX));
    };

    updateLayout();
    window.addEventListener('resize', updateLayout, { passive: true });
    return () => {
      window.removeEventListener('resize', updateLayout);
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  const handleFocusCapture = (event: React.FocusEvent<HTMLElement>) => {
    if (!stickyEnabled) return;
    const target = event.target as HTMLElement | null;
    const element = asideRef.current;
    if (!target || !element || !element.contains(target)) return;

    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = window.setTimeout(() => {
      focusTimerRef.current = null;
      target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, 16);
  };

  return (
    <aside
      ref={asideRef}
      aria-label={ariaLabel}
      onFocusCapture={handleFocusCapture}
      style={
        stickyEnabled && maxHeightPx !== null
          ? {
              position: 'sticky',
              top: `${HEADER_OFFSET_PX}px`,
              maxHeight: `${maxHeightPx}px`,
            }
          : undefined
      }
      className={[
        className,
        stickyEnabled
          ? 'overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </aside>
  );
}
