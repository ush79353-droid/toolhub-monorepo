import type { ToolMetadata } from '../types/tool';

export function isClientSideTool(tool: ToolMetadata): boolean {
  return tool.executionType === 'client';
}

export function isServerSideTool(tool: ToolMetadata): boolean {
  return tool.executionType === 'server';
}

export function isThirdPartyTool(tool: ToolMetadata): boolean {
  return tool.executionType === 'third-party';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
