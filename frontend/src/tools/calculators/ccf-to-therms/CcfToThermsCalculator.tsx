'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  DEFAULT_CCF,
  DEFAULT_FACTOR,
  type CcfToThermsFieldErrors,
} from './types';
import {
  ccfToTherms,
  factorFromHeating,
  formatAmount,
  heatingFromFactor,
  shareResultText,
  thermsToCcf,
} from './calculation';
import {
  CcfToThermsForm,
  defaultDraft,
  emptyDraft,
  type CcfToThermsDraft,
} from './CcfToThermsForm';
import { CcfToThermsResults } from './CcfToThermsResults';
import {
  parseAmountInput,
  validateNonNegative,
  validatePositive,
} from './validation';

function draftFromCcf(
  ccf: number,
  factor: number,
  preserve: { field: CcfToThermsDraft['activeField']; text: string } | null,
  factorOpen: boolean,
  primaryField: 'ccf' | 'therms',
): CcfToThermsDraft {
  const therms = ccfToTherms(ccf, factor);
  return {
    ccf: preserve?.field === 'ccf' ? preserve.text : formatAmount(ccf),
    therms: preserve?.field === 'therms' ? preserve.text : formatAmount(therms),
    factor: preserve?.field === 'factor' ? preserve.text : formatAmount(factor),
    heating: preserve?.field === 'heating' ? preserve.text : formatAmount(heatingFromFactor(factor)),
    factorOpen,
    activeField: preserve?.field ?? null,
    primaryField,
  };
}

export function CcfToThermsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CcfToThermsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CcfToThermsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const ccfRef = React.useRef<number | null>(DEFAULT_CCF);
  const factorRef = React.useRef(DEFAULT_FACTOR);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CcfToThermsDraft) => {
    if (
      next.factorOpen !== draft.factorOpen &&
      next.ccf === draft.ccf &&
      next.therms === draft.therms &&
      next.factor === draft.factor &&
      next.heating === draft.heating
    ) {
      setDraft(next);
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    if (field === 'factor' || field === 'heating') {
      const source = field === 'factor' ? next.factor : next.heating;
      const parsed = parseAmountInput(source);
      if (parsed.blank) {
        setDraft(next);
        setErrors({ [field]: 'Enter a value greater than zero.' });
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
        return;
      }
      const positiveError = validatePositive(parsed.value);
      if (positiveError) {
        setDraft(next);
        setErrors({ [field]: positiveError });
        return;
      }

      const factor = field === 'factor' ? parsed.value : factorFromHeating(parsed.value);
      factorRef.current = factor;

      const primary = next.primaryField;
      const primaryRaw = primary === 'ccf' ? next.ccf : next.therms;
      const primaryParsed = parseAmountInput(primaryRaw);
      if (primaryParsed.blank || primaryParsed.incomplete || primaryParsed.value == null) {
        setDraft({
          ...next,
          factor: field === 'factor' ? source : formatAmount(factor),
          heating: field === 'heating' ? source : formatAmount(heatingFromFactor(factor)),
          activeField: field,
        });
        setErrors({});
        setHasResult(false);
        ccfRef.current = null;
        return;
      }
      const nonNeg = validateNonNegative(primaryParsed.value);
      if (nonNeg) {
        setDraft(next);
        setErrors({ [primary]: nonNeg });
        setHasResult(false);
        return;
      }

      const ccf =
        primary === 'ccf' ? primaryParsed.value : thermsToCcf(primaryParsed.value, factor);
      ccfRef.current = ccf;
      setDraft(
        draftFromCcf(
          ccf,
          factor,
          { field, text: source },
          next.factorOpen,
          primary,
        ),
      );
      setErrors({});
      setHasResult(true);
      return;
    }

    const source = field === 'ccf' ? next.ccf : next.therms;
    const parsed = parseAmountInput(source);
    if (parsed.blank) {
      ccfRef.current = null;
      setDraft({
        ...emptyDraft(true),
        factor: next.factor,
        heating: next.heating,
        factorOpen: next.factorOpen,
        activeField: field,
        primaryField: field,
      });
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
      ccfRef.current = null;
      return;
    }
    const nonNeg = validateNonNegative(parsed.value);
    if (nonNeg) {
      setDraft(next);
      setErrors({ [field]: nonNeg });
      setHasResult(false);
      ccfRef.current = null;
      return;
    }

    const factorParsed = parseAmountInput(next.factor);
    let factor = factorRef.current > 0 ? factorRef.current : DEFAULT_FACTOR;
    if (
      factorParsed.value != null &&
      validatePositive(factorParsed.value) == null
    ) {
      factor = factorParsed.value;
      factorRef.current = factor;
    }

    const ccf = field === 'ccf' ? parsed.value : thermsToCcf(parsed.value, factor);
    ccfRef.current = ccf;
    setDraft(
      draftFromCcf(ccf, factor, { field, text: source }, next.factorOpen, field),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      ccfRef.current = DEFAULT_CCF;
      factorRef.current = DEFAULT_FACTOR;
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      ccfRef.current = null;
      factorRef.current = DEFAULT_FACTOR;
      setDraft(emptyDraft(true));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const ccf = ccfRef.current;
  const factor = factorRef.current;
  const shownCcf = hasResult && ccf != null ? formatAmount(ccf) : null;
  const shownTherms =
    hasResult && ccf != null ? formatAmount(ccfToTherms(ccf, factor)) : null;
  const shownFactor = hasResult ? formatAmount(factor) : null;
  const shownHeating = hasResult ? formatAmount(heatingFromFactor(factor)) : null;
  const payload =
    shownCcf && shownTherms && shownFactor && shownHeating
      ? shareResultText({
          ccf: shownCcf,
          therms: shownTherms,
          factor: shownFactor,
          heating: shownHeating,
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
            CCF · therms · illustrative factor 1.038
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CcfToThermsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'ccf' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <CcfToThermsResults
            ccf={shownCcf}
            therms={shownTherms}
            factor={shownFactor}
            heating={shownHeating}
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
        </CcfToThermsForm>
      </div>
    </section>
  );
}
