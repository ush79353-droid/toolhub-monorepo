'use client';

import type { LfprResult } from './types';

interface LfprCompositionChartProps {
  result: LfprResult;
}

const R = 54;
const CX = 70;
const CY = 70;
const STROKE = 22;

function arcPath(startAngle: number, endAngle: number): string {
  const toXY = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };
  const start = toXY(startAngle);
  const end = toXY(endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function LfprCompositionChart({ result }: LfprCompositionChartProps) {
  const total = result.workingAgePopulation;
  if (!(total > 0)) return null;

  const employedShare = result.employedPopulation / total;
  const unemployedShare = result.unemployedPopulation / total;
  const outsideShare = result.notInLaborForce / total;

  const a1 = employedShare * 360;
  const a2 = a1 + unemployedShare * 360;
  const a3 = 360;

  const segments = [
    {
      label: 'Employed',
      value: result.formattedEmployed,
      color: '#0f766e',
      d:
        employedShare > 0
          ? arcPath(0, Math.max(a1, 0.01))
          : '',
    },
    {
      label: 'Unemployed',
      value: result.formattedUnemployed,
      color: '#ea580c',
      d:
        unemployedShare > 0
          ? arcPath(a1, Math.max(a2, a1 + 0.01))
          : '',
    },
    {
      label: 'Not in labor force',
      value: result.formattedNotInLaborForce,
      color: '#94a3b8',
      d:
        outsideShare > 0
          ? arcPath(a2, Math.max(a3, a2 + 0.01))
          : '',
    },
  ];

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Population composition (sums to working-age total)
      </figcaption>
      <div className="flex flex-wrap items-center gap-4">
        <svg
          viewBox="0 0 140 140"
          className="h-36 w-36 shrink-0"
          role="img"
          aria-label={`Employed ${result.formattedEmployed}, unemployed ${result.formattedUnemployed}, not in labor force ${result.formattedNotInLaborForce}, total ${result.formattedWorkingAge}`}
        >
          {segments.map((s) =>
            s.d ? (
              <path
                key={s.label}
                d={s.d}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeLinecap="butt"
              />
            ) : null
          )}
          <circle cx={CX} cy={CY} r={R - STROKE / 2 - 2} fill="white" />
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            className="fill-accent"
          >
            {result.formattedLfpr}
          </text>
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            fontSize={8}
            className="fill-muted-foreground"
          >
            LFPR
          </text>
        </svg>
        <ul className="space-y-1.5 text-xs text-accent">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span>
                {s.label}: {s.value}
              </span>
            </li>
          ))}
          <li className="pt-1 font-medium">
            Total: {result.formattedWorkingAge}
          </li>
          <li className="text-muted-foreground">
            Participating {result.formattedLfpr} · Outside{' '}
            {result.formattedOutsideShare}
          </li>
          <li className="text-muted-foreground">
            Unemployment uses labor force only:{' '}
            {result.formattedUnemploymentRate}
          </li>
        </ul>
      </div>
    </figure>
  );
}
