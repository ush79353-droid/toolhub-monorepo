import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { INITIAL_ADMIN_LOGS } from '@/lib/admin-mock-data';
import { StatusBadge } from '../shared/StatusBadge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function RecentActivity() {
  return (
    <Card className="border border-border bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold text-accent">Recent Admin Activity</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest system events and content changes
          </p>
        </div>
        <Link
          href="/admin/activity-logs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-3 divide-y divide-border">
        {INITIAL_ADMIN_LOGS.slice(0, 4).map((log) => (
          <div
            key={log.id}
            className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-[10px] text-primary mt-0.5">
                {log.actor.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-accent">{log.actor.name}</span>
                  <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                    {log.action}
                  </span>
                  <span className="font-mono text-[11px] text-primary truncate max-w-[150px]">
                    {log.resource}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                  {log.details}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={log.result} />
              <div className="text-[10px] text-muted-foreground/70 mt-1">
                {log.timestamp.split(' ')[1]}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
