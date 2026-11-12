import type { ComponentType } from 'react';
import type { ToolMetadata, ToolCategory, ToolExecutionType } from '@/types';

export type { ToolMetadata, ToolCategory, ToolExecutionType };

export type ToolPresentation = 'default' | 'embed';

export interface ToolComponentProps {
  metadata: ToolMetadata;
  initialData?: unknown;
  className?: string;
  /** Embed route uses natural scroll without sticky aside chrome. */
  presentation?: ToolPresentation;
}

export type ToolComponent = ComponentType<ToolComponentProps>;

export interface RegisteredToolDefinition {
  metadata: ToolMetadata;
  component: ToolComponent;
}

export type ToolRegistryMap = Record<string, ToolComponent>;
