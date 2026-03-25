type LogPayload = Record<string, unknown> | string | number | boolean | null;

type LogMethod = (payload?: LogPayload, message?: string) => void;

type Logger = {
  child: (context?: Record<string, unknown>) => Logger;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
};

const write =
  (level: "info" | "warn" | "error", context: Record<string, unknown>): LogMethod =>
  (payload, message) => {
    const prefix = `[${level.toUpperCase()}]`;
    if (message !== undefined) {
      console[level](prefix, message, {
        ...context,
        payload,
      });
      return;
    }

    if (payload !== undefined) {
      console[level](prefix, {
        ...context,
        payload,
      });
      return;
    }

    console[level](prefix, context);
  };

const createLogger = (context: Record<string, unknown> = {}): Logger => ({
  child: (nextContext = {}) => createLogger({ ...context, ...nextContext }),
  info: write("info", context),
  warn: write("warn", context),
  error: write("error", context),
});

export const logger = createLogger();
