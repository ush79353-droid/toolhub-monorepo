'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  densityToKgM3,
  formatConc,
  kgM3ToDensity,
  mgLToMolL,
  mgLToPpm,
  molarConcToMolL,
  molarMassToGMol,
  molLToMgL,
  molLToMolarConc,
  ppmToMgL,
  shareResultText,
} from './calculation';
import { emptyDraft, PpmToMglForm, type PpmToMglDraft } from './PpmToMglForm';
import { PpmToMglResults } from './PpmToMglResults';
import {
  DENSITY_UNIT_SYMBOLS,
  MOLAR_CONC_SYMBOLS,
  MOLAR_MASS_SYMBOLS,
  type FieldErrors,
} from './types';
import { parseNonNegative, parsePositive, parsePpm } from './validation';

export function PpmToMglConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PpmToMglDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [lines, setLines] = React.useState<string[] | null>(null);
  const [payload, setPayload] = React.useState('');
  const [molarHint, setMolarHint] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PpmToMglDraft) => {
    const densParsed = parsePositive(next.density, 'Solution density');
    if (densParsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }

    const nextErrors: FieldErrors = {};
    if (densParsed.blank || densParsed.value == null) {
      nextErrors.density = densParsed.error ?? 'Solution density must be greater than zero.';
    }

    let densityKgM3: number | null = densParsed.value != null
      ? densityToKgM3(densParsed.value, next.densityUnit)
      : null;
    if (densityKgM3 != null && (!Number.isFinite(densityKgM3) || densityKgM3 <= 0)) {
      nextErrors.density = 'Solution density must be greater than zero.';
      densityKgM3 = null;
    }

    const mmParsed = parsePositive(next.molarMass, 'Molar mass');
    let molarMassGMol: number | null = null;
    if (mmParsed.incomplete) {
      setDraft(next);
      setErrors(nextErrors);
      return;
    }
    if (!mmParsed.blank) {
      if (mmParsed.value == null) {
        nextErrors.molarMass = mmParsed.error ?? 'Molar mass must be greater than zero.';
      } else {
        molarMassGMol = molarMassToGMol(mmParsed.value, next.molarMassUnit);
      }
    }

    const source = next.activeSource ?? 'ppm';
    let ppm: number | null = null;
    let mgL: number | null = null;
    let molL: number | null = null;

    if (source === 'ppm') {
      const p = parsePpm(next.ppm);
      if (p.incomplete) {
        setDraft(next);
        setErrors(nextErrors);
        return;
      }
      if (p.blank) {
        setDraft({ ...next, mgL: '', molar: '' });
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        setMolarHint(null);
        return;
      }
      if (p.value == null) {
        nextErrors.ppm = p.error;
        setDraft(next);
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        return;
      }
      ppm = p.value;
      if (densityKgM3 != null) mgL = ppmToMgL(ppm, densityKgM3);
    } else if (source === 'mgL') {
      const p = parseNonNegative(next.mgL);
      if (p.incomplete) {
        setDraft(next);
        setErrors(nextErrors);
        return;
      }
      if (p.blank) {
        setDraft({ ...next, ppm: '', molar: '' });
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        setMolarHint(null);
        return;
      }
      if (p.value == null) {
        nextErrors.mgL = p.error;
        setDraft(next);
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        return;
      }
      mgL = p.value;
      if (densityKgM3 != null) {
        ppm = mgLToPpm(mgL, densityKgM3);
        if (ppm > 1_000_000) {
          nextErrors.mgL =
            'This concentration exceeds a mass fraction of 1 for the given density.';
          setDraft(next);
          setErrors(nextErrors);
          setLines(null);
          setPayload('');
          return;
        }
      }
    } else {
      // molar
      if (molarMassGMol == null) {
        nextErrors.molar =
          'Enter a valid solute molar mass to convert between molar and mass concentrations.';
        setDraft(next);
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        setMolarHint(null);
        return;
      }
      const p = parseNonNegative(next.molar);
      if (p.incomplete) {
        setDraft(next);
        setErrors(nextErrors);
        return;
      }
      if (p.blank) {
        setDraft({ ...next, ppm: '', mgL: '' });
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        return;
      }
      if (p.value == null) {
        nextErrors.molar = p.error;
        setDraft(next);
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        return;
      }
      molL = molarConcToMolL(p.value, next.molarUnit);
      mgL = molLToMgL(molL, molarMassGMol);
      if (densityKgM3 != null) {
        ppm = mgLToPpm(mgL, densityKgM3);
        if (ppm > 1_000_000) {
          nextErrors.molar =
            'This concentration exceeds a mass fraction of 1 for the given density.';
          setDraft(next);
          setErrors(nextErrors);
          setLines(null);
          setPayload('');
          return;
        }
      }
    }

    if (Object.keys(nextErrors).length > 0 || densityKgM3 == null || ppm == null || mgL == null) {
      setDraft(next);
      setErrors(nextErrors);
      setLines(null);
      setPayload('');
      return;
    }

    if (molarMassGMol != null) {
      if (molL == null) molL = mgLToMolL(mgL, molarMassGMol);
      setMolarHint(null);
    } else {
      molL = null;
      setMolarHint(
        'Enter the molar mass to calculate molar concentration.',
      );
    }

    const out: PpmToMglDraft = {
      ...next,
      ppm: source === 'ppm' ? next.ppm : formatConc(ppm),
      mgL: source === 'mgL' ? next.mgL : formatConc(mgL),
      molar:
        molL == null
          ? ''
          : source === 'molar'
            ? next.molar
            : formatConc(molLToMolarConc(molL, next.molarUnit)),
      // Keep density text as typed; reformat only when unit switch from evaluate of density unit... leave as-is
      density: densParsed.value != null && next.density.trim() !== ''
        ? next.density
        : formatConc(kgM3ToDensity(densityKgM3, next.densityUnit)),
    };

    setDraft(out);
    setErrors({});
    const summary = [
      `${formatConc(ppm)} ppm`,
      `${formatConc(densParsed.value!)} ${DENSITY_UNIT_SYMBOLS[next.densityUnit]}`,
      `${formatConc(mgL)} mg/L`,
    ];
    if (molarMassGMol != null && mmParsed.value != null) {
      summary.push(
        `${formatConc(mmParsed.value)} ${MOLAR_MASS_SYMBOLS[next.molarMassUnit]}`,
      );
    }
    if (molL != null) {
      summary.push(
        `${formatConc(molLToMolarConc(molL, next.molarUnit))} ${MOLAR_CONC_SYMBOLS[next.molarUnit]}`,
      );
    }
    setLines(summary);
    setPayload(
      shareResultText({
        ppm,
        densityKgM3,
        densityUnit: next.densityUnit,
        densityDisplay: densParsed.value!,
        mgL,
        molarMassGMol,
        molarMassDisplay: mmParsed.value ?? null,
        molarMassUnit: next.molarMassUnit,
        molL,
        molarConcDisplay: molL != null ? molLToMolarConc(molL, next.molarUnit) : null,
        molarConcUnit: next.molarUnit,
      }),
    );
  };

  const clearFields = () => {
    setDraft({
      ...emptyDraft(),
      density: draft.density,
      densityUnit: draft.densityUnit,
    });
    setErrors({});
    setLines(null);
    setPayload('');
    setMolarHint(null);
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    setDraft(emptyDraft());
    setErrors({});
    setLines(null);
    setPayload('');
    setMolarHint(null);
    setCopied(false);
    setShared(false);
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
          <h2 className="text-[15px] font-semibold text-accent">PPM to mg/L Converter</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Mass fraction · density · molarity
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PpmToMglForm
          draft={draft}
          errors={errors}
          molarHint={molarHint}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeSource: draft.activeSource ?? 'ppm' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <PpmToMglResults
            lines={lines}
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
        </PpmToMglForm>
      </div>
    </section>
  );
}
