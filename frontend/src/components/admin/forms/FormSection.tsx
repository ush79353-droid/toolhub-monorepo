import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  className = '',
  badge,
}: FormSectionProps) {
  return (
    <Card className={`border border-border bg-white shadow-xs ${className}`}>
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-accent">{title}</CardTitle>
          {badge}
        </div>
        {description && (
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-5 space-y-4">{children}</CardContent>
    </Card>
  );
}
