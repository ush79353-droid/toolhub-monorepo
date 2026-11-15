import type { AdDisplayMode, AdPlacementConfig, AdPlacementId } from './types';

/**
 * Global ads mode for OmegaCalculators.
 * Keep `placeholder` until real AdSense + consent wiring is approved.
 * Do not put publisher/slot IDs in env for this phase.
 */
export const ADS_DISPLAY_MODE: AdDisplayMode = 'placeholder';

/**
 * Conservative default placements for `/tools/[slug]` only.
 * Embed routes must never import or render these slots.
 */
export const TOOL_PAGE_AD_PLACEMENTS: Record<AdPlacementId, AdPlacementConfig> = {
  tool_top_banner: {
    id: 'tool_top_banner',
    label: 'Top banner',
    description: 'Leaderboard placeholder',
    size: 'leaderboard',
    enabled: true,
  },
  tool_article_middle: {
    id: 'tool_article_middle',
    label: 'In-article',
    description: 'Between intro and guide',
    size: 'rectangle',
    enabled: true,
  },
  tool_article_bottom: {
    id: 'tool_article_bottom',
    label: 'After article',
    description: 'Below educational content',
    size: 'rectangle',
    enabled: false,
  },
  tool_bottom_banner: {
    id: 'tool_bottom_banner',
    label: 'Bottom banner',
    description: 'Above site footer',
    size: 'leaderboard',
    enabled: true,
  },
  tool_sidebar_optional: {
    id: 'tool_sidebar_optional',
    label: 'Sidebar',
    description: 'Optional desktop only',
    size: 'rectangle',
    // Disabled: sticky calculator owns the right column.
    enabled: false,
  },
};

export function getToolAdPlacement(id: AdPlacementId): AdPlacementConfig {
  return TOOL_PAGE_AD_PLACEMENTS[id];
}
