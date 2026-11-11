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
 * Height-aware sticky sidebar wrapper:
 * - Disables sticky on mobile/tablet (< 1024px) and very short viewports (< 560px).
 * - Pins top below the 64px sticky site header when the calculator fits in the viewport.
 * - Uses bottom-pinned sticky offset when taller than the viewport so no nested scroll trap is created.
 * - Keeps keyboard-focused controls visible below the sticky site header.
 */

export function StickyCalculatorAside({
  ariaLabel,
  className = '',
  children,
}: StickyCalculatorAsideProps) {
  const asideRef = React.useRef<HTMLElement>(null);
  const baseStickyTopRef = React.useRef<number | null>(null);
  const focusTimerRef = React.useRef<number | null>(null);
  const [stickyTop, setStickyTop] = React.useState<number | null>(null);

  React.useEffect(() => {
    const element = asideRef.current;
    if (!element) return;

    const updateStickyPosition = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < MIN_DESKTOP_WIDTH || vh < MIN_STICKY_HEIGHT) {
        baseStickyTopRef.current = null;
        setStickyTop(null);
        return;
      }

      const asideHeight = element.offsetHeight;
      const available = vh - HEADER_OFFSET_PX - BOTTOM_MARGIN_PX;
      const nextTop =
        asideHeight <= available
          ? HEADER_OFFSET_PX
          : Math.round(vh - asideHeight - BOTTOM_MARGIN_PX);

      baseStickyTopRef.current = nextTop;
      setStickyTop((prev) => {
        if (prev === null || !element.contains(document.activeElement)) {
          return nextTop;
        }
        return Math.max(nextTop, Math.min(HEADER_OFFSET_PX, prev));
      });
    };

    updateStickyPosition();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateStickyPosition())
        : null;
    observer?.observe(element);
    window.addEventListener('resize', updateStickyPosition, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateStickyPosition);
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  const handleFocusCapture = (event: React.FocusEvent<HTMLElement>) => {
    const element = asideRef.current;
    const target = event.target as HTMLElement | null;
    if (!element || !target || !element.contains(target)) return;

    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = window.setTimeout(() => {
      focusTimerRef.current = null;
      const rect = target.getBoundingClientRect();
      const asideRect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      const baseTop = baseStickyTopRef.current;

      if (baseTop !== null && baseTop < HEADER_OFFSET_PX) {
        if (rect.top < HEADER_OFFSET_PX) {
          const offsetFromAsideTop = rect.top - asideRect.top;
          const desiredTop = Math.min(
            HEADER_OFFSET_PX,
            Math.round(HEADER_OFFSET_PX - offsetFromAsideTop)
          );
          setStickyTop(desiredTop);
          return;
        }
        if (rect.bottom > vh - BOTTOM_MARGIN_PX) {
          const offsetBottomFromAsideTop = rect.bottom - asideRect.top;
          const desiredTop = Math.max(
            baseTop,
            Math.round(vh - BOTTOM_MARGIN_PX - offsetBottomFromAsideTop)
          );
          setStickyTop(desiredTop);
          return;
        }
      }

      if (rect.top < HEADER_OFFSET_PX) {
        window.scrollBy({ top: rect.top - HEADER_OFFSET_PX - 12, behavior: 'smooth' });
      } else if (rect.bottom > vh - BOTTOM_MARGIN_PX) {
        window.scrollBy({
          top: rect.bottom - (vh - BOTTOM_MARGIN_PX),
          behavior: 'smooth',
        });
      }
    }, 16);
  };

  const handleBlurCapture = (event: React.FocusEvent<HTMLElement>) => {
    const element = asideRef.current;
    const nextFocused = event.relatedTarget as Node | null;
    if (
      element &&
      baseStickyTopRef.current !== null &&
      (!nextFocused || !element.contains(nextFocused))
    ) {
      setStickyTop(baseStickyTopRef.current);
    }
  };

  return (
    <aside
      ref={asideRef}
      aria-label={ariaLabel}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      style={
        stickyTop !== null
          ? { position: 'sticky', top: `${stickyTop}px` }
          : undefined
      }
      className={className}
    >
      {children}
    </aside>
  );
}

