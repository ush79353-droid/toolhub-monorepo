import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ADMIN_ANALYTICS_DATA } from '@/lib/admin-mock-data';
import Link from 'next/link';
import { Wrench, Edit, ArrowRight } from 'lucide-react';

export function PopularToolsList() {
  return (
    <Card className="border border-border bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold text-accent">Top Performing Tools</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Highest volume execution metrics</p>
        </div>
        <Link
          href="/admin/tools"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>All Tools</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-3 divide-y divide-border">
        {ADMIN_ANALYTICS_DATA.popularTools.map((tool, idx) => (
          <div
            key={tool.slug}
            className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                #{idx + 1}
              </span>
              <div>
                <div className="font-semibold text-accent flex items-center gap-1.5">
                  <Wrench className="h-3 w-3 text-primary" />
                  <span>{tool.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {tool.category} · {tool.executions.toLocaleString()} runs
                </div>
              </div>
            </div>
            <Link
              href={`/admin/tools`}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
              title="Edit tool configuration"
            >
              <Edit className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
