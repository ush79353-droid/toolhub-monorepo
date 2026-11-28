'use client';

interface WindsockDiagramProps {
  segments: number;
  aboveRange?: boolean;
}

/** Schematic five-segment windsock — not an aerodynamic simulation. */
export function WindsockDiagram({
  segments,
  aboveRange = false,
}: WindsockDiagramProps) {
  const n = Math.max(0, Math.min(5, Math.round(segments)));
  // Angle from droop (80°) toward horizontal (8°)
  const angle = 80 - (n / 5) * 72;
  const tipX = 70 + Math.cos((angle * Math.PI) / 180) * 140;
  const tipY = 100 + Math.sin((angle * Math.PI) / 180) * 140;

  const colors = ['#dc2626', '#f8fafc', '#dc2626', '#f8fafc', '#dc2626'];

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Windsock schematic
      </p>
      <svg
        viewBox="0 0 280 180"
        className="h-auto w-full max-w-full"
        role="img"
        aria-label={`Schematic windsock with approximately ${n} of 5 segments extended${aboveRange ? ', above model range' : ''}.`}
      >
        {/* Mast */}
        <line
          x1="70"
          y1="20"
          x2="70"
          y2="160"
          stroke="#163c43"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="70" cy="28" r="6" fill="#163c43" />

        {/* Sock body as tapering bands along the ray */}
        {Array.from({ length: 5 }, (_, i) => {
          const t0 = i / 5;
          const t1 = (i + 1) / 5;
          const active = i < n;
          const x0 = 70 + (tipX - 70) * t0;
          const y0 = 28 + (tipY - 28) * t0;
          const x1 = 70 + (tipX - 70) * t1;
          const y1 = 28 + (tipY - 28) * t1;
          const w0 = 22 * (1 - t0 * 0.7);
          const w1 = 22 * (1 - t1 * 0.7);
          const dx = tipX - 70;
          const dy = tipY - 28;
          const len = Math.hypot(dx, dy) || 1;
          const nx = (-dy / len) * 1;
          const ny = (dx / len) * 1;
          const points = [
            `${x0 + nx * w0},${y0 + ny * w0}`,
            `${x1 + nx * w1},${y1 + ny * w1}`,
            `${x1 - nx * w1},${y1 - ny * w1}`,
            `${x0 - nx * w0},${y0 - ny * w0}`,
          ].join(' ');
          return (
            <polygon
              key={i}
              points={points}
              fill={active ? colors[i] : '#cbd5e1'}
              stroke="#64748b"
              strokeWidth="0.8"
              opacity={active ? 1 : 0.45}
            />
          );
        })}

        <text x="12" y="172" className="fill-muted-foreground text-[9px]">
          {n}/5 segments · schematic only
          {aboveRange ? ' · model saturated' : ''}
        </text>
      </svg>
    </div>
  );
}
