'use client';

import type { CurtainPanelType } from './types';
import { PANEL_TYPE_LABELS } from './types';

export function CurtainPanelDiagram({
  panelType,
  numberOfPanels,
}: {
  panelType: CurtainPanelType;
  numberOfPanels: number;
}) {
  const n = Math.min(Math.max(numberOfPanels, 1), 4);
  const panelW = 180 / n;

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        {PANEL_TYPE_LABELS[panelType]} preview
      </p>
      <svg
        viewBox="0 0 240 160"
        className="mx-auto h-auto w-full max-w-[240px]"
        role="img"
        aria-label={`Conceptual ${PANEL_TYPE_LABELS[panelType]} with ${n} panel(s) on a rod over a window.`}
      >
        {/* Window */}
        <rect
          x="40"
          y="36"
          width="160"
          height="100"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        {/* Rod */}
        <line
          x1="28"
          y1="30"
          x2="212"
          y2="30"
          stroke="#163c43"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Panels */}
        {Array.from({ length: n }).map((_, i) => {
          const x = 30 + i * panelW;
          const gather =
            panelType === 'gathered' || panelType === 'standard';
          return (
            <g key={i}>
              <path
                d={
                  gather
                    ? `M${x + 4} 32 Q${x + panelW / 2} 50 ${x + 4} 140 L${x + panelW - 4} 140 Q${x + panelW / 2} 50 ${x + panelW - 4} 32 Z`
                    : `M${x + 2} 32 L${x + panelW - 2} 32 L${x + panelW - 6} 140 L${x + 6} 140 Z`
                }
                fill="#d4e4e8"
                stroke="#163c43"
                strokeWidth="1.2"
                opacity={0.95}
              />
              {panelType === 'grommet'
                ? Array.from({ length: 3 }).map((_, g) => (
                    <circle
                      key={g}
                      cx={x + 8 + g * ((panelW - 16) / 2)}
                      cy={36}
                      r="3"
                      fill="none"
                      stroke="#c45c6a"
                      strokeWidth="1.5"
                    />
                  ))
                : null}
            </g>
          );
        })}
        <text x="120" y="156" textAnchor="middle" fontSize="9" fill="#163c43">
          Conceptual preview — not a cutting diagram
        </text>
      </svg>
    </div>
  );
}
