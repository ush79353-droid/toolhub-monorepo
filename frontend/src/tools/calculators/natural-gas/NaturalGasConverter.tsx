'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  DEFAULT_HEATING_BTU_PER_FT3,
  ENERGY_UNIT_DEFS,
  HEATING_UNIT_DEFS,
  VOLUME_UNIT_DEFS,
  type NaturalGasFieldErrors,
} from './types';
import {
  convertEnergy,
  convertVolume,
  energyToVolume,
  formatAmount,
  fromBtuPerFt3,
  shareResultText,
  toBtuPerFt3,
  volumeToEnergy,
} from './calculation';
import {
  NaturalGasForm,
  defaultDraft,
  emptyDraft,
  type NaturalGasDraft,
} from './NaturalGasForm';
import { NaturalGasResults } from './NaturalGasResults';
import {
  parseAmountInput,
  validateNonNegative,
  validatePositive,
} from './validation';

function syncDraft(
  volume: number,
  energy: number,
  heatingBtuPerFt3: number,
  next: NaturalGasDraft,
  preserve: { field: NaturalGasDraft['activeField']; text: string } | null,
): NaturalGasDraft {
  return {
    ...next,
    volume: preserve?.field === 'volume' ? preserve.text : formatAmount(volume),
    energy: preserve?.field === 'energy' ? preserve.text : formatAmount(energy),
    heating:
      preserve?.field === 'heating'
        ? preserve.text
        : formatAmount(fromBtuPerFt3(heatingBtuPerFt3, next.heatingUnit)),
    activeField: preserve?.field ?? null,
  };
}

export function NaturalGasConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NaturalGasDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NaturalGasFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const volumeRef = React.useRef<number | null>(100);
  const heatingRef = React.useRef(DEFAULT_HEATING_BTU_PER_FT3);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: NaturalGasDraft) => {
    if (
      next.advancedOpen !== draft.advancedOpen &&
      next.volume === draft.volume &&
      next.energy === draft.energy &&
      next.heating === draft.heating &&
      next.volumeUnit === draft.volumeUnit &&
      next.energyUnit === draft.energyUnit &&
      next.heatingUnit === draft.heatingUnit
    ) {
      setDraft(next);
      return;
    }

    // Unit-only changes: preserve physical quantities.
    if (next.volumeUnit !== draft.volumeUnit && next.volume === draft.volume) {
      const parsed = parseAmountInput(next.volume);
      if (parsed.value != null && validateNonNegative(parsed.value) == null) {
        const converted = convertVolume(parsed.value, draft.volumeUnit, next.volumeUnit);
        const heating = heatingRef.current;
        const energy = volumeToEnergy(converted, next.volumeUnit, next.energyUnit, heating);
        volumeRef.current = converted;
        setDraft(
          syncDraft(converted, energy, heating, next, {
            field: 'volume',
            text: formatAmount(converted),
          }),
        );
        setErrors({});
        setHasResult(true);
        return;
      }
    }

    if (next.energyUnit !== draft.energyUnit && next.energy === draft.energy) {
      const parsed = parseAmountInput(next.energy);
      if (parsed.value != null && validateNonNegative(parsed.value) == null) {
        const converted = convertEnergy(parsed.value, draft.energyUnit, next.energyUnit);
        const heating = heatingRef.current;
        const volume = energyToVolume(converted, next.energyUnit, next.volumeUnit, heating);
        volumeRef.current = volume;
        setDraft(
          syncDraft(volume, converted, heating, next, {
            field: 'energy',
            text: formatAmount(converted),
          }),
        );
        setErrors({});
        setHasResult(true);
        return;
      }
    }

    if (next.heatingUnit !== draft.heatingUnit && next.heating === draft.heating) {
      const heating = heatingRef.current;
      setDraft({
        ...next,
        heating: formatAmount(fromBtuPerFt3(heating, next.heatingUnit)),
        activeField: null,
      });
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    if (field === 'heating') {
      const parsed = parseAmountInput(next.heating);
      if (parsed.blank) {
        setDraft(next);
        setErrors({ heating: 'Enter a value greater than zero.' });
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        return;
      }
      if (parsed.value == null) {
        setDraft(next);
        setErrors({ heating: parsed.error ?? 'Enter a valid finite number.' });
        return;
      }
      const positiveError = validatePositive(parsed.value);
      if (positiveError) {
        setDraft(next);
        setErrors({ heating: positiveError });
        return;
      }

      const heating = toBtuPerFt3(parsed.value, next.heatingUnit);
      heatingRef.current = heating;

      const primary = next.primaryField;
      const primaryRaw = primary === 'volume' ? next.volume : next.energy;
      const primaryParsed = parseAmountInput(primaryRaw);
      if (
        primaryParsed.blank ||
        primaryParsed.incomplete ||
        primaryParsed.value == null ||
        validateNonNegative(primaryParsed.value)
      ) {
        setDraft(next);
        setErrors({});
        setHasResult(false);
        volumeRef.current = null;
        return;
      }

      const volume =
        primary === 'volume'
          ? primaryParsed.value
          : energyToVolume(
              primaryParsed.value,
              next.energyUnit,
              next.volumeUnit,
              heating,
            );
      const energy =
        primary === 'energy'
          ? primaryParsed.value
          : volumeToEnergy(volume, next.volumeUnit, next.energyUnit, heating);
      volumeRef.current = volume;
      setDraft(syncDraft(volume, energy, heating, next, { field: 'heating', text: next.heating }));
      setErrors({});
      setHasResult(true);
      return;
    }

    const source = field === 'volume' ? next.volume : next.energy;
    const parsed = parseAmountInput(source);
    if (parsed.blank) {
      volumeRef.current = null;
      setDraft({
        ...emptyDraft(),
        volumeUnit: next.volumeUnit,
        energyUnit: next.energyUnit,
        heatingUnit: next.heatingUnit,
        heating: next.heating,
        advancedOpen: next.advancedOpen,
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
      volumeRef.current = null;
      return;
    }
    const nonNeg = validateNonNegative(parsed.value);
    if (nonNeg) {
      setDraft(next);
      setErrors({ [field]: nonNeg });
      setHasResult(false);
      volumeRef.current = null;
      return;
    }

    let heating = heatingRef.current;
    const heatingParsed = parseAmountInput(next.heating);
    if (heatingParsed.value != null && validatePositive(heatingParsed.value) == null) {
      heating = toBtuPerFt3(heatingParsed.value, next.heatingUnit);
      heatingRef.current = heating;
    } else if (!(heating > 0)) {
      heating = DEFAULT_HEATING_BTU_PER_FT3;
      heatingRef.current = heating;
    }

    const volume =
      field === 'volume'
        ? parsed.value
        : energyToVolume(parsed.value, next.energyUnit, next.volumeUnit, heating);
    const energy =
      field === 'energy'
        ? parsed.value
        : volumeToEnergy(volume, next.volumeUnit, next.energyUnit, heating);
    volumeRef.current = volume;
    setDraft(syncDraft(volume, energy, heating, next, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      volumeRef.current = 100;
      heatingRef.current = DEFAULT_HEATING_BTU_PER_FT3;
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      volumeRef.current = null;
      heatingRef.current = DEFAULT_HEATING_BTU_PER_FT3;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const volume = volumeRef.current;
  const heating = heatingRef.current;
  const energyValue =
    hasResult && volume != null
      ? volumeToEnergy(volume, draft.volumeUnit, draft.energyUnit, heating)
      : null;
  const mmbtu =
    hasResult && volume != null
      ? volumeToEnergy(volume, draft.volumeUnit, 'mmbtu', heating)
      : null;

  const volumeLine =
    hasResult && volume != null
      ? `${formatAmount(volume)} ${VOLUME_UNIT_DEFS[draft.volumeUnit].symbol}`
      : null;
  const energyLine =
    energyValue != null
      ? `${formatAmount(energyValue)} ${ENERGY_UNIT_DEFS[draft.energyUnit].symbol}`
      : null;
  const heatingLine = hasResult
    ? `${formatAmount(fromBtuPerFt3(heating, draft.heatingUnit))} ${HEATING_UNIT_DEFS[draft.heatingUnit].symbol}`
    : null;

  const payload =
    volumeLine && energyLine && heatingLine && mmbtu != null
      ? shareResultText({
          volume: formatAmount(volume!),
          volumeUnit: draft.volumeUnit,
          energy: formatAmount(energyValue!),
          energyUnit: draft.energyUnit,
          heating: formatAmount(fromBtuPerFt3(heating, draft.heatingUnit)),
          heatingUnit: draft.heatingUnit,
          equivalentMmbtu: formatAmount(mmbtu),
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
            Volume · energy · adjustable heating value
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NaturalGasForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'volume' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <NaturalGasResults
            volumeLine={volumeLine}
            energyLine={energyLine}
            heatingLine={heatingLine}
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
        </NaturalGasForm>
      </div>
    </section>
  );
}
