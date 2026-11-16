'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  DEFAULT_QUANTITY,
  DEFAULT_SI,
  QUANTITIES,
  type CgsFieldErrors,
} from './types';
import { cgsToSi, formatAmount, shareResultText, siToCgs } from './calculation';
import {
  CgsSystemForm,
  defaultDraft,
  emptyDraft,
  type CgsSystemDraft,
} from './CgsSystemForm';
import { CgsSystemResults } from './CgsSystemResults';
import { parseAmountInput } from './validation';

export function CgsSystemOfUnitsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CgsSystemDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CgsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const siRef = React.useRef<number | null>(DEFAULT_SI);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CgsSystemDraft) => {
    // Quantity change: clear values (handled by form emptyDraft).
    if (next.quantity !== draft.quantity && next.activeField == null) {
      siRef.current = null;
      setDraft(next);
      setErrors({});
      setHasResult(false);
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = field === 'si' ? next.si : next.cgs;
    const parsed = parseAmountInput(source);
    if (parsed.blank) {
      siRef.current = null;
      setDraft({ ...next, si: field === 'si' ? source : '', cgs: field === 'cgs' ? source : '' });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      siRef.current = null;
      return;
    }

    const si = field === 'si' ? parsed.value : cgsToSi(parsed.value, next.quantity);
    const cgs = field === 'cgs' ? parsed.value : siToCgs(si, next.quantity);
    siRef.current = si;
    setDraft({
      ...next,
      si: field === 'si' ? source : formatAmount(si),
      cgs: field === 'cgs' ? source : formatAmount(cgs),
    });
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      siRef.current = DEFAULT_SI;
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      siRef.current = null;
      setDraft(emptyDraft(draft.quantity));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const def = QUANTITIES[draft.quantity];
  const si = siRef.current;
  const siLine = hasResult && si != null ? `${formatAmount(si)} ${def.siUnit}` : null;
  const cgsLine =
    hasResult && si != null ? `${formatAmount(siToCgs(si, draft.quantity))} ${def.cgsUnit}` : null;
  const payload =
    hasResult && si != null
      ? shareResultText({
          quantity: draft.quantity,
          si: formatAmount(si),
          cgs: formatAmount(siToCgs(si, draft.quantity)),
        })
      : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            CGS ↔ SI · default {QUANTITIES[DEFAULT_QUANTITY].label}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CgsSystemForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'si' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <CgsSystemResults
            quantityLabel={def.label}
            siLine={siLine}
            cgsLine={cgsLine}
            formula={def.formula}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </CgsSystemForm>
      </div>
    </section>
  );
}
