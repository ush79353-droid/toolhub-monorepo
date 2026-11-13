'use client';

import * as React from 'react';
import { getToolComponent } from '@/tools/registry';
import type { ToolMetadata } from '@/types/tool';
import type { ToolPresentation } from '@/tools/types';

export interface ToolWorkspaceProps {
  tool: ToolMetadata;
  className?: string;
  presentation?: ToolPresentation;
  headerActions?: React.ReactNode;
}

export function ToolWorkspace({
  tool,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolWorkspaceProps) {
  const RegisteredTool = tool.componentKey ? getToolComponent(tool.componentKey) : null;
  if (!RegisteredTool) return null;

  return (
    <RegisteredTool
      metadata={tool}
      className={className}
      presentation={presentation}
      headerActions={headerActions}
    />
  );
}
