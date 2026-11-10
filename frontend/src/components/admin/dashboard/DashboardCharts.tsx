import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ADMIN_ANALYTICS_DATA } from '@/lib/admin-mock-data';

export function DashboardCharts() {
  const maxRuns = Math.max(...ADMIN_ANALYTICS_DATA.dailyTraffic.map((d) => d.toolRuns));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 7-Day Usage Trend Bar Chart */}
      <Card className="lg:col-span-2 border border-border bg-white shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-bold text-accent">Tool Usage Trend</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily total tool executions across all categories (Sample Data)
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
            Last 7 Days
          </span>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-56 items-end gap-3 sm:gap-6 pt-6 pb-2">
            {ADMIN_ANALYTICS_DATA.dailyTraffic.map((item) => {
              const heightPct = Math.round((item.toolRuns / maxRuns) * 100);
              return (
                <div
                  key={item.date}
                  className="group relative flex flex-1 flex-col items-center h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-8 hidden rounded bg-accent px-2 py-1 text-[10px] font-medium text-white shadow-md group-hover:block z-10 whitespace-nowrap">
                    {item.toolRuns.toLocaleString()} runs ({item.pageViews.toLocaleString()} views)
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[40px] rounded-t-md bg-secondary transition-all group-hover:bg-primary/90 flex flex-col justify-end"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div
                      className="w-full rounded-t-md bg-primary transition-colors"
                      style={{ height: `${Math.round(heightPct * 0.7)}%` }}
                    />
                  </div>

                  <span className="mt-2 text-[11px] font-medium text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-primary" />
              <span>Tool Runs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-secondary" />
              <span>Total Page Views</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools by Category Breakdown */}
      <Card className="border border-border bg-white shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-accent">Tools by Category</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribution across primary categories
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {ADMIN_ANALYTICS_DATA.categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-accent">{item.category}</span>
                <span className="text-muted-foreground">
                  {item.count} tools ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}

          <div className="mt-6 rounded-lg bg-background p-3 text-center border border-border">
            <div className="text-xs text-muted-foreground">Highest Performing Category</div>
            <div className="text-sm font-bold text-primary mt-0.5">
              Calculators (32% of traffic)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
