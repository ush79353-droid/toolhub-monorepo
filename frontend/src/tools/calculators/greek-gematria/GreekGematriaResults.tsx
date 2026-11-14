'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { GreekGematriaResult } from './types';

interface GreekGematriaResultsProps {
  result: GreekGematriaResult | null;
  stepsOpen: boolean;
  onToggleSteps: () => void;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-all font-mono text-lg font-semibold tabular-nums text-accent">
        {value}
      </p>
    </div>
  );
}

export function GreekGematriaResults({
  result,
  stepsOpen,
  onToggleSteps,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: GreekGematriaResultsProps) {
  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter Greek text to calculate its traditional isopsephy value.
      </p>
    );
  }

  if (result.letterCount === 0) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950/90">
          No recognized Greek letters found. Enter Greek alphabet characters (not Latin lookalikes).
        </p>
        {result.ignoredCharacters.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Ignored characters: {result.ignoredCharacters.join(', ')}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-accent">Greek gematria result</p>
        <ResultRow label="Total numerical value" value={String(result.total)} />
        <ResultRow label="Letters counted" value={String(result.letterCount)} />
        {result.additionFormula ? (
          <p className="break-all font-mono text-xs text-muted-foreground">
            {result.additionFormula}
          </p>
        ) : null}
      </div>

      {result.ignoredCharacters.length > 0 ? (
        <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-950/90">
          Ignored unsupported characters: {result.ignoredCharacters.join(', ')}
        </p>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={stepsOpen}
          onClick={onToggleSteps}
        >
          <span>Show calculation steps</span>
          <span className="text-xs font-normal text-muted-foreground">
            {stepsOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {stepsOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[240px] text-left text-sm">
                <caption className="sr-only">Letter-by-letter Greek gematria breakdown</caption>
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Position
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Greek letter
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row, index) => (
                    <tr
                      key={`${index}-${row.originalCharacter}-${row.value}`}
                      className="border-t border-border"
                    >
                      <td className="px-3 py-2 tabular-nums text-accent">{index + 1}</td>
                      <td className="px-3 py-2 font-mono text-accent">{row.originalCharacter}</td>
                      <td className="px-3 py-2 text-accent">{row.greekLetterName}</td>
                      <td className="px-3 py-2 tabular-nums text-accent">{row.value}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border bg-muted/30 font-semibold">
                    <th scope="row" colSpan={3} className="px-3 py-2.5 text-accent">
                      Total
                    </th>
                    <td className="px-3 py-2.5 tabular-nums text-accent">{result.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="break-all font-mono text-sm text-accent">{result.additionFormula}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share result'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
