'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildVolumeResult,
  calculateWaterWeight,
  draftTextsFromLiters,
  formatMeasure,
  toLiters,
} from './calculation';
import { GallonForm, type GallonDraft } from './GallonForm';
import { GallonResults } from './GallonResults';
import {
  APPROX_WATER_DENSITY_KG_PER_L,
  DEFAULT_FIELD_UNITS,
  DEFAULT_LITERS,
  DEFAULT_WATER_INPUT,
  VOLUME_UNIT_BY_ID,
  type VolumeFieldErrors,
  type VolumeFieldId,
  type VolumeResult,
  type WaterFieldErrors,
  type WaterWeightInput,
  type WaterWeightResult,
} from './types';
import {
  parseOptionalNumber,
  validateWaterWeight,
  volumeErrorMessage,
  volumeValueState,
} from './validation';

function emptyVolumeDraft(): Pick<
  GallonDraft,
  'texts' | 'units' | 'activeField'
> {
  return {
    texts: ['', '', '', '', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
  };
}

function draftFromLiters(
  liters: number,
  units: GallonDraft['units'],
  preserveField: VolumeFieldId | null,
  preserveText: string
): Pick<GallonDraft, 'texts' | 'units' | 'activeField'> {
  return {
    texts: draftTextsFromLiters(liters, units, preserveField, preserveText),
    units,
    activeField: preserveField,
  };
}

function waterInputFromDraft(draft: GallonDraft): WaterWeightInput {
  return {
    source: draft.waterSource,
    volume: parseOptionalNumber(draft.waterVolume),
    volumeUnit: draft.waterVolumeUnit,
    densityKgPerL: parseOptionalNumber(draft.waterDensity),
    massKg: parseOptionalNumber(draft.waterMassKg),
    massLb: parseOptionalNumber(draft.waterMassLb),
  };
}

function syncWaterDraft(
  draft: GallonDraft,
  result: WaterWeightResult
): GallonDraft {
  const next = { ...draft };
  if (draft.waterSource !== 'volume') {
    next.waterVolume = formatMeasure(result.volume);
  }
  if (draft.waterSource !== 'massKg') {
    next.waterMassKg = formatMeasure(result.massKg);
  }
  if (draft.waterSource !== 'massLb') {
    next.waterMassLb = formatMeasure(result.massLb);
  }
  return next;
}

function summaryText(
  mode: GallonDraft['mode'],
  volume: VolumeResult | null,
  water: WaterWeightResult | null
): string {
  if (mode === 'volume' && volume) {
    const lines = ['Gallon Calculator – Omega Calculators', 'Mode: Volume converter', ''];
    volume.values.forEach((value, i) => {
      const symbol = VOLUME_UNIT_BY_ID[volume.units[i]!].symbol;
      lines.push(`${formatMeasure(value)} ${symbol}`);
    });
    lines.push(`Canonical: ${formatMeasure(volume.liters)} L`);
    return lines.join('\n');
  }
  if (mode === 'waterWeight' && water) {
    return [
      'Gallon Calculator – Omega Calculators',
      'Mode: Water Gallons to Weight',
      `Volume: ${formatMeasure(water.volume)} ${VOLUME_UNIT_BY_ID[water.volumeUnit].symbol}`,
      `Density: ${formatMeasure(water.densityKgPerL)} kg/L${
        water.densityApproximate ? ' (approximate assumption)' : ''
      }`,
      `Mass: ${formatMeasure(water.massKg)} kg`,
      `Mass: ≈ ${formatMeasure(water.massLb)} lb`,
    ].join('\n');
  }
  return 'Gallon Calculator – Omega Calculators';
}

export function GallonCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const litersRef = React.useRef<number | null>(DEFAULT_LITERS);

  const [draft, setDraft] = React.useState<GallonDraft>(() => {
    const vol = draftFromLiters(DEFAULT_LITERS, [...DEFAULT_FIELD_UNITS], null, '');
    const water = calculateWaterWeight(DEFAULT_WATER_INPUT);
    return {
      mode: 'volume',
      ...vol,
      waterSource: 'volume',
      waterVolume: formatMeasure(water.volume),
      waterVolumeUnit: 'usLiquidGal',
      waterDensity: formatMeasure(APPROX_WATER_DENSITY_KG_PER_L),
      waterMassKg: formatMeasure(water.massKg),
      waterMassLb: formatMeasure(water.massLb),
    };
  });
  const [volumeErrors, setVolumeErrors] = React.useState<VolumeFieldErrors>({});
  const [waterErrors, setWaterErrors] = React.useState<WaterFieldErrors>({});
  const [volumeResult, setVolumeResult] = React.useState<VolumeResult | null>(() =>
    buildVolumeResult(DEFAULT_LITERS, [...DEFAULT_FIELD_UNITS])
  );
  const [waterResult, setWaterResult] = React.useState<WaterWeightResult | null>(() =>
    calculateWaterWeight(DEFAULT_WATER_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: GallonDraft) => {
      if (next.mode !== draft.mode) {
        setDraft(next);
        setVolumeErrors({});
        setWaterErrors({});
        return;
      }

      if (next.mode === 'volume') {
        const field = next.activeField;

        if (
          field !== null &&
          next.texts[field] === draft.texts[field] &&
          next.units[field] !== draft.units[field]
        ) {
          const liters = litersRef.current;
          if (liters === null) {
            setDraft(next);
            return;
          }
          const synced = draftFromLiters(liters, next.units, null, '');
          setDraft({ ...next, ...synced });
          setVolumeErrors({});
          setVolumeResult(buildVolumeResult(liters, next.units));
          return;
        }

        if (field === null) {
          setDraft(next);
          return;
        }

        const parsed = parseOptionalNumber(next.texts[field]);
        const state = volumeValueState(parsed);
        const message = volumeErrorMessage(state);
        const nextErrors: VolumeFieldErrors = {};
        if (message) nextErrors[field] = message;

        if (state === 'blank') {
          litersRef.current = null;
          setDraft({ ...next, ...emptyVolumeDraft(), units: next.units });
          setVolumeErrors({});
          setVolumeResult(null);
          return;
        }

        if (state !== 'ok' || parsed === null) {
          setDraft(next);
          setVolumeErrors(nextErrors);
          setVolumeResult(null);
          return;
        }

        const liters = toLiters(parsed, next.units[field]);
        litersRef.current = liters;
        const synced = draftFromLiters(liters, next.units, field, next.texts[field]);
        setDraft({ ...next, ...synced });
        setVolumeErrors({});
        setVolumeResult(buildVolumeResult(liters, next.units));
        return;
      }

      // Water weight mode
      if (
        next.waterVolume === draft.waterVolume &&
        next.waterVolumeUnit === draft.waterVolumeUnit &&
        next.waterDensity === draft.waterDensity &&
        next.waterMassKg === draft.waterMassKg &&
        next.waterMassLb === draft.waterMassLb &&
        next.waterSource === draft.waterSource
      ) {
        setDraft(next);
        return;
      }

      // Preserve physical volume when water volume unit changes with volume source.
      let working = next;
      if (
        next.waterVolumeUnit !== draft.waterVolumeUnit &&
        next.waterVolume === draft.waterVolume &&
        next.waterSource === 'volume'
      ) {
        const parsed = parseOptionalNumber(draft.waterVolume);
        if (parsed !== null && Number.isFinite(parsed) && parsed >= 0) {
          const liters = toLiters(parsed, draft.waterVolumeUnit);
          working = {
            ...next,
            waterVolume: formatMeasure(
              liters / VOLUME_UNIT_BY_ID[next.waterVolumeUnit].toLiters
            ),
            waterSource: 'volume',
          };
        }
      }

      const parsed = waterInputFromDraft(working);
      const validation = validateWaterWeight(parsed);
      setWaterErrors(validation.errors);
      if (!validation.isValid) {
        setWaterResult(null);
        setDraft(working);
        return;
      }
      const result = calculateWaterWeight(parsed);
      setWaterResult(result);
      setDraft(syncWaterDraft(working, result));
    },
    [draft]
  );

  const activeInvalid =
    draft.mode === 'volume'
      ? Object.keys(volumeErrors).length > 0
      : Object.keys(waterErrors).length > 0;

  const sharePayload = summaryText(draft.mode, volumeResult, waterResult);

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
            US / Imperial / dry gallons · optional water weight
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GallonForm
          draft={draft}
          volumeErrors={volumeErrors}
          waterErrors={waterErrors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            litersRef.current = null;
            setDraft({
              mode: 'volume',
              ...emptyVolumeDraft(),
              waterSource: 'volume',
              waterVolume: '',
              waterVolumeUnit: 'usLiquidGal',
              waterDensity: formatMeasure(APPROX_WATER_DENSITY_KG_PER_L),
              waterMassKg: '',
              waterMassLb: '',
            });
            setVolumeErrors({});
            setWaterErrors({});
            setVolumeResult(null);
            setWaterResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <GallonResults
          mode={draft.mode}
          volumeResult={volumeResult}
          waterResult={waterResult}
          invalid={activeInvalid}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (
              (draft.mode === 'volume' && !volumeResult) ||
              (draft.mode === 'waterWeight' && !waterResult)
            ) {
              return;
            }
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (typeof navigator.share !== 'function') return;
            if (
              (draft.mode === 'volume' && !volumeResult) ||
              (draft.mode === 'waterWeight' && !waterResult)
            ) {
              return;
            }
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
