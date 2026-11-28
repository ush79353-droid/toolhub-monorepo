'use client';

type Focus = 'bust' | 'waist' | 'hips' | null;

export function DressMeasureDiagram({ focus }: { focus: Focus }) {
  const stroke = (key: Focus) =>
    focus === key ? '#c45c6a' : '#163c43';
  const width = (key: Focus) => (focus === key ? 2.5 : 1.4);

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Measurement guide
      </p>
      <svg
        viewBox="0 0 160 220"
        className="mx-auto h-auto w-full max-w-[160px]"
        role="img"
        aria-label="Abstract body outline showing bust, waist, and hip measurement lines."
      >
        {/* Abstract silhouette */}
        <ellipse cx="80" cy="28" rx="16" ry="18" fill="#e8eef0" stroke="#163c43" strokeWidth="1.2" />
        <path
          d="M55 48 Q80 52 105 48 L112 95 Q80 105 48 95 Z"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <path
          d="M52 95 Q80 100 108 95 L105 145 Q80 155 55 145 Z"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <path
          d="M58 145 L55 210 M102 145 L105 210"
          fill="none"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        {/* Bust */}
        <line
          x1="42"
          y1="72"
          x2="118"
          y2="72"
          stroke={stroke('bust')}
          strokeWidth={width('bust')}
          strokeDasharray={focus === 'bust' ? undefined : '3 2'}
        />
        <text x="122" y="75" fontSize="9" fill={stroke('bust')}>
          Bust
        </text>
        {/* Waist */}
        <line
          x1="50"
          y1="108"
          x2="110"
          y2="108"
          stroke={stroke('waist')}
          strokeWidth={width('waist')}
          strokeDasharray={focus === 'waist' ? undefined : '3 2'}
        />
        <text x="114" y="111" fontSize="9" fill={stroke('waist')}>
          Waist
        </text>
        {/* Hips */}
        <line
          x1="44"
          y1="148"
          x2="116"
          y2="148"
          stroke={stroke('hips')}
          strokeWidth={width('hips')}
          strokeDasharray={focus === 'hips' ? undefined : '3 2'}
        />
        <text x="120" y="151" fontSize="9" fill={stroke('hips')}>
          Hips
        </text>
      </svg>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        Schematic — not a body scan
      </p>
    </div>
  );
}
