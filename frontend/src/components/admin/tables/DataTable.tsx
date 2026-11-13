import * as React from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className = '' }: DataTableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-border bg-white shadow-xs',
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs">{children}</table>
      </div>
    </div>
  );
}

export function DataTableHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={cn(
        'border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground',
        className
      )}
    >
      {children}
    </thead>
  );
}

export function DataTableBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tbody className={cn('divide-y divide-border text-foreground', className)}>{children}</tbody>
  );
}

export function DataTableRow({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn('transition-colors hover:bg-muted/40', onClick && 'cursor-pointer', className)}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className = '',
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={cn('px-4 py-3 align-middle', className)}>
      {children}
    </td>
  );
}

export function DataTableHeadCell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th scope="col" className={cn('px-4 py-3 align-middle whitespace-nowrap', className)}>
      {children}
    </th>
  );
}
