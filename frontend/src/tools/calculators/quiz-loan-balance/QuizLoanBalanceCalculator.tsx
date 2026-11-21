'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateQuizResult } from './calculation';
import { QUIZ_QUESTIONS } from './questions';
import { QuizLoanBalanceForm } from './QuizLoanBalanceForm';
import {
  createDefaultInput,
  type QuizLoanBalanceInput,
  type QuizLoanBalanceResult,
} from './types';

export function QuizLoanBalanceCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [input, setInput] = React.useState<QuizLoanBalanceInput>(() => defaults);
  const [result, setResult] = React.useState<QuizLoanBalanceResult>(() =>
    calculateQuizResult(defaults)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: QuizLoanBalanceInput) => {
    setInput(next);
    setResult(calculateQuizResult(next));
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setResult(calculateQuizResult(fresh));
    setCopied(false);
    setShared(false);
  };

  const summary = result.complete
    ? [
        `${metadata.title} | Omega Calculators`,
        `Quiz: How well do you understand loan balances?`,
        `Score: ${result.formattedScore}`,
        ...QUIZ_QUESTIONS.map((question) => {
          const answer = input.answers[question.id];
          const selected =
            question.options.find((option) => option.id === answer)?.label ??
            '—';
          return `Q${question.number}: ${selected}`;
        }),
      ].join('\n')
    : '';

  return (
    <section
      aria-label={`${metadata.title} quiz panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Quiz</h2>
          <p className="text-xs font-normal text-muted-foreground">
 Educational quiz; not a loan balance calculator. Answer all five
            questions to see your score.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <QuizLoanBalanceForm
          input={input}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share result'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
