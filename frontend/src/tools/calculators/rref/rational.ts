/** Exact rational arithmetic for RREF (no floating-point elimination). */

function assertFiniteInt(n: number, label: string): number {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new Error(`${label} must be a finite integer`);
  }
  return n;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export class Rational {
  readonly n: number;
  readonly d: number;

  constructor(numerator: number, denominator = 1) {
    const n0 = assertFiniteInt(numerator, 'numerator');
    const d0 = assertFiniteInt(denominator, 'denominator');
    if (d0 === 0) throw new Error('Division by zero');
    const sign = n0 === 0 ? 1 : (n0 < 0 ? -1 : 1) * (d0 < 0 ? -1 : 1);
    const an = Math.abs(n0);
    const ad = Math.abs(d0);
    const g = gcd(an, ad) || 1;
    this.n = sign * (an / g);
    this.d = ad / g;
  }

  static zero(): Rational {
    return new Rational(0, 1);
  }

  static one(): Rational {
    return new Rational(1, 1);
  }

  static fromInt(n: number): Rational {
    return new Rational(n, 1);
  }

  isZero(): boolean {
    return this.n === 0;
  }

  isOne(): boolean {
    return this.n === 1 && this.d === 1;
  }

  abs(): Rational {
    return new Rational(Math.abs(this.n), this.d);
  }

  neg(): Rational {
    return new Rational(-this.n, this.d);
  }

  inv(): Rational {
    if (this.n === 0) throw new Error('Division by zero');
    return new Rational(this.d, this.n);
  }

  add(other: Rational): Rational {
    return new Rational(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  sub(other: Rational): Rational {
    return new Rational(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  mul(other: Rational): Rational {
    return new Rational(this.n * other.n, this.d * other.d);
  }

  div(other: Rational): Rational {
    if (other.n === 0) throw new Error('Division by zero');
    return new Rational(this.n * other.d, this.d * other.n);
  }

  equals(other: Rational): boolean {
    return this.n === other.n && this.d === other.d;
  }

  compareAbs(other: Rational): number {
    const left = Math.abs(this.n) * other.d;
    const right = Math.abs(other.n) * this.d;
    return left === right ? 0 : left < right ? -1 : 1;
  }

  toString(): string {
    if (this.d === 1) return String(this.n);
    return `${this.n}/${this.d}`;
  }
}

export type Matrix = Rational[][];

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => row.map((cell) => new Rational(cell.n, cell.d)));
}

export function matricesEqual(a: Matrix, b: Matrix): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j += 1) {
      if (!a[i][j].equals(b[i][j])) return false;
    }
  }
  return true;
}

export function formatMatrix(matrix: Matrix): string[][] {
  return matrix.map((row) => row.map((cell) => cell.toString()));
}
