'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { useCurrencyRates } from '@/tools/shared/CurrencyRatesProvider';
import { shareZakatText } from './calculation';
import { ZakatForm } from './ZakatForm';
import {
  createDefaultInput,
  hasZakatChanges,
  type ZakatFieldErrors,
  type ZakatInput,
  type ZakatResult,
} from './types';
import { validateZakatInput } from './validation';

export function ZakatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const [input, setInput] = React.useState<ZakatInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ZakatFieldErrors>({});
  const [result, setResult] = React.useState<ZakatResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const run = React.useCallback(
    (next: ZakatInput) => {
      const validation = validateZakatInput(next, rates.rates);
      setErrors(validation.errors);
      setResult(validation.isValid ? validation.result : null);
    },
    [rates.rates],
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    run(input);
  }, [input, run]);

  const reset = () => {
    const next = createDefaultInput();
    setInput(next);
    run(next);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const changeCurrency = (nextCurrency: SupportedCurrency) => {
    if (nextCurrency === input.currency) return;
    const convertManual = (amount: number) =>
      convertCurrency({
        amount,
        from: input.currency,
        to: nextCurrency,
        rates: rates.rates,
      });
    let manualGold = input.manualGoldPricePerGram;
    let manualSilver = input.manualSilverPricePerGram;
    if (input.goldPriceMode === 'manual') {
      const converted = convertManual(manualGold);
      if (!converted.ok) {
        setErrors({
          prices:
            'Currency conversion is unavailable, so the manual gold price was left unchanged. Stay on the current currency or type a new price.',
        });
        return;
      }
      manualGold = converted.amount;
    }
    if (input.silverPriceMode === 'manual') {
      const converted = convertManual(manualSilver);
      if (!converted.ok) {
        setErrors({
          prices:
            'Currency conversion is unavailable, so the manual silver price was left unchanged. Stay on the current currency or type a new price.',
        });
        return;
      }
      manualSilver = converted.amount;
    }
    const next = {
      ...input,
      currency: nextCurrency,
      manualGoldPricePerGram: manualGold,
      manualSilverPricePerGram: manualSilver,
    };
    setInput(next);
    run(next);
  };

  const summary = result ? shareZakatText(result) : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // clipboard fallback
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
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
            Nisab, net Zakatable wealth, and a 2.5% estimate
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ZakatForm
          input={input}
          errors={errors}
          result={result}
          rates={rates}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onCurrencyChange={changeCurrency}
          onCalculate={() => run(input)}
          onReload={reset}
          onClear={() => {
            if (hasZakatChanges(input) && !window.confirm('Reset the Zakat calculator?')) return;
            reset();
          }}
        />
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5"
            disabled={!result}
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {shared ? 'Shared' : copied ? 'Copied' : 'Share result'}
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Did we solve your problem today?</span>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="Yes, helpful"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'no' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="No, not helpful"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
