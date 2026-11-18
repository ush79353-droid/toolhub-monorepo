'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromJoules, formatEnergy, shareResultText } from './calculation';
import { emptyDraft, EnergyForm, type EnergyDraft } from './EnergyForm';
import { EnergyResults } from './EnergyResults';
import {
  ENERGY_UNITS,
  ENERGY_UNIT_SYMBOLS,
  type EnergyFieldErrors,
  type EnergyUnit,
} from './types';
import { joulesFromUnit, parseEnergyInput } from './validation';

const SUMMARY_UNITS: readonly EnergyUnit[] = [
  'joule',
  'kilojoule',
  'kilocalorie',
  'wattHour',
  'kilowattHour',
  'electronvolt',
  'tonTnt',
];

type OpenState = Pick<
  EnergyDraft,
  'siOpen' | 'largeOpen' | 'microscopicOpen' | 'otherOpen'
>;

function draftFromJoules(
  joules: number,
  preserve: { field: EnergyUnit; text: string } | null,
  open: OpenState,
): EnergyDraft {
  const amounts = allFromJoules(joules);
  const texts = {} as Record<EnergyUnit, string>;
  for (const unit of ENERGY_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatEnergy(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, ...open };
}

export function EnergyConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<EnergyDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<EnergyFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const joulesRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<EnergyUnit>('joule');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: EnergyDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseEnergyInput(source);
    const open: OpenState = {
      siOpen: next.siOpen,
      largeOpen: next.largeOpen,
      microscopicOpen: next.microscopicOpen,
      otherOpen: next.otherOpen,
    };

    if (parsed.blank) {
      joulesRef.current = null;
      setDraft({ ...emptyDraft(), ...open });
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
      joulesRef.current = null;
      return;
    }

    const converted = joulesFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      joulesRef.current = null;
      return;
    }

    joulesRef.current = converted.joules;
    sourceRef.current = field;
    setDraft(draftFromJoules(converted.joules, { field, text: source }, open));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    joulesRef.current = null;
    setDraft({
      ...emptyDraft(),
      siOpen: draft.siOpen,
      largeOpen: draft.largeOpen,
      microscopicOpen: draft.microscopicOpen,
      otherOpen: draft.otherOpen,
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    joulesRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const joules = joulesRef.current;
  const summaryLines =
    hasResult && joules != null
      ? SUMMARY_UNITS.map((unit) => {
          const amounts = allFromJoules(joules);
          return `${formatEnergy(amounts[unit])} ${ENERGY_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    hasResult && joules != null ? shareResultText(joules, sourceRef.current) : '';

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
            Joules · kcal · kWh · eV · TNT
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <EnergyForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'joule' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <EnergyResults
            summaryLines={summaryLines}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
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
        </EnergyForm>
      </div>
    </section>
  );
}
