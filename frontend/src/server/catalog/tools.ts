import 'server-only';
import { cache } from 'react';
import { ApiClientError, serverApi } from '@/server/api/client';
import type { ToolExecutionType } from '@/types/tool';

export interface PublicToolRef {
  id: string;
  name: string;
  slug: string;
}

export interface PublicRelatedTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  componentKey: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  categorySlug: string;
  pillarName: string;
}

export interface PublicToolDetail {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  executionType: ToolExecutionType;
  componentKey: string;
  category: PublicToolRef | null;
  pillar: PublicToolRef | null;
  subPillar: PublicToolRef | null;
  relatedTools: PublicRelatedTool[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  indexable: boolean;
  isFeatured: boolean;
  updatedAt: string;
}

export const getPublicToolBySlug = cache(async (slug: string): Promise<PublicToolDetail | null> => {
  try {
    const response = await serverApi.get<PublicToolDetail>(
      `/catalog/tools/${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null;
    }
    return null;
  }
});

