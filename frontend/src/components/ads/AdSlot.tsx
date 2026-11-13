import * as React from 'react';
import { ADS_DISPLAY_MODE, getToolAdPlacement } from '@/lib/ads/placements';
import type { AdDisplayMode, AdPlacementId, AdSlotSize } from '@/lib/ads/types';

const SIZE_CLASS: Record<AdSlotSize, string> = {
  // ~728×90 desktop / ~320×100 mobile visual targets (CSS-reserved, not fixed ad units)
  leaderboard:
    'min-h-[100px] w-full max-w-full sm:min-h-[90px]',
  rectangle:
    'min-h-[250px] w-full max-w-full sm:min-h-[250px]',
  mobile_banner: 'min-h-[100px] w-full max-w-full',
};

export interface AdSlotProps {
  placement: AdPlacementId;
  /** Override global mode for a single slot (tests / gradual rollout). */
  mode?: AdDisplayMode;
  className?: string;
  /** Force-hide without changing shared config. */
  enabled?: boolean;
}

/**
 * Visual advertisement placeholder for public tool pages.
 * Does not load AdSense, trackers, or third-party scripts.
 * Future `live` mode should mount a consented ad unit here — never invent slot IDs now.
 */
export function AdSlot({
  placement,
  mode = ADS_DISPLAY_MODE,
  className = '',
  enabled,
}: AdSlotProps) {
  const config = getToolAdPlacement(placement);
  const isEnabled = enabled ?? config.enabled;

  if (!isEnabled || mode === 'disabled') {
    return null;
  }

  // Reserved for future AdSense: client ID, slot ID, consent gate, and script loader.
  if (mode === 'live') {
    return (
      <aside
        data-ad-placement={placement}
        data-ad-mode="live-pending"
        aria-label="Advertisement"
        className={`flex w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 ${SIZE_CLASS[config.size]} ${className}`}
      >
        <p className="px-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Advertisement
        </p>
      </aside>
    );
  }

  return (
    <aside
      data-ad-placement={placement}
      data-ad-mode="placeholder"
      aria-label="Advertisement"
      className={`flex w-full max-w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-border bg-[#F7F8F6] px-3 py-4 text-center ${SIZE_CLASS[config.size]} ${className}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Advertisement
      </p>
      {config.description ? (
        <p className="max-w-sm text-[11px] font-normal text-muted-foreground/80">
          {config.description}
        </p>
      ) : null}
    </aside>
  );
}
