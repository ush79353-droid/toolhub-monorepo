'use client';

import * as React from 'react';
import Link from 'next/link';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface RowActionsProps {
  editHref?: string;
  viewHref?: string;
  onDelete?: () => void;
  deleteTitle?: string;
}

export function RowActions({ editHref, viewHref, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {viewHref && (
        <Link
          href={viewHref}
          target="_blank"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
          title="View public page"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only">View</span>
        </Link>
      )}

      {editHref && (
        <Link
          href={editHref}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
          title="Edit record"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Link>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
          title="Delete record"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </button>
      )}
    </div>
  );
}
