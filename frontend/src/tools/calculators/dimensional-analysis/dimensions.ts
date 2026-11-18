export type DimensionVector = {
  M: number;
  L: number;
  T: number;
  I: number;
  theta: number;
  N: number;
  J: number;
};

export const ZERO_DIM: DimensionVector = {
  M: 0,
  L: 0,
  T: 0,
  I: 0,
  theta: 0,
  N: 0,
  J: 0,
};

export function dim(
  partial: Partial<DimensionVector> = {},
): DimensionVector {
  return { ...ZERO_DIM, ...partial };
}

export function multiplyDims(a: DimensionVector, b: DimensionVector): DimensionVector {
  return {
    M: a.M + b.M,
    L: a.L + b.L,
    T: a.T + b.T,
    I: a.I + b.I,
    theta: a.theta + b.theta,
    N: a.N + b.N,
    J: a.J + b.J,
  };
}

export function divideDims(a: DimensionVector, b: DimensionVector): DimensionVector {
  return {
    M: a.M - b.M,
    L: a.L - b.L,
    T: a.T - b.T,
    I: a.I - b.I,
    theta: a.theta - b.theta,
    N: a.N - b.N,
    J: a.J - b.J,
  };
}

export function powerDims(a: DimensionVector, n: number): DimensionVector {
  return {
    M: a.M * n,
    L: a.L * n,
    T: a.T * n,
    I: a.I * n,
    theta: a.theta * n,
    N: a.N * n,
    J: a.J * n,
  };
}

export function dimsEqual(a: DimensionVector, b: DimensionVector): boolean {
  return (
    a.M === b.M &&
    a.L === b.L &&
    a.T === b.T &&
    a.I === b.I &&
    a.theta === b.theta &&
    a.N === b.N &&
    a.J === b.J
  );
}

function formatExponent(n: number): string {
  if (n === 1) return '';
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return String(n)
    .split('')
    .map((c) => map[c] ?? c)
    .join('');
}

export function formatDimension(d: DimensionVector): string {
  const parts: string[] = [];
  const entries: Array<[keyof DimensionVector, string]> = [
    ['M', 'M'],
    ['L', 'L'],
    ['T', 'T'],
    ['I', 'I'],
    ['theta', 'Θ'],
    ['N', 'N'],
    ['J', 'J'],
  ];
  for (const [key, symbol] of entries) {
    const exp = d[key];
    if (exp === 0) continue;
    parts.push(`${symbol}${formatExponent(exp)}`);
  }
  if (parts.length === 0) return '1 (dimensionless)';
  return parts.join('');
}
