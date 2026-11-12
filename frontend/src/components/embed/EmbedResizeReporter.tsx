'use client';

import * as React from 'react';
import { EMBED_MESSAGE_SOURCE } from '@/lib/embed/tool-embed';

interface EmbedResizeReporterProps {
  embedId: string;
  children: React.ReactNode;
}

/**
 * Posts height to the parent window for optional auto-resize hosts.
 * Uses an explicit namespace + embedId; never executes received messages.
 */
export function EmbedResizeReporter({ embedId, children }: EmbedResizeReporterProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const lastSent = React.useRef(0);
  const rafPending = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('embedId') || embedId;
    if (!id) return;

    const postHeight = (height: number) => {
      const next = Math.ceil(height);
      if (Math.abs(next - lastSent.current) < 2) return;
      lastSent.current = next;
      window.parent.postMessage(
        {
          source: EMBED_MESSAGE_SOURCE,
          type: 'resize',
          embedId: id,
          height: next,
        },
        '*'
      );
      // ponytail: targetOrigin '*' required for unknown host pages; payload is non-sensitive height only.
    };

    const measure = () => {
      const el = rootRef.current;
      if (!el) return;
      const height = Math.max(el.scrollHeight, el.getBoundingClientRect().height);
      postHeight(height + 8);
    };

    const schedule = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      window.requestAnimationFrame(() => {
        rafPending.current = false;
        measure();
      });
    };

    measure();
    window.parent.postMessage(
      { source: EMBED_MESSAGE_SOURCE, type: 'ready', embedId: id },
      '*'
    );

    const observer = new ResizeObserver(schedule);
    if (rootRef.current) observer.observe(rootRef.current);
    window.addEventListener('load', schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', schedule);
    };
  }, [embedId]);

  return (
    <div ref={rootRef} data-omega-embed-root={embedId}>
      {children}
    </div>
  );
}
