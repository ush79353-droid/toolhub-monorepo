'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { ToolContributor, ToolCredits } from '@/tools/page-detail';

function cardStyle(anchor: HTMLElement): React.CSSProperties {
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(360, window.innerWidth - 16);
  const right = rect.right + 12;
  if (right + width <= window.innerWidth - 8) {
    return { position: 'fixed', top: Math.max(8, rect.top), left: right, width, zIndex: 50 };
  }
  const left = rect.left - width - 12;
  if (left >= 8) {
    return { position: 'fixed', top: Math.max(8, rect.top), left, width, zIndex: 50 };
  }
  return {
    position: 'fixed',
    top: rect.bottom + 8,
    left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
    width,
    zIndex: 50,
  };
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function Avatar({ person, className }: { person: ToolContributor; className: string }) {
  if (person.imageUrl) {
    // Contributor photos are remote catalog URLs, same as other tool media.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={person.imageUrl} alt="" className={`${className} object-cover`} />;
  }
  return (
    <span className={`${className} inline-flex items-center justify-center bg-primary/10 font-semibold text-primary`}>
      {initials(person.name)}
    </span>
  );
}

function PersonCard({
  person,
  editorialPolicyHref="/privacy-policy",
  open,
  cardId,
  anchorRef,
  cardRef,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  person: ToolContributor;
  editorialPolicyHref: string;
  open: boolean;
  cardId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const [style, setStyle] = React.useState<React.CSSProperties>({ position: 'fixed' });

  React.useEffect(() => {
    if (!open) return;
    const place = () => {
      if (anchorRef.current) setStyle(cardStyle(anchorRef.current));
    };
    place();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div ref={cardRef} style={style} onMouseEnter={onPointerEnter} onMouseLeave={onPointerLeave}>
      <div
        id={cardId}
        role="dialog"
        aria-label={person.name}
        className="rounded-xl border border-border bg-white p-4 shadow-lg"
      >
      <div className="flex items-center gap-3">
        <Avatar person={person} className="h-16 w-16 shrink-0 rounded-full text-lg" />
        <div className="min-w-0">
              <p className="font-sans text-base font-semibold text-accent">{person.name}</p>
              {person.designation ? (
                <p className="text-sm text-muted-foreground">{person.designation}</p>
              ) : null}
          {person.linkedInUrl ? (
            <a
              href={person.linkedInUrl}
              className="text-sm font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{person.bio}</p>
      {person.profileHref ? (
        <Link href={person.profileHref} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          See full profile
        </Link>
      ) : null}
      <p className="mt-2 text-sm text-muted-foreground">
        Check our{' '}
        <Link href={editorialPolicyHref} className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>.
      </p>
      </div>
    </div>,
    document.body,
  );
}

function NameButton({
  person,
  pressed,
  controls,
  onOpen,
}: {
  person: ToolContributor;
  pressed: boolean;
  controls: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="text-sm font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      aria-expanded={pressed}
      aria-controls={controls}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
    >
      {person.name}
    </button>
  );
}

export function ToolContributors({ credits }: { credits: ToolCredits }) {
  const people = [
    ...credits.creators.map((person) => ({ person, group: 'creator' as const })),
    ...credits.reviewers.map((person) => ({ person, group: 'reviewer' as const })),
  ];
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<number | null>(null);
  const cardId = React.useId();
  const portrait = credits.creators[0] ?? credits.reviewers[0];

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 160);
  }, [cancelClose]);

  React.useEffect(() => {
    if (!openKey) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || cardRef.current?.contains(target)) return;
      setOpenKey(null);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [openKey]);

  if (!portrait) return null;

  const keyFor = (group: 'creator' | 'reviewer', name: string) => `${group}:${name}`;

  return (
    <section
      ref={rootRef}
      aria-label="Tool contributors"
      className="relative flex flex-row-reverse items-start gap-3 text-right"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <Avatar person={portrait} className="mt-0.5 h-10 w-10 shrink-0 rounded-full text-xs ring-2 ring-primary/30" />
      <div className="min-w-0 space-y-2.5">
        {credits.creators.length > 0 ? (
          <div>
            <p className="text-[13px] leading-none text-muted-foreground">Creators</p>
            <ul className="mt-1 space-y-0.5">
              {credits.creators.map((person) => {
                const key = keyFor('creator', person.name);
                return (
                  <li key={key}>
                    <NameButton
                      person={person}
                      pressed={openKey === key}
                      controls={cardId}
                      onOpen={() => setOpenKey(key)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {credits.reviewers.length > 0 ? (
          <div>
            <p className="text-[13px] leading-none text-muted-foreground">Reviewers</p>
            <ul className="mt-1 space-y-0.5">
              {credits.reviewers.map((person) => {
                const key = keyFor('reviewer', person.name);
                return (
                  <li key={key}>
                    <NameButton
                      person={person}
                      pressed={openKey === key}
                      controls={cardId}
                      onOpen={() => setOpenKey(key)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      {people.map(({ person, group }) => (
        <PersonCard
          key={keyFor(group, person.name)}
          person={person}
          editorialPolicyHref={credits.editorialPolicyHref}
          open={openKey === keyFor(group, person.name)}
          cardId={cardId}
          anchorRef={rootRef}
          cardRef={cardRef}
          onClose={() => setOpenKey(null)}
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
        />
      ))}
    </section>
  );
}
