/** Soft notice threshold only — conversion is never truncated. */
export const UPPERCASE_SOFT_MAX = 100_000;

/** Share/clipboard payload preview cap for very long results. */
export const SHARE_PREVIEW_MAX = 1_500;

export type CaseMode =
  | 'uppercase'
  | 'lowercase'
  | 'title'
  | 'sentence'
  | 'toggle';

export const CASE_MODE_OPTIONS: readonly {
  id: CaseMode;
  label: string;
  example: string;
}[] = [
  { id: 'uppercase', label: 'Uppercase', example: 'HELLO WORLD' },
  { id: 'lowercase', label: 'Lowercase', example: 'hello world' },
  { id: 'title', label: 'Title case', example: 'Hello World' },
  { id: 'sentence', label: 'Sentence case', example: 'Hello world' },
  { id: 'toggle', label: 'Toggle case', example: 'hELLO wORLD' },
];
