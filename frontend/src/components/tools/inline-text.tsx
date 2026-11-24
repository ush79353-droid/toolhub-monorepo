import * as React from 'react';

const BOLD = /\*\*([^*\n]+)\*\*/g;
const LIST_LINE = /^\s*[-*]\s+(.*)$/;

/** Drop LaTeX markers (`\[ \]`, `\( \)`) and a backslash that only escapes punctuation. */
export function stripLatexMarks(text: string): string {
  return text.replace(/\\([[\]()$*_])/g, '$1');
}

/** Turn `**label**` into bold. Unmatched asterisks stay as written. */
export function inlineNodes(text: string, keyPrefix: string): React.ReactNode[] {
  text = stripLatexMarks(text);
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(BOLD.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      <strong key={`${keyPrefix}-${match.index}`} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  if (nodes.length === 0) nodes.push(text);
  return nodes;
}

/** Plain text for JSON-LD. Visible pages still render the bold. */
export function stripInlineMarks(text: string): string {
  return stripLatexMarks(text).replace(BOLD, '$1');
}

/** Paragraphs stay paragraphs. Lines that start with `- ` become a real list, with `**label**` in bold. */
export function RichCopy({ text }: { text: string }) {
  const lines = stripLatexMarks(text).split('\n');
  const blocks: React.ReactNode[] = [];
  let prose: string[] = [];
  let items: string[] = [];

  function flushProse() {
    const value = prose.join(' ').trim();
    prose = [];
    if (!value) return;
    blocks.push(<p key={`p-${blocks.length}`}>{inlineNodes(value, `p-${blocks.length}`)}</p>);
  }

  function flushList() {
    if (items.length === 0) return;
    const current = items;
    items = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
        {current.map((item, index) => (
          <li key={index}>{inlineNodes(item, `li-${blocks.length}-${index}`)}</li>
        ))}
      </ul>
    );
  }

  for (const line of lines) {
    const item = line.match(LIST_LINE);
    if (item) {
      flushProse();
      items.push(item[1] ?? '');
      continue;
    }
    if (line.trim() === '') {
      flushProse();
      flushList();
      continue;
    }
    flushList();
    prose.push(line);
  }
  flushProse();
  flushList();
  if (blocks.length === 0) return null;
  return <div className="space-y-4">{blocks}</div>;
}
