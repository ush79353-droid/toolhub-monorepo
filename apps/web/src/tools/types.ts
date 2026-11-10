import type { ComponentType } from 'react';
import type { ToolMetadata, ToolCategory, ToolExecutionType } from '@mega-tools/shared';

export type { ToolMetadata, ToolCategory, ToolExecutionType };

export interface ToolComponentProps {
  metadata: ToolMetadata;
  initialData?: unknown;
  className?: string;
}

export type ToolComponent = ComponentType<ToolComponentProps>;

export interface RegisteredToolDefinition {
  metadata: ToolMetadata;
  component: ToolComponent;
}

export type ToolRegistryMap = Record<string, ToolComponent>;

