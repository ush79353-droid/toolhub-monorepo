'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatAmount,
  fromCoulombs,
  fromJoules,
  fromVolts,
  shareResultText,
  solveRelation,
  toCoulombs,
  toJoules,
  toVolts,
} from './calculation';
import { emptyDraft, JoulesToVoltsForm, type JoulesToVoltsDraft } from './JoulesToVoltsForm';
import { JoulesToVoltsResults } from './JoulesToVoltsResults';
import type { JoulesToVoltsFieldErrors } from './types';
import { parseSignedInput } from './validation';

type BaseRefs = {
  energyJ: number | null;
  chargeC: number | null;
  voltageV: number | null;
};

export function JoulesToVoltsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<JoulesToVoltsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<JoulesToVoltsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const baseRef = React.useRef<BaseRefs>({ energyJ: null, chargeC: null, voltageV: null });
  const draftRef = React.useRef(draft);
  draftRef.current = draft;

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (incoming: JoulesToVoltsDraft) => {
    const prev = draftRef.current;
    let next = incoming;

    // Preserve physical quantity when only the display unit changes.
    if (next.energy === prev.energy && next.energyUnit !== prev.energyUnit) {
      let joules = baseRef.current.energyJ;
      if (joules == null && next.solveFor !== 'energy') {
        const parsed = parseSignedInput(prev.energy);
        if (parsed.value != null) joules = toJoules(parsed.value, prev.energyUnit);
      }
      if (joules != null) {
        next = { ...next, energy: formatAmount(fromJoules(joules, next.energyUnit)) };
        baseRef.current.energyJ = joules;
      }
    }
    if (next.charge === prev.charge && next.chargeUnit !== prev.chargeUnit) {
      let coulombs = baseRef.current.chargeC;
      if (coulombs == null && next.solveFor !== 'charge') {
        const parsed = parseSignedInput(prev.charge);
        if (parsed.value != null) coulombs = toCoulombs(parsed.value, prev.chargeUnit);
      }
      if (coulombs != null) {
        next = { ...next, charge: formatAmount(fromCoulombs(coulombs, next.chargeUnit)) };
        baseRef.current.chargeC = coulombs;
      }
    }
    if (next.voltage === prev.voltage && next.voltageUnit !== prev.voltageUnit) {
      let volts = baseRef.current.voltageV;
      if (volts == null && next.solveFor !== 'voltage') {
        const parsed = parseSignedInput(prev.voltage);
        if (parsed.value != null) volts = toVolts(parsed.value, prev.voltageUnit);
      }
      if (volts != null) {
        next = { ...next, voltage: formatAmount(fromVolts(volts, next.voltageUnit)) };
        baseRef.current.voltageV = volts;
      }
    }

    const err: JoulesToVoltsFieldErrors = {};

    const parseKnown = (
      raw: string,
      key: keyof JoulesToVoltsFieldErrors,
    ): { incomplete: boolean; value: number | null } => {
      const parsed = parseSignedInput(raw);
      if (parsed.blank) return { incomplete: false, value: null };
      if (parsed.incomplete) return { incomplete: true, value: null };
      if (parsed.value == null) {
        err[key] = parsed.error ?? 'Enter a valid finite number.';
        return { incomplete: false, value: null };
      }
      return { incomplete: false, value: parsed.value };
    };

    let energyJ: number | null = null;
    let chargeC: number | null = null;
    let voltageV: number | null = null;
    let incomplete = false;

    if (next.solveFor !== 'energy') {
      const p = parseKnown(next.energy, 'energy');
      incomplete = incomplete || p.incomplete;
      if (p.value != null) energyJ = toJoules(p.value, next.energyUnit);
    }
    if (next.solveFor !== 'charge') {
      const p = parseKnown(next.charge, 'charge');
      incomplete = incomplete || p.incomplete;
      if (p.value != null) chargeC = toCoulombs(p.value, next.chargeUnit);
    }
    if (next.solveFor !== 'voltage') {
      const p = parseKnown(next.voltage, 'voltage');
      incomplete = incomplete || p.incomplete;
      if (p.value != null) voltageV = toVolts(p.value, next.voltageUnit);
    }

    if (incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }

    if (Object.keys(err).length > 0) {
      setDraft(next);
      setErrors(err);
      setHasResult(false);
      return;
    }

    const solved = solveRelation({
      solveFor: next.solveFor,
      energyJ,
      chargeC,
      voltageV,
    });

    if (!solved.ok) {
      setDraft(next);
      setErrors(solved.field ? { [solved.field]: solved.error } : {});
      setHasResult(false);
      return;
    }

    baseRef.current = {
      energyJ: solved.energyJ,
      chargeC: solved.chargeC,
      voltageV: solved.voltageV,
    };

    const updated: JoulesToVoltsDraft = {
      ...next,
      energy:
        next.solveFor === 'energy'
          ? formatAmount(fromJoules(solved.energyJ, next.energyUnit))
          : next.energy,
      charge:
        next.solveFor === 'charge'
          ? formatAmount(fromCoulombs(solved.chargeC, next.chargeUnit))
          : next.charge,
      voltage:
        next.solveFor === 'voltage'
          ? formatAmount(fromVolts(solved.voltageV, next.voltageUnit))
          : next.voltage,
    };

    setDraft(updated);
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    baseRef.current = { energyJ: null, chargeC: null, voltageV: null };
    setDraft({ ...emptyDraft(), solveFor: draft.solveFor });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    baseRef.current = { energyJ: null, chargeC: null, voltageV: null };
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const payload = hasResult
    ? shareResultText({
        solveFor: draft.solveFor,
        energyDisplay: draft.energy || '—',
        energyUnit: draft.energyUnit,
        chargeDisplay: draft.charge || '—',
        chargeUnit: draft.chargeUnit,
        voltageDisplay: draft.voltage || '—',
        voltageUnit: draft.voltageUnit,
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
          <p className="text-xs font-normal text-muted-foreground">V = E / Q · E = VQ · Q = E / V</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <JoulesToVoltsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <JoulesToVoltsResults
            hasResult={hasResult}
            solveFor={draft.solveFor}
            energyDisplay={draft.energy}
            energyUnit={draft.energyUnit}
            chargeDisplay={draft.charge}
            chargeUnit={draft.chargeUnit}
            voltageDisplay={draft.voltage}
            voltageUnit={draft.voltageUnit}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
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
        </JoulesToVoltsForm>
      </div>
    </section>
  );
}
