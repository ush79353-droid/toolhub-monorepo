'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Play, Eye, Smartphone, Monitor, Tablet, Layers } from 'lucide-react';
import { ADMIN_ANALYTICS_DATA } from '@/lib/admin-mock-data';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = React.useState('7d');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Analytics"
        description="Execution metrics, visitor traffic distributions, and tool performance analytics."
      >
        <div className="w-40">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="ytd">Year to Date</option>
          </Select>
        </div>
      </AdminPageHeader>

      <PendingNotice message="Analytics dashboard is rendering demo telemetry records. Real-time logging requires Redis message queues and telemetry models on the backend." />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value="149,000"
          change="+18.4%"
          isPositive={true}
          subtext="Compared to prior period"
          icon={Eye}
        />
        <StatCard
          title="Tool Executions"
          value={ADMIN_ANALYTICS_DATA.totalExecutions}
          change="+24.1%"
          isPositive={true}
          subtext="Total calculation runs"
          icon={Play}
        />
        <StatCard
          title="Top Category"
          value="Calculators"
          subtext="32% of total interactions"
          icon={Layers}
        />
        <StatCard
          title="Desktop Traffic"
          value="64%"
          subtext="Primary visitor device"
          icon={Monitor}
        />
      </div>

      {/* Trend & Category Charts */}
      <DashboardCharts />

      {/* Device Breakdown & Performance Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <Card className="border border-border bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold text-accent">Device & Platform Split</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Monitor className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-accent text-xs">Desktop Browsers</div>
                  <div className="text-[10px] text-muted-foreground">Windows, macOS, Linux</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-accent">64%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-accent text-xs">Mobile Devices</div>
                  <div className="text-[10px] text-muted-foreground">
                    iOS Safari, Android Chrome
                  </div>
                </div>
              </div>
              <span className="text-base font-extrabold text-accent">31%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Tablet className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-accent text-xs">Tablets & Others</div>
                  <div className="text-[10px] text-muted-foreground">iPadOS, Kindle, Bots</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-accent">5%</span>
            </div>
          </CardContent>
        </Card>

        {/* Most Executed Tools Leaderboard */}
        <Card className="lg:col-span-2 border border-border bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold text-accent">
              Execution Volume by Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-border">
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
                    <div className="font-semibold text-accent">{tool.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      /tools/{tool.slug}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-accent">
                    {tool.executions.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">executions</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
