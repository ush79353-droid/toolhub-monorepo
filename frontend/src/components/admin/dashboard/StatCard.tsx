import * as React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: React.ElementType;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="p-5 border border-border bg-white shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-accent">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 text-[11px] text-muted-foreground truncate">{subtext}</p>}
    </Card>
  );
}
