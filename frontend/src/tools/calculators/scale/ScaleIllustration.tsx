/** Compact original Map / Reality diagram (decorative; labeled in surrounding copy). */
export function ScaleIllustration() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
      aria-hidden="true"
    >
      <div className="rounded-xl border border-border bg-muted/40 px-3 py-3">
        <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Map / Drawing
        </p>
        <svg viewBox="0 0 160 88" className="mx-auto mt-2 h-20 w-full max-w-[200px]">
          <rect x="18" y="14" width="124" height="60" rx="6" fill="#E8F4F5" stroke="#087E8B" strokeWidth="1.5" />
          <path d="M28 62 L52 34 L78 54 L108 28 L138 58" fill="none" stroke="#163C43" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="52" cy="34" r="3" fill="#087E8B" />
          <circle cx="108" cy="28" r="3" fill="#087E8B" />
          <text x="80" y="78" textAnchor="middle" fontSize="9" fill="#163C43">
            Scaled size
          </text>
        </svg>
      </div>

      <div className="hidden text-center text-xs font-medium text-muted-foreground sm:block">
        <span className="block text-lg text-accent" aria-hidden="true">
          ↔
        </span>
        Scale
      </div>

      <div className="rounded-xl border border-border bg-brand-softTeal/50 px-3 py-3">
        <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Reality
        </p>
        <svg viewBox="0 0 160 88" className="mx-auto mt-2 h-20 w-full max-w-[200px]">
          <rect x="28" y="42" width="104" height="28" rx="3" fill="#CDE7EA" stroke="#087E8B" strokeWidth="1.5" />
          <polygon points="28,42 80,18 132,42" fill="#E8F4F5" stroke="#163C43" strokeWidth="1.5" />
          <rect x="70" y="52" width="20" height="18" fill="#087E8B" opacity="0.85" />
          <text x="80" y="82" textAnchor="middle" fontSize="9" fill="#163C43">
            Real size
          </text>
        </svg>
      </div>
    </div>
  );
}
