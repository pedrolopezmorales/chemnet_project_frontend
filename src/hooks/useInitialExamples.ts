import { useEffect, useState } from 'react';
import { debugError } from '@/utils/logger';

export function useInitialExamples(loadExamples: () => Promise<string[]>, errorContext = 'Failed to load initial data') {
  const [examples, setExamples] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const loadedExamples = await loadExamples();
        if (isMounted) {
          setExamples(loadedExamples);
        }
      } catch (error) {
        debugError(errorContext, error);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  return examples;
}
