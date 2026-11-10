import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Layers, Search, Globe, FileText, ArrowRight } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      label: 'Register New Tool',
      href: '/admin/tools/new',
      icon: Plus,
      variant: 'primary' as const,
    },
    {
      label: 'Create Category',
      href: '/admin/categories/new',
      icon: Layers,
      variant: 'outline' as const,
    },
    { label: 'Configure SEO', href: '/admin/seo', icon: Search, variant: 'outline' as const },
    {
      label: 'Manage CMS Pages',
      href: '/admin/pages',
      icon: FileText,
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="border border-border bg-white shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-accent">Quick Operations</CardTitle>
        <p className="text-xs text-muted-foreground">Frequent administration shortcuts</p>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Button
              key={act.label}
              asChild
              variant={act.variant === 'primary' ? 'default' : 'outline'}
              size="sm"
              className={`w-full justify-between text-xs h-9 ${
                act.variant === 'primary'
                  ? 'bg-primary text-white hover:bg-[hsl(var(--primary-hover))]'
                  : ''
              }`}
            >
              <Link href={act.href}>
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{act.label}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Link>
            </Button>
          );
        })}

        <div className="pt-2 border-t border-border">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs h-8 text-primary hover:bg-secondary"
          >
            <Link href="/" target="_blank">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span>Open Public Portal</span>
              </div>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
