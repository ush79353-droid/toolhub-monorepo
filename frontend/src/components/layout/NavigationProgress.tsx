'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const START_EVENT = 'navigation-progress-start';

/** Search and other router.push calls start the same bar as link clicks. */
export function startNavigationProgress(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(START_EVENT));
}

/** Same-document path the click would open, or null when the bar should stay hidden. */
export function navigationTarget(href: string, currentHref: string): string | null {
  let next: URL;
  let current: URL;
  try {
    next = new URL(href, currentHref);
    current = new URL(currentHref);
  } catch {
    return null;
  }
  if (next.origin !== current.origin) return null;
  if (next.pathname === current.pathname && next.search === current.search) return null;
  return next.pathname + next.search;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const route = `${pathname}?${search}`;
  const [width, setWidth] = useState(0);
  const routeRef = useRef(route);
  const shownRef = useRef(false);
  const pendingRef = useRef(false);
  const widthRef = useRef(0);
  const showTimer = useRef<number | null>(null);
  const trickleTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const stallTimer = useRef<number | null>(null);

  function clearTimers() {
    if (showTimer.current !== null) window.clearTimeout(showTimer.current);
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    if (stallTimer.current !== null) window.clearTimeout(stallTimer.current);
    if (trickleTimer.current !== null) window.clearInterval(trickleTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
    stallTimer.current = null;
    trickleTimer.current = null;
  }

  function finish() {
    pendingRef.current = false;
    clearTimers();
    if (!shownRef.current) {
      widthRef.current = 0;
      setWidth(0);
      return;
    }
    widthRef.current = 100;
    setWidth(100);
    hideTimer.current = window.setTimeout(() => {
      shownRef.current = false;
      widthRef.current = 0;
      setWidth(0);
    }, 200);
  }

  function begin() {
    clearTimers();
    pendingRef.current = true;
    showTimer.current = window.setTimeout(() => {
      if (!pendingRef.current) return;
      shownRef.current = true;
      widthRef.current = 16;
      setWidth(16);
      trickleTimer.current = window.setInterval(() => {
        const next = widthRef.current + Math.max(0.5, (90 - widthRef.current) * 0.08);
        widthRef.current = Math.min(next, 90);
        setWidth(widthRef.current);
      }, 200);
    }, 100);
    stallTimer.current = window.setTimeout(finish, 8000);
  }

  useEffect(() => {
    if (routeRef.current === route) return;
    routeRef.current = route;
    finish();
  }, [route]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (!navigationTarget(anchor.href, window.location.href)) return;
      begin();
    }
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', begin);
    window.addEventListener(START_EVENT, begin);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', begin);
      window.removeEventListener(START_EVENT, begin);
      clearTimers();
    };
  }, []);

  if (width === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5"
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
