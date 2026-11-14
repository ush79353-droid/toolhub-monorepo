'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CpmCampaignFields } from './CpmCampaignFields';
import type { CpmCampaignDraft, CpmDraft, CpmField } from './types';

interface CpmFormProps {
  draft: CpmDraft;
  primaryErrors: Partial<Record<CpmField | 'form', string>>;
  secondaryErrors: Partial<Record<CpmField | 'form', string>>;
  onPrimaryChange: (campaign: CpmCampaignDraft) => void;
  onSecondaryChange: (campaign: CpmCampaignDraft) => void;
  onToggleSecond: () => void;
  onReset: () => void;
}

export function CpmForm({
  draft,
  primaryErrors,
  secondaryErrors,
  onPrimaryChange,
  onSecondaryChange,
  onToggleSecond,
  onReset,
}: CpmFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-label="Main campaign">
        <CpmCampaignFields
          idPrefix="cpm-main"
          draft={draft.primary}
          errors={primaryErrors}
          onChange={onPrimaryChange}
        />
      </section>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={draft.secondOpen}
          onClick={onToggleSecond}
        >
          Second campaign
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${draft.secondOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {draft.secondOpen ? (
          <div className="border-t border-border px-4 py-4">
            <CpmCampaignFields
              idPrefix="cpm-second"
              draft={draft.secondary}
              errors={secondaryErrors}
              onChange={onSecondaryChange}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
