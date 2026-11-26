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

function ShimmerBar({ className }: { className: string }) {
  return <span aria-hidden="true" className={`tool-shimmer block rounded-md ${className}`} />;
}

/** No text nodes and no image URL, so the fallback is not an LCP element. */
function ToolWorkspaceFallback() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading calculator"
      className="rounded-2xl border border-border bg-white p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <ShimmerBar className="h-5 w-36" />
          <ShimmerBar className="h-3 w-64 max-w-full" />
        </div>
        <ShimmerBar className="h-9 w-20 shrink-0 rounded-lg" />
      </div>
      <div className="mt-6 space-y-4">
        {['h-11', 'h-11', 'h-11', 'h-11'].map((height, index) => (
          <div key={index} className="space-y-2">
            <ShimmerBar className="h-3 w-24" />
            <ShimmerBar className={`${height} w-full rounded-lg`} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <ShimmerBar className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <ShimmerBar className="h-11 w-full rounded-lg" />
          <ShimmerBar className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
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
      fallback={<ToolWorkspaceFallback />}
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
