'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sliders,
  Play,
  Info,
} from 'lucide-react';
import { getToolComponent } from '@/tools/registry';
import type { ToolMetadata } from '@/types/tool';

export interface ToolWorkspaceProps {
  tool: ToolMetadata;
  className?: string;
}

export function ToolWorkspace({ tool, className = '' }: ToolWorkspaceProps) {
  const RegisteredTool = tool.componentKey ? getToolComponent(tool.componentKey) : null;

  if (RegisteredTool) {
    return <RegisteredTool metadata={tool} className={className} />;
  }

  return <ToolWorkspacePreview tool={tool} className={className} />;
}

function ToolWorkspacePreview({ tool, className = '' }: ToolWorkspaceProps) {
  const [viewState, setViewState] = React.useState<'result' | 'loading' | 'error'>('result');
  const [copied, setCopied] = React.useState(false);
  const [inputValue1, setInputValue1] = React.useState('25');
  const [selectedUnit, setSelectedUnit] = React.useState('Standard');
  const [sliderValue, setSliderValue] = React.useState(80);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputValue1('');
    setSliderValue(50);
    setViewState('result');
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all ${className}`}
    >
      {/* Workspace Header / Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-accent">{tool.title} Workspace</h3>
            <p className="text-xs text-muted-foreground">Version {tool.version} • Client Sandbox</p>
          </div>
        </div>

        {/* State Preview Switcher for UI Inspection */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-white p-1 text-xs">
          <span className="px-2 text-[11px] font-semibold text-muted-foreground">
            Preview State:
          </span>
          <button
            onClick={() => setViewState('result')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              viewState === 'result'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setViewState('loading')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              viewState === 'loading'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Loading
          </button>
          <button
            onClick={() => setViewState('error')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              viewState === 'error'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Error
          </button>
        </div>
      </div>

      {/* Honest Preview Notice */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/60 px-6 py-2.5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 flex-shrink-0 text-primary" />
        <span>
          <strong>UI Architecture Workspace:</strong> Fully styled input layout and state contracts.
          Dynamic calculation engines integrate via the component registry in Phase 3.
        </span>
      </div>

      {/* Main Form & Input Controls */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Input Control 1 */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-accent">
              Primary Value / Input
            </label>
            <Input
              value={inputValue1}
              onChange={(e) => setInputValue1(e.target.value)}
              placeholder="e.g. 100"
              className="h-11"
            />
            <p className="text-[11px] text-muted-foreground">
              Enter the starting metric or input parameters.
            </p>
          </div>

          {/* Input Control 2 */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-accent">
              Secondary Option / Unit
            </label>
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Standard">Standard Mode / Metric</option>
                <option value="Imperial">Alternative Mode / Imperial</option>
                <option value="Custom">Custom Parameters</option>
              </select>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select calculation precision or measurement scale.
            </p>
          </div>

          {/* Slider Control */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-accent">
                Adjust Precision / Level
              </label>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-primary">
                {sliderValue}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <Button
            onClick={handleReset}
            variant="outline"
            size="default"
            className="inline-flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Fields</span>
          </Button>

          <Button
            onClick={() => setViewState('result')}
            size="default"
            className="inline-flex items-center gap-2 bg-primary text-white hover:bg-[hsl(var(--primary-hover))]"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Calculate Result</span>
          </Button>
        </div>

        {/* Dynamic Result Area Rendering */}
        <div className="mt-8">
          {viewState === 'loading' && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h4 className="mt-3 text-sm font-bold text-foreground">
                Processing Workspace State...
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Executing calculation safely in browser memory.
              </p>
            </div>
          )}

          {viewState === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="text-sm font-bold text-red-950">Invalid Input Parameters</h4>
                  <p className="mt-1 text-xs leading-relaxed text-red-800">
                    One or more required fields contain invalid format or out-of-range figures.
                    Please verify your values and try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {viewState === 'result' && (
            <div className="rounded-xl border border-border bg-muted/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground">Calculation Summary</span>
                  <Badge variant="secondary" className="text-[11px]">
                    Ready
                  </Badge>
                </div>

                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-1.5 h-8 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Result</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Sample Output Metric Cards */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-white p-4 shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Primary Result
                  </span>
                  <p className="mt-1 text-2xl font-black text-primary">24.50</p>
                  <span className="text-[11px] text-muted-foreground">Standard metric units</span>
                </div>

                <div className="rounded-lg border border-border bg-white p-4 shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Classification
                  </span>
                  <p className="mt-1 text-2xl font-black text-accent">Optimal</p>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Recommended range
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-white p-4 shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Confidence Factor
                  </span>
                  <p className="mt-1 text-2xl font-black text-foreground">100%</p>
                  <span className="text-[11px] text-muted-foreground">Exact arithmetic</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
