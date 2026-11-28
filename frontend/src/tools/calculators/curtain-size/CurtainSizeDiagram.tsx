'use client';

import type { CurtainType } from './types';
import { CURTAIN_TYPE_LABELS } from './types';

export function CurtainSizeDiagram({
  curtainType,
  numberOfPanels,
}: {
  curtainType: CurtainType;
  numberOfPanels: number;
}) {
  const n = Math.min(Math.max(numberOfPanels, 1), 4);
  const panelW = 160 / n;
  const bottomY =
    curtainType === 'cafe' ? 100 : curtainType === 'extra-long' ? 148 : 118;

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        {CURTAIN_TYPE_LABELS[curtainType]} preview
      </p>
      <svg
        viewBox="0 0 240 170"
        className="mx-auto h-auto w-full max-w-[240px]"
        role="img"
        aria-label={`Conceptual ${CURTAIN_TYPE_LABELS[curtainType]} with ${n} panel(s).`}
      >
        <rect
          x="50"
          y="40"
          width="140"
          height="80"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        {/* Floor line for extra-long */}
        {curtainType === 'extra-long' ? (
          <line
            x1="20"
            y1="150"
            x2="220"
            y2="150"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        ) : null}
        {/* Rod */}
        <line
          x1={curtainType === 'cafe' ? 55 : 30}
          y1={curtainType === 'cafe' ? 78 : 32}
          x2={curtainType === 'cafe' ? 185 : 210}
          y2={curtainType === 'cafe' ? 78 : 32}
          stroke="#163c43"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {Array.from({ length: n }).map((_, i) => {
          const x =
            (curtainType === 'cafe' ? 55 : 40) +
            i * (curtainType === 'cafe' ? 130 / n : panelW);
          const w = curtainType === 'cafe' ? 130 / n : panelW;
          const top = curtainType === 'cafe' ? 80 : 34;
          return (
            <path
              key={i}
              d={`M${x + 2} ${top} Q${x + w / 2} ${top + 12} ${x + 2} ${bottomY} L${x + w - 2} ${bottomY} Q${x + w / 2} ${top + 12} ${x + w - 2} ${top} Z`}
              fill="#d4e4e8"
              stroke="#163c43"
              strokeWidth="1.2"
              opacity={0.95}
            />
          );
        })}
        <text x="120" y="165" textAnchor="middle" fontSize="9" fill="#163c43">
          Conceptual preview — not to scale
        </text>
      </svg>
    </div>
  );
}
