'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  computeAdvanced,
  formatWatts,
  peakToRms,
  rmsToPeak,
  shareAdvancedText,
  shareWaveformText,
  type AdvancedResult,
} from './calculation';
import { emptyDraft, RmsToWattsForm, type RmsToWattsDraft } from './RmsToWattsForm';
import { AdvancedResults, WaveformResults } from './RmsToWattsResults';
import type { RmsToWattsFieldErrors } from './types';
import {
  parseNonNegative,
  parsePositiveResistance,
  parsePowerFactor,
} from './validation';

export function RmsToWattsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<RmsToWattsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<RmsToWattsFieldErrors>({});
  const [rms, setRms] = React.useState<number | null>(null);
  const [peak, setPeak] = React.useState<number | null>(null);
  const [advancedResult, setAdvancedResult] = React.useState<AdvancedResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluateAdvanced = (next: RmsToWattsDraft, nextErrors: RmsToWattsFieldErrors) => {
    const mode = next.advancedMode;
    const err: RmsToWattsFieldErrors = { ...nextErrors };

    const parseField = (
      key: keyof RmsToWattsFieldErrors,
      raw: string,
      parser: typeof parseNonNegative,
    ): number | null => {
      const parsed = parser(raw);
      if (parsed.blank) return null;
      if (parsed.incomplete) return null;
      if (parsed.value == null) {
        err[key] = parsed.error ?? 'Enter a valid finite number.';
        return null;
      }
      return parsed.value;
    };

    let voltage: number | null = null;
    let current: number | null = null;
    let resistance: number | null = null;
    let powerFactor: number | null = null;
    let peakVoltage: number | null = null;

    if (mode === 'voltageCurrent') {
      voltage = parseField('voltage', next.voltage, parseNonNegative);
      current = parseField('current', next.current, parseNonNegative);
      powerFactor = parseField('powerFactor', next.powerFactor, parsePowerFactor);
    } else if (mode === 'voltageResistance') {
      voltage = parseField('voltage', next.voltage, parseNonNegative);
      resistance = parseField('resistance', next.resistance, parsePositiveResistance);
    } else if (mode === 'currentResistance') {
      current = parseField('current', next.current, parseNonNegative);
      resistance = parseField('resistance', next.resistance, parsePositiveResistance);
    } else {
      peakVoltage = parseField('peakVoltage', next.peakVoltage, parseNonNegative);
      resistance = parseField('resistance', next.resistance, parsePositiveResistance);
    }

    setErrors(err);
    setAdvancedResult(
      computeAdvanced(mode, { voltage, current, resistance, powerFactor, peakVoltage }),
    );
  };

  const evaluate = (next: RmsToWattsDraft) => {
    const field = next.activeField;
    const nextErrors: RmsToWattsFieldErrors = {};

    if (field === 'rms') {
      const parsed = parseNonNegative(next.rms);
      if (parsed.blank) {
        setDraft({ ...next, peak: '' });
        setRms(null);
        setPeak(null);
        setErrors({});
        evaluateAdvanced({ ...next, peak: '' }, {});
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        evaluateAdvanced(next, {});
        return;
      }
      if (parsed.value == null) {
        setDraft(next);
        setRms(null);
        setPeak(null);
        setErrors({ rms: parsed.error });
        evaluateAdvanced(next, { rms: parsed.error });
        return;
      }
      const peakVal = rmsToPeak(parsed.value);
      setDraft({ ...next, peak: formatWatts(peakVal) });
      setRms(parsed.value);
      setPeak(peakVal);
      setErrors({});
      evaluateAdvanced({ ...next, peak: formatWatts(peakVal) }, {});
      return;
    }

    if (field === 'peak') {
      const parsed = parseNonNegative(next.peak);
      if (parsed.blank) {
        setDraft({ ...next, rms: '' });
        setRms(null);
        setPeak(null);
        setErrors({});
        evaluateAdvanced({ ...next, rms: '' }, {});
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        evaluateAdvanced(next, {});
        return;
      }
      if (parsed.value == null) {
        setDraft(next);
        setRms(null);
        setPeak(null);
        setErrors({ peak: parsed.error });
        evaluateAdvanced(next, { peak: parsed.error });
        return;
      }
      const rmsVal = peakToRms(parsed.value);
      setDraft({ ...next, rms: formatWatts(rmsVal) });
      setRms(rmsVal);
      setPeak(parsed.value);
      setErrors({});
      evaluateAdvanced({ ...next, rms: formatWatts(rmsVal) }, {});
      return;
    }

    // Advanced-only edit (or accordion/mode toggle)
    setDraft(next);
    evaluateAdvanced(next, nextErrors);
  };

  const clearFields = () => {
    setDraft({
      ...emptyDraft(),
      advancedOpen: draft.advancedOpen,
      advancedMode: draft.advancedMode,
    });
    setRms(null);
    setPeak(null);
    setAdvancedResult(null);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    setDraft(emptyDraft());
    setRms(null);
    setPeak(null);
    setAdvancedResult(null);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const waveformPayload = rms != null && peak != null ? shareWaveformText(rms, peak) : '';
  const advancedPayload =
    advancedResult != null
      ? shareAdvancedText(draft.advancedMode, advancedResult)
      : '';
  const payload = waveformPayload || advancedPayload;

  const shareOrCopy = (text: string, markShared: boolean) => {
    if (typeof navigator.share === 'function' && markShared) {
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
      if (markShared) {
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      } else {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    });
  };

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
            RMS ↔ peak (sinusoidal power waveform)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <RmsToWattsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'rms' });
          }}
          onReload={reload}
          onReset={clearFields}
          advancedChildren={<AdvancedResults result={advancedResult} />}
        >
          <WaveformResults
            rms={rms}
            peak={peak}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              shareOrCopy(text, false);
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              shareOrCopy(text, true);
            }}
          />
        </RmsToWattsForm>
      </div>
    </section>
  );
}
