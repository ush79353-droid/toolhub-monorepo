import { cache } from 'react';
import { serverApi } from '@/server/api/client';

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  toolCount: number;
}

export interface PublicCategoryTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  isActive: boolean;
}

export interface PublicSubPillarGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tools: PublicCategoryTool[];
}

export interface PublicPillarGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tools: PublicCategoryTool[];
  subPillars: PublicSubPillarGroup[];
}

export interface PublicCategoryDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  toolCount: number;
  pillars: PublicPillarGroup[];
  ungrouped: PublicCategoryTool[];
}

export const getPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  try {
    const response = await serverApi.get<PublicCategory[]>('/catalog/categories', { cache: 'no-store' });
    return response.data ?? [];
  } catch {
    return [];
  }
});

export const getPublicCategoryDetail = cache(async (slug: string): Promise<PublicCategoryDetail | null> => {
  try {
    const response = await serverApi.get<PublicCategoryDetail>(`/catalog/categories/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      timeoutMs: 30000,
    });
    return response.data ?? null;
  } catch {
    return null;
  }
});
