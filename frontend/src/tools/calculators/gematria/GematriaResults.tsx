'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { GematriaBundle, LetterValue } from './types';

interface GematriaResultsProps {
  bundle: GematriaBundle | null;
  breakdownOpen: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function ResultRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent">{value}</p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function counted(values: readonly LetterValue[] | undefined): LetterValue[] {
  return values?.filter((row) => row.counted) ?? [];
}

export function GematriaResults({
  bundle,
  breakdownOpen,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: GematriaResultsProps) {
  if (!bundle) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a word, name, or phrase to calculate Gematria values.
      </p>
    );
  }

  const jewishLabel =
    bundle.activeJewish?.system === 'hebrew-standard'
      ? 'Jewish / Hebrew Standard (Mispar Hechrechi)'
      : bundle.activeJewish?.system === 'jewish-english'
        ? 'Jewish / English Jewish Gematria'
        : 'Jewish Gematria';

  const jewishValue =
    bundle.activeJewish && bundle.activeJewish.countedCount > 0
      ? String(bundle.activeJewish.total)
      : '—';

  const simpleRows = counted(bundle.simple?.letterValues);
  const englishRows = counted(bundle.english?.letterValues);
  const jewishEngRows = counted(bundle.jewishEnglish?.letterValues);
  const hebrewRows = counted(bundle.hebrewStandard?.letterValues);

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-accent">Gematria results</p>
        <ResultRow
          label={jewishLabel}
          value={jewishValue}
          note={
            bundle.activeJewish && bundle.activeJewish.countedCount > 0
              ? undefined
              : 'No matching letters for the selected Jewish mapping.'
          }
        />
        <ResultRow
          label="English Gematria"
          value={
            bundle.english && bundle.english.countedCount > 0
              ? String(bundle.english.total)
              : '—'
          }
          note={
            bundle.hasLatinLetters
              ? 'A=6 … Z=156 (simple × 6)'
              : 'Requires Latin letters.'
          }
        />
        <ResultRow
          label="Simple Gematria"
          value={
            bundle.simple && bundle.simple.countedCount > 0
              ? String(bundle.simple.total)
              : '—'
          }
          note={bundle.hasLatinLetters ? 'A=1 … Z=26' : 'Requires Latin letters.'}
        />
      </div>

      {bundle.notices.length > 0 ? (
        <ul className="space-y-1 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs text-amber-950/90">
          {bundle.notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      ) : null}

      {breakdownOpen ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[280px] text-left text-sm">
            <caption className="sr-only">Letter-by-letter Gematria breakdown</caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Letter
                </th>
                {bundle.hasLatinLetters ? (
                  <>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Simple
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      English
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Jewish Eng.
                    </th>
                  </>
                ) : null}
                {bundle.hasHebrewLetters ? (
                  <th scope="col" className="px-3 py-2.5 font-medium">
                    Hebrew
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {simpleRows.map((row, index) => (
                <tr key={`L-${index}-${row.letter}`} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-accent">{row.letter}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">{row.value}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {englishRows[index]?.value ?? '—'}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {jewishEngRows[index]?.value ?? '—'}
                  </td>
                  {bundle.hasHebrewLetters ? (
 <td className="px-3 py-2 tabular-nums text-accent">; </td>
                  ) : null}
                </tr>
              ))}
              {hebrewRows.map((row, index) => (
                <tr key={`H-${index}-${row.letter}`} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-accent">{row.letter}</td>
                  {bundle.hasLatinLetters ? (
                    <>
 <td className="px-3 py-2 tabular-nums text-accent">; </td>
 <td className="px-3 py-2 tabular-nums text-accent">; </td>
 <td className="px-3 py-2 tabular-nums text-accent">; </td>
                    </>
                  ) : null}
                  <td className="px-3 py-2 tabular-nums text-accent">{row.value}</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-muted/30 font-semibold">
                <th scope="row" className="px-3 py-2.5 text-accent">
                  Total
                </th>
                {bundle.hasLatinLetters ? (
                  <>
                    <td className="px-3 py-2.5 tabular-nums text-accent">
                      {bundle.simple?.total ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-accent">
                      {bundle.english?.total ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-accent">
                      {bundle.jewishEnglish?.total ?? '—'}
                    </td>
                  </>
                ) : null}
                {bundle.hasHebrewLetters ? (
                  <td className="px-3 py-2.5 tabular-nums text-accent">
                    {bundle.hebrewStandard?.total ?? '—'}
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

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
