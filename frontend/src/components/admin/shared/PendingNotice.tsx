'use client';

import * as React from 'react';
import { Info, X } from 'lucide-react';

interface PendingNoticeProps {
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export function PendingNotice({
  message = 'Backend integration pending: In this UI phase, administrative mutations (Save, Delete, Publish, Upload) are development previews and are not persisted to MongoDB or the Express API.',
  onDismiss,
  className,
}: PendingNoticeProps) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-teal-200 bg-secondary/40 p-4 text-xs text-primary shadow-xs ${className ?? ''}`}
      role="alert"
    >
      <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
      <div className="flex-1 leading-relaxed">
        <strong className="font-semibold block sm:inline">Development UI Preview: </strong>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="text-primary/70 hover:text-primary rounded-md p-0.5"
          aria-label="Dismiss notice"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

