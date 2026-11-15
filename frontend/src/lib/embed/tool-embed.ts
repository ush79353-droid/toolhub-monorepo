import { isApprovedComponentKey } from '@/tools/registry/keys';

export const EMBED_MESSAGE_SOURCE = 'omega-calculators-embed' as const;
export const EMBED_DEFAULT_HEIGHT = 650;

export type EmbedPreferredLayout = '' | 'responsive' | 'compact';

export interface ToolEmbedConfig {
  embedEnabled: boolean;
  embedDefaultHeight: number;
  embedPreferredLayout: EmbedPreferredLayout | string;
  embedAllowedDomains: string;
}

export interface EmbedEligibilityInput extends ToolEmbedConfig {
  isActive: boolean;
  componentKey: string;
}

export type EmbedMessage =
  | {
      source: typeof EMBED_MESSAGE_SOURCE;
      type: 'resize';
      embedId: string;
      height: number;
    }
  | {
      source: typeof EMBED_MESSAGE_SOURCE;
      type: 'ready';
      embedId: string;
    };

export function buildEmbedPath(slug: string): string {
  return `/embed/${slug.replace(/^\/+|\/+$/g, '')}`;
}

export function buildEmbedUrl(siteOrigin: string, slug: string): string {
  const origin = siteOrigin.replace(/\/+$/, '');
  return `${origin}${buildEmbedPath(slug)}`;
}

export function buildToolPageUrl(siteOrigin: string, slug: string): string {
  return `${siteOrigin.replace(/\/+$/, '')}/tools/${slug.replace(/^\/+|\/+$/g, '')}`;
}

export function normalizeEmbedHeight(value: number | null | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return EMBED_DEFAULT_HEIGHT;
  return Math.min(4000, Math.max(320, Math.round(value)));
}

/** Escape for HTML attribute contexts (iframe title/src/etc.). */
export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Permanent policy: embedding is ON unless an admin explicitly sets false.
 * Missing / null / undefined → enabled.
 */
export function resolveEmbedEnabled(value: boolean | null | undefined): boolean {
  return value !== false;
}

/** Public embed button + `/embed/[slug]` require active + implemented + not explicitly disabled. */
export function isToolEmbedEligible(input: EmbedEligibilityInput): boolean {
  return (
    resolveEmbedEnabled(input.embedEnabled) &&
    input.isActive === true &&
    isApprovedComponentKey(input.componentKey)
  );
}

export function parseAllowedDomains(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((part) => part.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
    .filter(Boolean);
}

export function buildIframeSnippet(options: {
  embedUrl: string;
  title: string;
  height?: number;
  embedId?: string;
}): string {
  const height = normalizeEmbedHeight(options.height);
  const title = escapeHtmlAttr(options.title);
  const src = escapeHtmlAttr(options.embedUrl);
  const idAttr = options.embedId ? `\n  data-omega-embed-id="${escapeHtmlAttr(options.embedId)}"` : '';
  return `<iframe
  src="${src}"
  title="${title}"
  width="100%"
  height="${height}"
  style="border:0;max-width:100%;border-radius:12px"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"${idAttr}
></iframe>`;
}

export function buildAutoResizeSnippet(options: {
  embedUrl: string;
  title: string;
  height?: number;
  siteOrigin: string;
  scriptUrl?: string;
}): string {
  const embedId = `omega-embed-${Math.random().toString(36).slice(2, 10)}`;
  const iframe = buildIframeSnippet({ ...options, embedId });
  const scriptSrc = escapeHtmlAttr(
    options.scriptUrl ?? `${options.siteOrigin.replace(/\/+$/, '')}/embed.js`
  );
  const origin = escapeHtmlAttr(options.siteOrigin.replace(/\/+$/, ''));
  return `${iframe}
<script src="${scriptSrc}" async data-omega-embed-origin="${origin}"></script>`;
}

export function isEmbedResizeMessage(data: unknown): data is Extract<EmbedMessage, { type: 'resize' }> {
  if (!data || typeof data !== 'object') return false;
  const msg = data as Record<string, unknown>;
  return (
    msg.source === EMBED_MESSAGE_SOURCE &&
    msg.type === 'resize' &&
    typeof msg.embedId === 'string' &&
    msg.embedId.length > 0 &&
    msg.embedId.length <= 80 &&
    typeof msg.height === 'number' &&
    Number.isFinite(msg.height) &&
    msg.height >= 200 &&
    msg.height <= 8000
  );
}
