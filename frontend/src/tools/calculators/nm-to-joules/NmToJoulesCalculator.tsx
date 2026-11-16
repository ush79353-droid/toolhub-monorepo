'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { NmToJoulesFieldErrors } from './types';
import { calculateWork, formatAmount, shareResultText } from './calculation';
import {
  NmToJoulesForm,
  defaultDraft,
  emptyDraft,
  type ActiveNmField,
  type NmToJoulesDraft,
} from './NmToJoulesForm';
import { NmToJoulesResults } from './NmToJoulesResults';
import { parseAmountInput } from './validation';

function isForceField(field: ActiveNmField): field is 'newtons' | 'joulesPerMeter' {
  return field === 'newtons' || field === 'joulesPerMeter';
}

function isEnergyField(field: ActiveNmField): field is 'joules' | 'newtonMeters' {
  return field === 'joules' || field === 'newtonMeters';
}

function isWorkField(field: ActiveNmField): field is 'force' | 'distance' | 'angle' | 'work' {
  return field === 'force' || field === 'distance' || field === 'angle' || field === 'work';
}

export function NmToJoulesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NmToJoulesDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NmToJoulesFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: NmToJoulesDraft) => {
    if (
      (next.forceOpen !== draft.forceOpen ||
        next.energyOpen !== draft.energyOpen ||
        next.workOpen !== draft.workOpen) &&
      next.newtons === draft.newtons &&
      next.joulesPerMeter === draft.joulesPerMeter &&
      next.joules === draft.joules &&
      next.newtonMeters === draft.newtonMeters &&
      next.workForce === draft.workForce &&
      next.workDistance === draft.workDistance &&
      next.workAngle === draft.workAngle &&
      next.workResult === draft.workResult
    ) {
      setDraft(next);
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    if (isForceField(field)) {
      const source = field === 'newtons' ? next.newtons : next.joulesPerMeter;
      const parsed = parseAmountInput(source);
      if (parsed.blank) {
        setDraft({
          ...next,
          newtons: field === 'newtons' ? source : '',
          joulesPerMeter: field === 'joulesPerMeter' ? source : '',
        });
        setErrors((prev) => ({ ...prev, newtons: undefined, joulesPerMeter: undefined }));
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors((prev) => ({ ...prev, newtons: undefined, joulesPerMeter: undefined }));
        return;
      }
      if (parsed.value == null) {
        setDraft(next);
        setErrors((prev) => ({ ...prev, [field]: parsed.error }));
        return;
      }
      const formatted = formatAmount(parsed.value);
      setDraft({
        ...next,
        newtons: field === 'newtons' ? source : formatted,
        joulesPerMeter: field === 'joulesPerMeter' ? source : formatted,
      });
      setErrors((prev) => ({ ...prev, newtons: undefined, joulesPerMeter: undefined }));
      return;
    }

    if (isEnergyField(field)) {
      const source = field === 'joules' ? next.joules : next.newtonMeters;
      const parsed = parseAmountInput(source);
      if (parsed.blank) {
        setDraft({
          ...next,
          joules: field === 'joules' ? source : '',
          newtonMeters: field === 'newtonMeters' ? source : '',
        });
        setErrors((prev) => ({ ...prev, joules: undefined, newtonMeters: undefined }));
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors((prev) => ({ ...prev, joules: undefined, newtonMeters: undefined }));
        return;
      }
      if (parsed.value == null) {
        setDraft(next);
        setErrors((prev) => ({ ...prev, [field]: parsed.error }));
        return;
      }
      const formatted = formatAmount(parsed.value);
      setDraft({
        ...next,
        joules: field === 'joules' ? source : formatted,
        newtonMeters: field === 'newtonMeters' ? source : formatted,
      });
      setErrors((prev) => ({ ...prev, joules: undefined, newtonMeters: undefined }));
      return;
    }

    if (isWorkField(field)) {
      if (field === 'work') {
        const workParsed = parseAmountInput(next.workResult);
        const dParsed = parseAmountInput(next.workDistance);
        const aParsed = parseAmountInput(next.workAngle);
        if (workParsed.blank || workParsed.incomplete) {
          setDraft(next);
          return;
        }
        if (workParsed.value == null) {
          setDraft(next);
          setErrors((prev) => ({ ...prev, work: workParsed.error }));
          return;
        }
        if (
          dParsed.value == null ||
          aParsed.value == null ||
          !Number.isFinite(dParsed.value) ||
          !Number.isFinite(aParsed.value)
        ) {
          setDraft(next);
          setErrors((prev) => ({
            ...prev,
            work: 'Enter displacement and angle to solve for force.',
          }));
          return;
        }
        const cos = Math.cos((aParsed.value * Math.PI) / 180);
        if (Math.abs(cos) < 1e-15 || Math.abs(dParsed.value) < 1e-15) {
          setDraft(next);
          setErrors((prev) => ({
            ...prev,
            work: 'Cannot solve for force when d cos(θ) is zero.',
          }));
          return;
        }
        const force = workParsed.value / (dParsed.value * cos);
        setDraft({
          ...next,
          workForce: formatAmount(force),
          workResult: next.workResult,
        });
        setErrors((prev) => ({
          ...prev,
          force: undefined,
          distance: undefined,
          angle: undefined,
          work: undefined,
        }));
        return;
      }

      const fParsed = parseAmountInput(next.workForce);
      const dParsed = parseAmountInput(next.workDistance);
      const aParsed = parseAmountInput(next.workAngle);

      // Preserve typing in the active field even if incomplete.
      if (
        (field === 'force' && fParsed.incomplete) ||
        (field === 'distance' && dParsed.incomplete) ||
        (field === 'angle' && aParsed.incomplete)
      ) {
        setDraft(next);
        return;
      }

      const nextErrors: NmToJoulesFieldErrors = {};
      if (!fParsed.blank && fParsed.value == null) nextErrors.force = fParsed.error;
      if (!dParsed.blank && dParsed.value == null) nextErrors.distance = dParsed.error;
      if (!aParsed.blank && aParsed.value == null) nextErrors.angle = aParsed.error;

      if (
        fParsed.value != null &&
        dParsed.value != null &&
        aParsed.value != null &&
        Object.keys(nextErrors).length === 0
      ) {
        const work = calculateWork(fParsed.value, dParsed.value, aParsed.value);
        setDraft({
          ...next,
          workForce: field === 'force' ? next.workForce : formatAmount(fParsed.value),
          workDistance: field === 'distance' ? next.workDistance : formatAmount(dParsed.value),
          workAngle: field === 'angle' ? next.workAngle : formatAmount(aParsed.value),
          workResult: formatAmount(work),
        });
        setErrors((prev) => ({
          ...prev,
          force: undefined,
          distance: undefined,
          angle: undefined,
          work: undefined,
        }));
        return;
      }

      setDraft({ ...next, workResult: '' });
      setErrors((prev) => ({ ...prev, ...nextErrors, work: undefined }));
    }
  };

  const clearAll = (reload: boolean) => {
    setDraft(reload ? defaultDraft() : emptyDraft());
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const forceParsed = parseAmountInput(draft.newtons);
  const energyParsed = parseAmountInput(draft.joules);
  const workParsed = parseAmountInput(draft.workResult);

  const forceLine =
    forceParsed.value != null
      ? `${formatAmount(forceParsed.value)} N = ${formatAmount(forceParsed.value)} J/m`
      : null;
  const energyLine =
    energyParsed.value != null
      ? `${formatAmount(energyParsed.value)} J = ${formatAmount(energyParsed.value)} N·m`
      : null;
  const workLine =
    workParsed.value != null && draft.workForce && draft.workDistance
      ? `W = ${draft.workForce} N × ${draft.workDistance} m × cos(${draft.workAngle || '0'}°) = ${formatAmount(workParsed.value)} J`
      : null;

  const shareParts: Parameters<typeof shareResultText>[0] = {};
  if (forceParsed.value != null) {
    shareParts.force = {
      newtons: formatAmount(forceParsed.value),
      jpm: formatAmount(forceParsed.value),
    };
  }
  if (energyParsed.value != null) {
    shareParts.energy = {
      joules: formatAmount(energyParsed.value),
      nm: formatAmount(energyParsed.value),
    };
  }
  if (workParsed.value != null && draft.workForce && draft.workDistance) {
    shareParts.work = {
      force: draft.workForce,
      distance: draft.workDistance,
      angle: draft.workAngle || '0',
      work: formatAmount(workParsed.value),
    };
  }
  const payload =
    shareParts.force || shareParts.energy || shareParts.work ? shareResultText(shareParts) : '';

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
            N ↔ J/m · J ↔ N·m · optional W = Fd cos(θ)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NmToJoulesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'newtons' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <NmToJoulesResults
            forceLine={forceLine}
            energyLine={energyLine}
            workLine={draft.workOpen ? workLine : null}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
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
        </NmToJoulesForm>
      </div>
    </section>
  );
}
