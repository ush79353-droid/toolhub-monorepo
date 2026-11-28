'use client';

import type { FabricResult } from './types';

export function FabricCuttingDiagram({
  result,
}: {
  result: FabricResult | null;
}) {
  if (!result || result.piecesAcross <= 0 || result.rowsRequired <= 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-3 text-xs text-muted-foreground">
        Enter valid dimensions to preview a cutting layout.
      </div>
    );
  }

  const cols = Math.min(result.piecesAcross, 12);
  const rows = Math.min(result.rowsRequired, 8);
  const summarize =
    result.piecesAcross > 12 || result.rowsRequired > 8;
  const cellW = 200 / cols;
  const cellH = 100 / rows;
  let drawn = 0;
  const total = result.piecesAcross * result.rowsRequired;
  // Approximate pieces needed for highlight when summarizing
  const need = Math.min(
    result.piecesInLastRow +
      (result.rowsRequired - 1) * result.piecesAcross,
    total,
  );

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Cutting layout preview
      </p>
      <svg
        viewBox="0 0 220 130"
        className="mx-auto h-auto w-full max-w-[280px]"
        role="img"
        aria-label={`${result.piecesAcross} pieces across, ${result.rowsRequired} rows. Conceptual cutting diagram.`}
      >
        <rect
          x="10"
          y="10"
          width="200"
          height="100"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const idx = r * cols + c;
            // Map summarized grid proportionally for fill highlight
            const filled =
              !summarize
                ? r * result.piecesAcross + c <
                  (result.rowsRequired - 1) * result.piecesAcross +
                    result.piecesInLastRow
                : idx < Math.ceil((need / total) * cols * rows);
            if (filled) drawn += 1;
            return (
              <rect
                key={`${r}-${c}`}
                x={10 + c * cellW + 1}
                y={10 + r * cellH + 1}
                width={cellW - 2}
                height={cellH - 2}
                fill={filled ? '#d4e4e8' : '#f8fafc'}
                stroke="#163c43"
                strokeWidth="0.8"
                opacity={filled ? 1 : 0.5}
              />
            );
          }),
        )}
        <text x="110" y="124" textAnchor="middle" fontSize="9" fill="#163c43">
          {summarize
            ? `Summarized (${result.piecesAcross}×${result.rowsRequired})`
            : `${result.piecesAcross} across · ${result.rowsRequired} rows`}
        </text>
      </svg>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        Conceptual — not a nested packing optimizer ({drawn} cells shown)
      </p>
    </div>
  );
}
