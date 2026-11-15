'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMeshToMicron, formatLength } from './calculation';
import { MeshToMicronForm, draftToInput, type MeshToMicronDraft } from './MeshToMicronForm';
import { MeshToMicronResults } from './MeshToMicronResults';
import {
  DEFAULT_MESH_TO_MICRON_INPUT,
  DEFAULT_SIEVE,
  type MeshToMicronFieldErrors,
  type MeshToMicronResult,
} from './types';
import { validateMeshToMicron } from './validation';

function summaryText(result: MeshToMicronResult): string {
  const lines = ['Mesh to Micron Converter – Omega Calculators', ''];
  if (result.mode === 'standard') {
    lines.push(`Standard: ${result.standard}`);
    lines.push(`Sieve: ${result.sieveLabel}`);
    lines.push(`Nominal Opening: ${formatLength(result.openingUm)} µm`);
    lines.push(`Equivalent: ${formatLength(result.equivalents.mm)} mm`);
  } else if (result.mode === 'custom') {
    lines.push('Mode: Custom Woven Mesh');
    lines.push(result.explanation);
    lines.push(`Calculated Opening: ${formatLength(result.openingUm)} µm`);
  } else {
    lines.push(`Standard: ${result.standard}`);
    lines.push(result.explanation);
    lines.push(`Nominal Opening: ${formatLength(result.openingUm)} µm`);
  }
  return lines.join('\n');
}

const EMPTY_DRAFT: MeshToMicronDraft = {
  mode: 'standard',
  sieveDesignation: DEFAULT_SIEVE,
  meshCount: '',
  wireDiameter: '',
  wireUnit: 'mm',
  reverseUm: '',
  advancedOpen: false,
};

export function MeshToMicronConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MeshToMicronDraft>(() => ({
    ...EMPTY_DRAFT,
    sieveDesignation: DEFAULT_MESH_TO_MICRON_INPUT.sieveDesignation,
  }));
  const [errors, setErrors] = React.useState<MeshToMicronFieldErrors>({});
  const [result, setResult] = React.useState<MeshToMicronResult | null>(() =>
    calculateMeshToMicron(DEFAULT_MESH_TO_MICRON_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: MeshToMicronDraft) => {
      if (
        next.mode === draft.mode &&
        next.sieveDesignation === draft.sieveDesignation &&
        next.meshCount === draft.meshCount &&
        next.wireDiameter === draft.wireDiameter &&
        next.wireUnit === draft.wireUnit &&
        next.reverseUm === draft.reverseUm &&
        next.advancedOpen !== draft.advancedOpen
      ) {
        setDraft(next);
        return;
      }

      const input = draftToInput(next);
      const validation = validateMeshToMicron(input);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      setResult(calculateMeshToMicron(input));
      setDraft(next);
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            ASTM E11 nominal openings · optional woven-mesh estimate
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MeshToMicronForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(EMPTY_DRAFT);
            setErrors({});
            setResult(calculateMeshToMicron(DEFAULT_MESH_TO_MICRON_INPUT));
            setCopied(false);
            setShared(false);
          }}
        />
        <MeshToMicronResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
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
