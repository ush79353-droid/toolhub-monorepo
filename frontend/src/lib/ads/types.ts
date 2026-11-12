/**
 * Advertisement placement types for public Tool Detail Pages.
 * Live AdSense integration is intentionally not implemented yet.
 */

export type AdPlacementId =
  | 'tool_top_banner'
  | 'tool_article_middle'
  | 'tool_article_bottom'
  | 'tool_bottom_banner'
  | 'tool_sidebar_optional';

/** Runtime display mode. `live` is reserved for a future AdSense integration. */
export type AdDisplayMode = 'placeholder' | 'disabled' | 'live';

export type AdSlotSize = 'leaderboard' | 'rectangle' | 'mobile_banner';

export interface AdPlacementConfig {
  id: AdPlacementId;
  /** Human-readable label for operators / future admin UI. */
  label: string;
  /** Shown under ADVERTISEMENT in placeholder mode. */
  description: string;
  size: AdSlotSize;
  /** When false, the slot renders nothing. */
  enabled: boolean;
}
