'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';
import { PopularToolsList } from '@/components/admin/dashboard/PopularToolsList';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Wrench, CheckCircle2, Clock, Layers, Users, Play, Plus, RefreshCw } from 'lucide-react';
import { ADMIN_ANALYTICS_DATA } from '@/lib/admin-mock-data';

export default function AdminDashboardPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Platform registry health, execution statistics, and rapid operations."
        badge={
          <span className="rounded-full bg-secondary border border-teal-200 px-2.5 py-0.5 text-xs font-semibold text-primary">
            v1.0 Preview
          </span>
        }
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
        <Button
          asChild
          size="sm"
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Link href="/admin/tools/new">
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Tool</span>
          </Link>
        </Button>
      </AdminPageHeader>

      {/* Development Environment Notice */}
      <PendingNotice message="Metrics and logs displayed on this dashboard reflect demonstration records designed for UI/UX validation. Real-time metric aggregation will be connected when Express analytics models are deployed." />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Tools"
          value={ADMIN_ANALYTICS_DATA.totalTools}
          change="+8%"
          isPositive={true}
          subtext="Registered components"
          icon={Wrench}
        />
        <StatCard
          title="Published"
          value={ADMIN_ANALYTICS_DATA.publishedTools}
          change="+12%"
          isPositive={true}
          subtext="87% active publicly"
          icon={CheckCircle2}
        />
        <StatCard
          title="Draft / Review"
          value={ADMIN_ANALYTICS_DATA.draftTools}
          subtext="Awaiting approval"
          icon={Clock}
        />
        <StatCard
          title="Categories"
          value={ADMIN_ANALYTICS_DATA.totalCategories}
          subtext="12 active categories"
          icon={Layers}
        />
        <StatCard
          title="Admin Staff"
          value={ADMIN_ANALYTICS_DATA.totalUsers}
          subtext="5 accounts active"
          icon={Users}
        />
        <StatCard
          title="Executions"
          value={ADMIN_ANALYTICS_DATA.totalExecutions}
          change="+24%"
          isPositive={true}
          subtext="Total tool runs"
          icon={Play}
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Bottom Grid: Quick Actions + Top Tools + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActions />
        <PopularToolsList />
        <RecentActivity />
      </div>
    </div>
  );
}
