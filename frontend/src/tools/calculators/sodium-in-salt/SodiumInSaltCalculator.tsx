'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatAmount,
  gramsToPureAmount,
  gramsToSaltAmount,
  mgToSodiumAmount,
  parseNumber,
  pureAmountToGrams,
  saltAmountToGrams,
  sodiumAmountToMg,
} from './calculation';
import { SodiumInSaltForm } from './SodiumInSaltForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type PureSaltUnit,
  type SodiumInSaltFieldErrors,
  type SodiumInSaltInput,
  type SodiumInSaltResult,
  type SodiumUnit,
} from './types';
import { validateSodiumInSaltInput } from './validation';

export function SodiumInSaltCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<SodiumInSaltFieldErrors>({});
  const [result, setResult] = React.useState<SodiumInSaltResult | null>(() =>
    validateSodiumInSaltInput(initial).result,
  );
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SodiumInSaltInput) => {
    const v = validateSodiumInSaltInput(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  const onFormChange = (next: SodiumInSaltInput) => {
    // Preserve physical values when only a unit selector changes.
    if (next.saltUnit !== input.saltUnit && next.source === 'salt') {
      const raw = parseNumber(input.saltAmountText);
      if (raw !== null) {
        const grams = saltAmountToGrams(raw, input.saltUnit, input.saltType);
        const converted =
          grams != null
            ? gramsToSaltAmount(grams, next.saltUnit, next.saltType)
            : null;
        if (converted != null) {
          apply({
            ...next,
            saltAmountText: formatAmount(converted),
          });
          return;
        }
      }
    }
    if (next.sodiumUnit !== input.sodiumUnit && next.source === 'sodium') {
      const raw = parseNumber(input.sodiumAmountText);
      if (raw !== null) {
        const mg = sodiumAmountToMg(raw, input.sodiumUnit);
        const converted =
          mg != null ? mgToSodiumAmount(mg, next.sodiumUnit as SodiumUnit) : null;
        if (converted != null) {
          apply({
            ...next,
            sodiumAmountText: formatAmount(converted),
          });
          return;
        }
      }
    }
    if (next.pureUnit !== input.pureUnit && next.source === 'pure') {
      const raw = parseNumber(input.pureSaltText);
      if (raw !== null) {
        const grams = pureAmountToGrams(raw, input.pureUnit);
        const converted =
          grams != null
            ? gramsToPureAmount(grams, next.pureUnit as PureSaltUnit)
            : null;
        if (converted != null) {
          apply({
            ...next,
            pureSaltText: formatAmount(converted),
          });
          return;
        }
      }
    }
    // Salt-type change: keep source amount; clear derived text fields.
    if (next.saltType !== input.saltType) {
      if (next.source === 'salt') {
        apply({
          ...next,
          sodiumAmountText: '',
          pureSaltText: '',
        });
        return;
      }
      if (next.source === 'sodium') {
        apply({
          ...next,
          saltAmountText: '',
          pureSaltText: '',
        });
        return;
      }
      apply({
        ...next,
        saltAmountText: '',
        sodiumAmountText: '',
      });
      return;
    }
    apply(next);
  };

  const reload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateSodiumInSaltInput(fresh).result);
    setShared(false);
    setFeedback(null);
  };

  const clear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateSodiumInSaltInput(fresh).result);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  // Nutrition privacy: share public page URL only — never salt/sodium intakes.
  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'Sodium in Salt Calculator | Omega Calculators',
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through to clipboard
      }
    }
    if (await copyTextToClipboard(pageUrl)) {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    }
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
            Salt ↔ sodium ↔ pure NaCl (educational; 22.99/58.44).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <SodiumInSaltForm
          input={input}
          errors={errors}
          result={result}
          onChange={onFormChange}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start gap-2"
              onClick={reload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start gap-2"
              disabled={!dirty}
              onClick={clear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Did we solve your problem today?
          </p>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'yes' ? 'default' : 'outline'}
            className="h-8 gap-1.5"
            onClick={() => setFeedback('yes')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Yes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'no' ? 'default' : 'outline'}
            className="h-8 gap-1.5"
            onClick={() => setFeedback('no')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            No
          </Button>
        </div>
      </div>
    </section>
  );
}
