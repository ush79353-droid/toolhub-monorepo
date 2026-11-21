'use client';

import type { DeadweightLossGraph } from './types';

interface DeadweightLossGraphProps {
  graph: DeadweightLossGraph;
}

const W = 360;
const H = 220;
const PAD = { l: 44, r: 16, t: 16, b: 36 };

function mapX(q: number, qMax: number): number {
  return PAD.l + (q / qMax) * (W - PAD.l - PAD.r);
}

function mapY(p: number, pMax: number): number {
  return H - PAD.b - (p / pMax) * (H - PAD.t - PAD.b);
}

function polyPoints(
  pts: { q: number; p: number }[],
  qMax: number,
  pMax: number
): string {
  return pts
    .map((pt) => `${mapX(pt.q, qMax)},${mapY(Math.max(0, pt.p), pMax)}`)
    .join(' ');
}

export function DeadweightLossGraphView({ graph }: DeadweightLossGraphProps) {
  const { qMax, pMax } = graph;
  const safeQ = qMax > 0 ? qMax : 1;
  const safeP = pMax > 0 ? pMax : 1;

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        {graph.labels.title}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Deadweight loss diagram: efficient quantity ${graph.qEfficient}, distorted quantity ${graph.qDistorted}`}
      >
        {/* Axes */}
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          stroke="currentColor"
          className="text-border"
          strokeWidth={1.5}
        />
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={H - PAD.b}
          stroke="currentColor"
          className="text-border"
          strokeWidth={1.5}
        />
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          Quantity
        </text>
        <text
          x={14}
          y={(PAD.t + H - PAD.b) / 2}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
          transform={`rotate(-90 14 ${(PAD.t + H - PAD.b) / 2})`}
        >
          Price
        </text>

        {graph.kind === 'linear' && graph.demandPoints ? (
          <polyline
            fill="none"
            stroke="#0d9488"
            strokeWidth={2}
            points={polyPoints(graph.demandPoints, safeQ, safeP)}
          />
        ) : null}
        {graph.kind === 'linear' && graph.supplyPoints ? (
          <polyline
            fill="none"
            stroke="#ea580c"
            strokeWidth={2}
            points={polyPoints(graph.supplyPoints, safeQ, safeP)}
          />
        ) : null}

        <polygon
          points={polyPoints(graph.dwlPolygon, safeQ, safeP)}
          fill="rgba(244, 63, 94, 0.35)"
          stroke="#e11d48"
          strokeWidth={1.25}
        />

        {/* Markers */}
        <line
          x1={mapX(graph.qDistorted, safeQ)}
          y1={PAD.t}
          x2={mapX(graph.qDistorted, safeQ)}
          y2={H - PAD.b}
          stroke="#64748b"
          strokeDasharray="4 3"
          strokeWidth={1}
        />
        <line
          x1={mapX(graph.qEfficient, safeQ)}
          y1={PAD.t}
          x2={mapX(graph.qEfficient, safeQ)}
          y2={H - PAD.b}
          stroke="#475569"
          strokeDasharray="4 3"
          strokeWidth={1}
        />
        <text
          x={mapX(graph.qDistorted, safeQ)}
          y={PAD.t + 10}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Qd
        </text>
        <text
          x={mapX(graph.qEfficient, safeQ)}
          y={PAD.t + 10}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Qe
        </text>

        {graph.kind === 'linear' ? (
          <>
            <text x={W - PAD.r - 4} y={PAD.t + 14} textAnchor="end" fontSize={9} fill="#0d9488">
              Demand
            </text>
            <text x={W - PAD.r - 4} y={PAD.t + 26} textAnchor="end" fontSize={9} fill="#ea580c">
              Supply
            </text>
          </>
        ) : (
          <text
            x={(mapX(graph.qDistorted, safeQ) + mapX(graph.qEfficient, safeQ)) / 2}
            y={mapY((graph.pLow + graph.pHigh) / 2, safeP) - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#e11d48"
            fontWeight={600}
          >
            DWL
          </text>
        )}
      </svg>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {graph.labels.note}
      </p>
    </figure>
  );
}
