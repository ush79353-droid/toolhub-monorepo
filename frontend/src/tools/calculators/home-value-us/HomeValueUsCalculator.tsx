'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  fetchHomeValueBundle,
  fetchHomeValueMetros,
} from '@/server/home-value/actions';
import { HomeValueUsForm } from './HomeValueUsForm';
import { HomeValueUsResults } from './HomeValueUsResults';
import {
  createDefaultInput,
  type HomeValueMetroOption,
  type HomeValueUsFieldErrors,
  type HomeValueUsInput,
  type HomeValueUsResult,
  type IndexSeriesSnapshot,
  periodLabel,
} from './types';
import { validateHomeValueUsInput } from './validation';

function inputsEqual(a: HomeValueUsInput, b: HomeValueUsInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function HomeValueUsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<HomeValueUsInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<HomeValueUsInput>(() => defaults);
  const [errors, setErrors] = React.useState<HomeValueUsFieldErrors>({});
  const [result, setResult] = React.useState<HomeValueUsResult | null>(null);
  const [metros, setMetros] = React.useState<HomeValueMetroOption[]>([]);
  const [homeIndex, setHomeIndex] = React.useState<IndexSeriesSnapshot | null>(
    null
  );
  const [cpi, setCpi] = React.useState<IndexSeriesSnapshot | null>(null);
  const [loadingData, setLoadingData] = React.useState(false);
  const [dataError, setDataError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [metroLabel, setMetroLabel] = React.useState('FL - Miami');
  const requestSeq = React.useRef(0);
  const activeMetro = React.useRef(input.metroId);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const metrosRes = await fetchHomeValueMetros();
      if (cancelled) return;
      if (!metrosRes.ok) {
        setDataError(metrosRes.message);
        return;
      }
      setMetros(metrosRes.data.metros);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recompute = React.useCallback(
    (
      next: HomeValueUsInput,
      nextHome: IndexSeriesSnapshot | null,
      nextCpi: IndexSeriesSnapshot | null,
      label: string
    ) => {
      const validation = validateHomeValueUsInput(
        next,
        nextHome,
        nextCpi,
        label
      );
      setInput(next);
      setErrors(validation.errors);
      setResult(validation.result);
    },
    []
  );

  const loadBundle = React.useCallback(
    async (metroId: string, currentInput: HomeValueUsInput) => {
      const seq = ++requestSeq.current;
      activeMetro.current = metroId;
      setLoadingData(true);
      setDataError(null);
      setHomeIndex(null);
      setCpi(null);
      setResult(null);

      const bundle = await fetchHomeValueBundle(metroId);
      // Ignore stale responses from a previously selected metro
      if (seq !== requestSeq.current || activeMetro.current !== metroId) {
        return;
      }
      setLoadingData(false);
      if (!bundle.ok) {
        setDataError(bundle.message);
        setHomeIndex(null);
        setCpi(null);
        recompute(currentInput, null, null, metroLabel);
        return;
      }
      const label = bundle.data.metro.label;
      setMetroLabel(label);
      setHomeIndex(bundle.data.homePriceIndex);
      setCpi(bundle.data.cpi);
      recompute(
        currentInput,
        bundle.data.homePriceIndex,
        bundle.data.cpi,
        label
      );
    },
    [metroLabel, recompute]
  );

  React.useEffect(() => {
    if (!input.metroId) return;
    void loadBundle(input.metroId, input);
    // Only reload when metro changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.metroId]);

  const handleChange = (next: HomeValueUsInput) => {
    if (next.metroId !== input.metroId) {
      setInput(next);
      setResult(null);
      setErrors({});
      return;
    }
    recompute(next, homeIndex, cpi, metroLabel);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setBaseline(fresh);
    setInput(fresh);
    setErrors({});
    setResult(null);
    setDataError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
    setMetroLabel('FL - Miami');
    void loadBundle(fresh.metroId, fresh);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Metro: ${result.metroLabel}`,
        `Purchase: ${periodLabel(result.purchasePeriod)} · ${result.formattedPurchasePrice}`,
        `Valuation: ${periodLabel(result.valuationPeriod)} · ${result.formattedEstimatedValue}`,
        `Nominal change: ${result.formattedNominalDollar}${
          result.formattedNominalPercent
            ? ` (${result.formattedNominalPercent})`
            : ''
        }`,
        result.formattedRealPercent
          ? `Real change: ${result.formattedRealDollar} (${result.formattedRealPercent})`
          : 'Real change: unavailable',
        `Source: ${result.homeIndexSource} (${result.homeIndexFredId})`,
        'Index-based estimate — not an appraisal.',
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
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
            Estimate US home value changes with Case-Shiller metro indices and
            CPI inflation adjustment.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <HomeValueUsForm
          input={input}
          errors={errors}
          metros={metros}
          homeIndex={homeIndex}
          loadingData={loadingData}
          dataError={dataError}
          onChange={handleChange}
        />

        <HomeValueUsResults result={result} />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
