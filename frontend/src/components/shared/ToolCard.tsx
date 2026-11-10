import * as React from 'react';
import Link from 'next/link';
import { CategoryIcon } from './CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import type { ToolDetailData } from '@/lib/sample-data';

export interface ToolCardProps {
  tool: ToolDetailData;
  className?: string;
}

export function ToolCard({ tool, className = '' }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md ${className}`}
    >
      <div>
        {/* Top Badges & Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <CategoryIcon name={tool.icon} className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[11px] font-medium capitalize">
              {tool.category}
            </Badge>
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer Tag Indicators */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Client-Side Tool
        </span>
        <span className="font-semibold text-primary group-hover:underline">Use Tool</span>
      </div>
    </Link>
  );
}
