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
  ogImageUrl: string;
  ogImageAlt: string;
  ogType: string;
  ogSiteName: string;
  keywords: string;
  indexable: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  robotsNoImageIndex: boolean;
  robotsMaxSnippet: number | null;
  robotsMaxImagePreview: string;
  robotsMaxVideoPreview: number | null;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
  twitterSite: string;
  schemaType: string;
  includeFaqSchema: boolean;
  sitemapInclude: boolean;
  sitemapPriority: number | null;
  sitemapChangeFrequency: string;
  embedEnabled: boolean;
  embedDefaultHeight: number;
  embedPreferredLayout: string;
  embedAllowedDomains: string;
  isActive: boolean;
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

export interface PublicToolListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryName: string;
  categorySlug: string;
}

export interface PublicToolListCategory {
  id: string;
  name: string;
  slug: string;
  toolCount: number;
}

export interface PublicToolList {
  items: PublicToolListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  categories: PublicToolListCategory[];
}

export const getPublicTools = cache(
  async (query: { q?: string; category?: string; page?: number }): Promise<PublicToolList | null> => {
    try {
      const response = await serverApi.get<PublicToolList>('/catalog/tools', {
        cache: 'no-store',
        params: {
          q: query.q || undefined,
          category: query.category || undefined,
          page: query.page && query.page > 1 ? query.page : undefined,
        },
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  }
);

