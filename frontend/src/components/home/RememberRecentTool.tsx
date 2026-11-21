'use client';

import * as React from 'react';
import { rememberRecentTool } from '@/lib/recent-tools';

export function RememberRecentTool({ name, slug }: { name: string; slug: string }) {
  React.useEffect(() => {
    rememberRecentTool({ name, slug });
  }, [name, slug]);

  return null;
}
