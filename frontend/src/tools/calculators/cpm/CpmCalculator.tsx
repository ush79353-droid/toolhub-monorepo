'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { formatCpmField } from './calculation';
import { CpmForm } from './CpmForm';
import { CpmResults } from './CpmResults';
import {
  createDefaultDraft,
  type CpmCampaignDraft,
  type CpmDraft,
  type CpmField,
} from './types';
import { applySolvedDisplay, validateAndSolveCampaign } from './validation';

function campaignSummary(
  label: string,
  campaign: CpmCampaignDraft,
  values: ReturnType<typeof validateAndSolveCampaign>['values']
): string[] {
  if (Object.keys(campaign.manual).length === 0) return [];
  const lines = [`${label}:`];
  if (values.totalCost !== undefined) {
    lines.push(`  Total cost: ${formatCurrencyValue(values.totalCost, campaign.currency)}`);
  }
  if (values.cpm !== undefined) {
    lines.push(`  CPM: ${formatCurrencyValue(values.cpm, campaign.currency)}`);
  }
  if (values.impressions !== undefined) {
    lines.push(`  Impressions: ${formatCpmField('impressions', values.impressions, campaign.currency)}`);
  }
  return lines;
}

export function CpmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CpmDraft>(() => createDefaultDraft());
  const [primaryErrors, setPrimaryErrors] = React.useState<
    Partial<Record<CpmField | 'form', string>>
  >({});
  const [secondaryErrors, setSecondaryErrors] = React.useState<
    Partial<Record<CpmField | 'form', string>>
  >({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const runPrimary = (campaign: CpmCampaignDraft) => {
    const solved = validateAndSolveCampaign(campaign);
    setPrimaryErrors(solved.errors);
    const formatted = applySolvedDisplay(campaign, solved.values, (field, value) =>
      formatCpmField(field, value, campaign.currency)
    );
    setDraft((prev) => ({ ...prev, primary: formatted }));
  };

  const runSecondary = (campaign: CpmCampaignDraft) => {
    const solved = validateAndSolveCampaign(campaign);
    setSecondaryErrors(solved.errors);
    const formatted = applySolvedDisplay(campaign, solved.values, (field, value) =>
      formatCpmField(field, value, campaign.currency)
    );
    setDraft((prev) => ({ ...prev, secondary: formatted }));
  };

  const resetAll = () => {
    setDraft(createDefaultDraft());
    setPrimaryErrors({});
    setSecondaryErrors({});
    setCopied(false);
    setShared(false);
  };

  const primarySolved = validateAndSolveCampaign(draft.primary);
  const secondarySolved = validateAndSolveCampaign(draft.secondary);
  const primaryReady =
    !primarySolved.inconsistent &&
    Object.keys(primaryErrors).length === 0 &&
    Object.keys(draft.primary.manual).length >= 2 &&
    primarySolved.values.totalCost !== undefined &&
    primarySolved.values.cpm !== undefined &&
    primarySolved.values.impressions !== undefined;

  const hasBlockingErrors =
    Object.keys(primaryErrors).length > 0 ||
    (draft.secondOpen && Object.keys(secondaryErrors).length > 0);

  const summaryLines = [
    `${metadata.title} — Omega Calculators`,
    ...campaignSummary('Main campaign', draft.primary, primarySolved.values),
    ...(draft.secondOpen
      ? campaignSummary('Second campaign', draft.secondary, secondarySolved.values)
      : []),
    CURRENCY_DENOMINATION_NOTE,
  ];
  const sharePayload = primaryReady ? summaryLines.join('\n') : '';

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CpmForm
          draft={draft}
          primaryErrors={primaryErrors}
          secondaryErrors={secondaryErrors}
          onPrimaryChange={runPrimary}
          onSecondaryChange={runSecondary}
          onToggleSecond={() =>
            setDraft((prev) => ({ ...prev, secondOpen: !prev.secondOpen }))
          }
          onReset={resetAll}
        />
        <CpmResults
          ready={primaryReady}
          incomplete={!primaryReady && !hasBlockingErrors}
          invalid={hasBlockingErrors}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!sharePayload) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!sharePayload || typeof navigator.share !== 'function') return;
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
