import { cache } from 'react';
import { serverApi } from '@/server/api/client';

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  toolCount: number;
}

export const getPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  try {
    const response = await serverApi.get<PublicCategory[]>('/catalog/categories', { cache: 'no-store' });
    return response.data ?? [];
  } catch {
    return [];
  }
});
