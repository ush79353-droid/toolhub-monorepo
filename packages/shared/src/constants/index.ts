import type { ToolCategory, ToolExecutionType } from '../types/tool';

export const TOOL_CATEGORIES: readonly ToolCategory[] = [
  'calculators',
  'converters',
  'pdf',
  'image',
  'video',
  'audio',
  'ai',
  'seo',
  'developer',
] as const;

export const TOOL_EXECUTION_TYPES: readonly ToolExecutionType[] = [
  'client',
  'server',
  'third-party',
] as const;

export const API_CONSTANTS = {
  DEFAULT_TIMEOUT_MS: 10000,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
