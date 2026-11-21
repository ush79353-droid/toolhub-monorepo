'use client';

import * as React from 'react';
import Link from 'next/link';
import { RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { ToolComponentProps } from '@/tools/types';

export function EidlCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const handleShare = async () => {
    const summary = [
      `${metadata.title} | Omega Calculators`,
      'The U.S. Small Business Administration (SBA) Economic Injury Disaster Loan Emergency Advance (EIDL) program was a COVID-19 relief measure that has officially concluded.',
      'This program is no longer accepting new applications or providing emergency advances.',
      'For active commercial and personal borrowing, explore our Loan Calculator: /tools/loan-calculator',
    ].join('\n');

    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReload = () => {
    setCopied(false);
    setFeedback(null);
  };

  return (
    <section
      aria-label={`${metadata.title} information panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">{metadata.title}</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Historical COVID-19 relief program overview & active loan alternatives
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="p-4 sm:p-5">
        {/* Historical Notice Card (matching screenshot structure) */}
        <div className="rounded-xl border border-border/80 bg-brand-softTeal/25 p-5 text-accent sm:p-6">
          <p className="text-[14px] leading-relaxed text-foreground/90 sm:text-[15px]">
            In light of the disastrous effects of COVID-19 on businesses and the employment sector, the
            U.S. government activated the{' '}
            <strong className="font-semibold italic text-accent">
              Economic Injury Disaster Loan Emergency Advance (EIDL)
            </strong>
            , which provided forgivable relief of up to $10,000 to businesses currently experiencing
            temporary difficulties.
          </p>

          <p className="mt-4 text-[14px] italic leading-relaxed text-foreground/80 sm:text-[15px]">
            Since COVID-19 is over, the calculations are no longer valid.
          </p>

          <p className="mt-4 text-[14px] leading-relaxed text-foreground/90 sm:text-[15px]">
            We would like to draw your attention to our{' '}
            <Link
              href="/tools/loan-calculator"
              className="font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
            >
              loan calculator
            </Link>
            , which will help you choose the best loan option. It is a versatile tool that helps you
            evaluate loan details using available information or your personal preferences.
          </p>
        </div>

        {/* Action Controls matching reference screenshot */}
        <div className="mt-5 border-t border-border/80 pt-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {/* Share Result */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
                <Share2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-accent">
                {copied ? 'Link Copied!' : 'Share result'}
              </span>
            </button>

            {/* Reload / Clear Controls */}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
                onClick={handleReload}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reload calculator
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled
                className="h-9 w-full justify-center text-xs font-normal text-muted-foreground/50 cursor-not-allowed hover:bg-transparent"
              >
                Clear all changes
              </Button>
            </div>
          </div>

          {/* Feedback widget from screenshot */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
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
      </div>
    </section>
  );
}
