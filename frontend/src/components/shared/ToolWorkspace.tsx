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
    <React.Suspense
      fallback={
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-white text-sm text-muted-foreground">
          Loading calculator…
        </div>
      }
    >
      <RegisteredTool
        metadata={tool}
        className={className}
        presentation={presentation}
        headerActions={headerActions}
      />
    </React.Suspense>
  );
}
