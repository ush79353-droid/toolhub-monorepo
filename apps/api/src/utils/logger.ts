type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.log(formatLog('info', message, context));
  },
  warn(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.warn(formatLog('warn', message, context));
  },
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, ...context }
        : { rawError: error, ...context };
    // eslint-disable-next-line no-console
    console.error(formatLog('error', message, errorDetails));
  },
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(formatLog('debug', message, context));
    }
  },
};

