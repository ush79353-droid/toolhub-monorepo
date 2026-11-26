import * as React from 'react';

const BOLD = /\*\*([^*\n]+)\*\*/g;
const LIST_LINE = /^\s*[-*]\s+(.*)$/;
const HEADING_LINE = /^\s{0,3}#{1,3}(?!#)\s+(\S.*?)\s*$/;
const EMPTY_HEADING = /^\s*#{1,6}\s*$/;
const HEADING_GLUE =
  /^([A-Z][\w'’/-]*(?:\s+[A-Z][\w'’/-]*){0,3})\s+(?=[A-Z][a-z])([\s\S]+)$/;

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

/** Plain text for JSON-LD. Visible pages still render the bold and headings. */
export function stripInlineMarks(text: string): string {
  return stripLatexMarks(text)
    .replace(/^\s*#{1,6}\s*$/gm, '')
    .replace(/#{1,3}(?!#)\s+/g, '')
    .replace(BOLD, '$1');
}

/**
 * A Markdown heading line. When the model glues the title to the sentence
 * ("### Example Scenario Suppose you have..."), the title is split off.
 */
export function splitHeading(line: string): { title: string; rest: string } | null {
  const match = line.match(HEADING_LINE);
  if (!match) return null;
  const body = (match[1] ?? '').trim();
  if (!body) return null;
  const glued = body.match(HEADING_GLUE);
  if (!glued) return { title: body, rest: '' };
  const title = (glued[1] ?? '').trim();
  const rest = (glued[2] ?? '').trim();
  const titleWords = title.split(/\s+/).length;
  const restIsSentence = rest.length > 48 || /[.!?]/.test(rest);
  if (titleWords >= 1 && titleWords <= 4 && restIsSentence) return { title, rest };
  return { title: body, rest: '' };
}

/** Paragraphs stay paragraphs. `#` headings and `- ` lines become structure. `**label**` is bold. */
export function RichCopy({ text }: { text: string }) {
  const lines = stripLatexMarks(text)
    .split('\n')
    .flatMap((line) => line.split(/(?=#{1,3}\s+)/).map((part) => part.trim()).filter(Boolean));
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
    if (line.trim() === '' || EMPTY_HEADING.test(line)) {
      flushProse();
      flushList();
      continue;
    }
    const heading = splitHeading(line);
    if (heading) {
      flushProse();
      flushList();
      blocks.push(
        <h3 key={`h-${blocks.length}`} className="pt-1 text-[17px] font-semibold leading-snug text-accent">
          {inlineNodes(heading.title, `h-${blocks.length}`)}
        </h3>
      );
      if (heading.rest) prose.push(heading.rest);
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
