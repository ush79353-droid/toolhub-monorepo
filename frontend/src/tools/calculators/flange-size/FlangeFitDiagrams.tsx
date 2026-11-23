/** Original Omega SVG guides (not third-party art). */

import type { ReactNode } from 'react';

export function FlangeFitExamples() {
  return (
    <div
      className="rounded-xl border border-border bg-muted/15 p-4"
      role="group"
      aria-label="How big should your flange be"
    >
      <h3 className="text-sm font-semibold text-accent">
        How big should your flange be?
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <FitCard
          title="Too small"
          caption="Nipple rubs the tunnel walls."
          tone="warn"
        >
          <TunnelSvg variant="tooSmall" />
        </FitCard>
        <FitCard
          title="Correct fit"
          caption="Small clearance; little areola drawn in."
          tone="ok"
        >
          <TunnelSvg variant="correct" />
        </FitCard>
        <FitCard
          title="Too large"
          caption="Much of the areola is pulled into the tunnel."
          tone="warn"
        >
          <TunnelSvg variant="tooLarge" />
        </FitCard>
      </div>
    </div>
  );
}

export function NippleMeasureDiagram() {
  return (
    <div
      className="rounded-xl border border-border bg-muted/15 p-4"
      role="img"
      aria-label="Measure nipple base diameter across the middle, excluding the areola"
    >
      <h3 className="text-sm font-semibold text-accent">
        How to measure your nipple size?
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Measure the diameter at the nipple base (widest point where nipple meets
        areola). Do not include the areola.
      </p>
      <svg
        viewBox="0 0 320 160"
        className="mt-3 h-auto w-full max-w-md text-accent"
        aria-hidden="true"
      >
        {/* Side profile */}
        <ellipse cx="70" cy="90" rx="42" ry="48" fill="#f8e8e4" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="95" cy="90" rx="14" ry="18" fill="#e8b4a8" stroke="currentColor" strokeWidth="1.2" />
        <text x="70" y="28" textAnchor="middle" className="fill-current" fontSize="11">
          Side
        </text>
        <text x="55" y="150" textAnchor="middle" fontSize="10" fill="#64748b">
          areola
        </text>
        <text x="110" y="150" textAnchor="middle" fontSize="10" fill="#64748b">
          nipple
        </text>

        {/* Front view with diameter marks */}
        <circle cx="230" cy="90" r="48" fill="#f8e8e4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="230" cy="90" r="16" fill="#e8b4a8" stroke="currentColor" strokeWidth="1.2" />
        <line
          x1="214"
          y1="90"
          x2="246"
          y2="90"
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
        <line x1="214" y1="84" x2="214" y2="96" stroke="#2563eb" strokeWidth="2" />
        <line x1="246" y1="84" x2="246" y2="96" stroke="#2563eb" strokeWidth="2" />
        <text x="230" y="28" textAnchor="middle" fontSize="11" fill="currentColor">
          Front — base diameter
        </text>
        <text x="230" y="150" textAnchor="middle" fontSize="10" fill="#2563eb">
          nipple base (exclude areola)
        </text>
      </svg>
    </div>
  );
}

function FitCard({
  title,
  caption,
  tone,
  children,
}: {
  title: string;
  caption: string;
  tone: 'ok' | 'warn';
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <div className="flex justify-center">{children}</div>
      <p
        className={`mt-2 text-center text-xs font-semibold ${
          tone === 'ok' ? 'text-emerald-700' : 'text-amber-700'
        }`}
      >
        {title}
      </p>
      <p className="mt-1 text-center text-[11px] leading-snug text-muted-foreground">
        {caption}
      </p>
    </div>
  );
}

function TunnelSvg({
  variant,
}: {
  variant: 'tooSmall' | 'correct' | 'tooLarge';
}) {
  const tunnelW = variant === 'tooSmall' ? 18 : variant === 'correct' ? 28 : 44;
  const areolaPull = variant === 'tooLarge' ? 22 : variant === 'correct' ? 8 : 4;
  return (
    <svg
      viewBox="0 0 80 90"
      className="h-20 w-20"
      aria-hidden="true"
    >
      <title>
        {variant === 'tooSmall'
          ? 'Flange tunnel too small'
          : variant === 'correct'
            ? 'Flange tunnel correct fit'
            : 'Flange tunnel too large'}
      </title>
      {/* breast mound */}
      <path
        d="M10 70 Q40 40 70 70 L70 90 L10 90 Z"
        fill="#f8e8e4"
        stroke="#163c43"
        strokeWidth="1"
      />
      {/* tunnel */}
      <rect
        x={(80 - tunnelW) / 2}
        y="8"
        width={tunnelW}
        height="52"
        rx="4"
        fill="#e8f0fe"
        stroke="#163c43"
        strokeWidth="1.2"
      />
      {/* nipple */}
      <ellipse
        cx="40"
        cy={70 - areolaPull / 2}
        rx={variant === 'tooSmall' ? 9 : 7}
        ry={12 + areolaPull / 3}
        fill="#e8b4a8"
        stroke="#163c43"
        strokeWidth="1"
      />
    </svg>
  );
}
