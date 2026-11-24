'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { IbuprofenDosageForm } from './IbuprofenDosageForm';
import { IbuprofenDosageResults } from './IbuprofenDosageResults';
import {
  createDefaultInput,
  type IbuprofenDosageInput,
} from './types';
import { validateIbuprofenDosageInput } from './validation';

function inputsEqual(a: IbuprofenDosageInput, b: IbuprofenDosageInput): boolean {
  return (
    a.isSixMonthsOrOlder === b.isSixMonthsOrOlder &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit
  );
}

export function IbuprofenDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = React.useMemo(() => createDefaultInput(), []);
  const [baseline] = React.useState<IbuprofenDosageInput>(() => defaults);
  const [input, setInput] = React.useState<IbuprofenDosageInput>(() => defaults);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const validation = React.useMemo(
    () => validateIbuprofenDosageInput(input),
    [input],
  );

  const handleReload = () => {
    setInput(defaults);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput({
      ...defaults,
      weightText: '',
      isSixMonthsOrOlder: true,
      weightUnit: 'kg',
    });
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleLoadExample = (kg: number) => {
    setInput({
      isSixMonthsOrOlder: true,
      weightText: String(kg),
      weightUnit: 'kg',
    });
  };

  // Medical privacy: share only the public page URL — never weight or dose.
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const handleShare = async () => {
    const shareData = {
      title: metadata.title || 'Ibuprofen Dosage Calculator',
      text: 'Ibuprofen Dosage Calculator — Omega Calculators (educational label reference).',
      url: pageUrl,
    };
    try {
      if (canShare) {
        await navigator.share(shareData);
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(
        `${shareData.text}\n${pageUrl}`,
      );
      setCopied(ok);
      setShared(ok);
    } catch {
      const ok = await copyTextToClipboard(pageUrl);
      setCopied(ok);
      setShared(ok);
    }
  };

  const dirty = !inputsEqual(input, baseline);

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        className
      }`}
    >
      <div className="space-y-4 p-4 sm:p-5">
        {!isEmbed && headerActions ? (
          <div className="flex justify-end">{headerActions}</div>
        ) : null}

        <IbuprofenDosageForm
          input={input}
          errors={validation.errors}
          onChange={setInput}
          onLoadExample={handleLoadExample}
        />

        <IbuprofenDosageResults result={validation.result} />

        <div className="flex flex-wrap items-stretch gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-11 flex-col gap-1 px-4 py-2"
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4 text-rose-500" aria-hidden />
            <span className="text-xs">
              {shared || copied ? 'Link ready' : 'Share result'}
            </span>
          </Button>
          <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
            <Button type="button" variant="outline" onClick={handleReload}>
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!dirty}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'yes' ? 'default' : 'outline'}
            onClick={() => setFeedback('yes')}
          >
            <ThumbsUp className="mr-1 h-3.5 w-3.5" aria-hidden />
            Yes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'no' ? 'default' : 'outline'}
            onClick={() => setFeedback('no')}
          >
            <ThumbsDown className="mr-1 h-3.5 w-3.5" aria-hidden />
            No
          </Button>
        </div>
      </div>
    </section>
  );
}
