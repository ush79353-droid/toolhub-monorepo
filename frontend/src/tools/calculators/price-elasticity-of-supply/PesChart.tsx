'use client';

import type { PriceElasticityOfSupplyResult } from './types';

interface Props {
  result: PriceElasticityOfSupplyResult;
}

const W = 360;
const H = 200;
const PAD = { l: 48, r: 16, t: 16, b: 40 };

export function PesChart({ result }: Props) {
  if (
    result.p1 == null ||
    result.p2 == null ||
    result.q1 == null ||
    result.q2 == null
  ) {
    return null;
  }

  const qs = [result.q1, result.q2];
  const ps = [result.p1, result.p2];
  const minQ = Math.min(...qs, 0);
  const maxQ = Math.max(...qs, 1);
  const minP = Math.min(...ps, 0);
  const maxP = Math.max(...ps, 1);
  const qSpan = maxQ - minQ || 1;
  const pSpan = maxP - minP || 1;

  const sx = (q: number) =>
    PAD.l + ((q - minQ) / qSpan) * (W - PAD.l - PAD.r);
  const sy = (p: number) =>
    H - PAD.b - ((p - minP) / pSpan) * (H - PAD.t - PAD.b);

  const x1 = sx(result.q1);
  const y1 = sy(result.p1);
  const x2 = sx(result.q2);
  const y2 = sy(result.p2);
  const conventional = result.p2 >= result.p1 && result.q2 >= result.q1;

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs font-medium text-accent">
        Observed price–quantity supplied points
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Period 1 at quantity ${result.q1} and price ${result.p1}; Period 2 at quantity ${result.q2} and price ${result.p2}. Two observations only — not a full supply curve.`}
      >
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={conventional ? 'stroke-primary' : 'stroke-rose-400'}
          strokeWidth={2}
          strokeDasharray={conventional ? undefined : '4 3'}
        />
        <circle cx={x1} cy={y1} r={5} className="fill-primary" />
        <circle cx={x2} cy={y2} r={5} className="fill-rose-500" />
        <text
          x={W / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
        >
          Quantity supplied
        </text>
        <text
          x={12}
          y={H / 2}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
          transform={`rotate(-90 12 ${H / 2})`}
        >
          Price
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Blue = Period 1, red = Period 2. Connecting line shows the observed
        movement only — not an estimated full supply curve
        {!conventional
          ? '; opposite moves are not labeled as a conventional upward-sloping supply curve'
          : ''}
        .
      </p>
    </figure>
  );
}
