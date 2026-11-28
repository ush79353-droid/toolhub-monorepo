'use client';

import type { JeansMeasurementMethod } from './types';

interface JeansMeasureDiagramProps {
  method: JeansMeasurementMethod;
}

export function JeansMeasureDiagram({ method }: JeansMeasureDiagramProps) {
  if (method === 'existing-jeans') {
    return (
      <figure className="rounded-xl border border-border bg-muted/15 p-3">
        <svg
          viewBox="0 0 320 180"
          className="mx-auto h-auto w-full max-w-md"
          role="img"
          aria-labelledby="jeans-flat-title jeans-flat-desc"
        >
          <title id="jeans-flat-title">Measuring jeans laid flat</title>
          <desc id="jeans-flat-desc">
            Pair of jeans laid flat with flat waistband width and inseam
            length marked.
          </desc>
          <path
            d="M90 30 H230 L245 55 L250 160 H200 L180 70 H140 L120 160 H70 L75 55 Z"
            fill="#eff6ff"
            stroke="#163c43"
            strokeWidth="2"
          />
          <line
            x1="95"
            y1="35"
            x2="225"
            y2="35"
            stroke="#e11d48"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text x="160" y="28" textAnchor="middle" fontSize="11" fill="#e11d48">
            Flat waistband width
          </text>
          <line
            x1="160"
            y1="70"
            x2="160"
            y2="155"
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text x="175" y="115" fontSize="11" fill="#2563eb">
            Inseam
          </text>
          <circle cx="160" cy="68" r="3" fill="#163c43" />
          <text x="160" y="175" textAnchor="middle" fontSize="11" fill="#163c43">
            Circumference ≈ 2 × flat width
          </text>
        </svg>
      </figure>
    );
  }

  return (
    <figure className="rounded-xl border border-border bg-muted/15 p-3">
      <svg
        viewBox="0 0 280 200"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-labelledby="jeans-body-title jeans-body-desc"
      >
        <title id="jeans-body-title">Body waist and inseam measurement</title>
        <desc id="jeans-body-desc">
          Lower-body silhouette with waist circumference and inseam from crotch
          to hem.
        </desc>
        <ellipse
          cx="140"
          cy="45"
          rx="42"
          ry="14"
          fill="none"
          stroke="#e11d48"
          strokeWidth="2.5"
          strokeDasharray="5 3"
        />
        <text x="140" y="28" textAnchor="middle" fontSize="11" fill="#e11d48">
          Waist circumference
        </text>
        <path
          d="M105 50 Q140 55 175 50 L185 110 Q140 125 95 110 Z"
          fill="#f8fafc"
          stroke="#163c43"
          strokeWidth="2"
        />
        <path
          d="M110 110 L100 185 M170 110 L180 185"
          fill="none"
          stroke="#163c43"
          strokeWidth="2"
        />
        <line
          x1="140"
          y1="118"
          x2="140"
          y2="185"
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <circle cx="140" cy="115" r="3" fill="#163c43" />
        <text x="155" y="155" fontSize="11" fill="#2563eb">
          Inseam (L)
        </text>
        <text x="140" y="198" textAnchor="middle" fontSize="10" fill="#64748b">
          Measure at the intended waistband position
        </text>
      </svg>
    </figure>
  );
}
