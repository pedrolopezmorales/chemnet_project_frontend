const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true' || process.env.NODE_ENV === 'development';

export const debugLog = (...args: unknown[]) => {
  if (DEBUG_ENABLED) {
    console.log(...args);
  }
};

export const debugWarn = (...args: unknown[]) => {
  if (DEBUG_ENABLED) {
    console.warn(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (DEBUG_ENABLED) {
    console.error(...args);
  }
};
