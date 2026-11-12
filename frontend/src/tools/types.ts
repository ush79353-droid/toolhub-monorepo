import type { ComponentType, ReactNode } from 'react';
import type { ToolMetadata, ToolCategory, ToolExecutionType } from '@/types';

export type { ToolMetadata, ToolCategory, ToolExecutionType };

export type ToolPresentation = 'default' | 'embed';

export interface ToolComponentProps {
  metadata: ToolMetadata;
  initialData?: unknown;
  className?: string;
  /** Embed route uses natural scroll without sticky aside chrome. */
  presentation?: ToolPresentation;
  /** Optional actions rendered in the calculator header (e.g. Embed) without shifting the card. */
  headerActions?: ReactNode;
}

export type ToolComponent = ComponentType<ToolComponentProps>;

export interface RegisteredToolDefinition {
  metadata: ToolMetadata;
  component: ToolComponent;
}

export type ToolRegistryMap = Record<string, ToolComponent>;
