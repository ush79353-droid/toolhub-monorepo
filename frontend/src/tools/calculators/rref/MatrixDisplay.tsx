import * as React from 'react';

interface MatrixDisplayProps {
  matrix: string[][];
  /** Optional highlight for pivot columns (1-based). */
  pivotColumns?: readonly number[];
  className?: string;
  'aria-label'?: string;
}

export function MatrixDisplay({
  matrix,
  pivotColumns = [],
  className = '',
  'aria-label': ariaLabel = 'Matrix',
}: MatrixDisplayProps) {
  if (matrix.length === 0) return null;

  return (
    <div
      className={`overflow-x-auto overscroll-x-contain ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="inline-flex items-stretch gap-1.5 py-1">
        <span
          aria-hidden="true"
          className="w-1.5 shrink-0 rounded-l-md border-y border-l border-accent/70"
        />
        <table className="border-collapse text-sm tabular-nums">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={`r-${i}`}>
                {row.map((cell, j) => {
                  const isPivot = pivotColumns.includes(j + 1);
                  return (
                    <td
                      key={`c-${i}-${j}`}
                      className={`min-w-[2.75rem] px-2.5 py-1.5 text-center font-medium ${
                        isPivot ? 'text-primary' : 'text-accent'
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <span
          aria-hidden="true"
          className="w-1.5 shrink-0 rounded-r-md border-y border-r border-accent/70"
        />
      </div>
    </div>
  );
}
