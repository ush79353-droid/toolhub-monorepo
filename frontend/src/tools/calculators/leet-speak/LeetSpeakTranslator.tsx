'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { shareResultText, translateLeetSpeak } from './calculation';
import { emptyDraft, LeetSpeakForm, type LeetSpeakDraft } from './LeetSpeakForm';
import { LeetSpeakResults } from './LeetSpeakResults';
import { validateLeetInput } from './validation';

export function LeetSpeakTranslator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LeetSpeakDraft>(emptyDraft);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const validated = React.useMemo(() => validateLeetInput(draft.text), [draft.text]);
  const output = React.useMemo(
    () =>
      validated.text.length > 0
        ? translateLeetSpeak(validated.text, draft.direction, draft.profile)
        : '',
    [validated.text, draft.direction, draft.profile],
  );
  const hasInput = validated.text.length > 0;

  const markShared = () => {
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  };

  const share = () => {
    if (!hasInput) return;
    const payload =
      typeof window !== 'undefined'
        ? `${shareResultText(validated.text, output, draft.direction, draft.profile)}\n\nExplore: ${window.location.href}`
        : shareResultText(validated.text, output, draft.direction, draft.profile);
    if (typeof navigator.share === 'function') {
      void navigator
        .share({
          title: metadata.title,
          text: payload,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        })
        .then(markShared)
        .catch(() => {
          void copyTextToClipboard(payload).then((ok) => {
            if (ok) markShared();
          });
        });
      return;
    }
    void copyTextToClipboard(payload).then((ok) => {
      if (ok) markShared();
    });
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
          <p className="text-xs font-normal text-muted-foreground">HELLO → H3110 (classic)</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LeetSpeakForm
          draft={draft}
          warning={validated.warning}
          onDraftChange={(next) => {
            setDraft(next);
            setShared(false);
          }}
          onSubmit={(event) => event.preventDefault()}
          onReload={() => {
            setDraft(emptyDraft());
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setShared(false);
          }}
        >
          <LeetSpeakResults
            output={output}
            hasInput={hasInput}
            direction={draft.direction}
            shared={shared}
            canShare={canShare || hasInput}
            onShare={share}
          />
        </LeetSpeakForm>
      </div>
    </section>
  );
}
