'use client';
import { serverApi } from '@/server/api/client';

export function TestLeak() {
  return <div>{serverApi ? 'leaked' : 'safe'}</div>;
}

