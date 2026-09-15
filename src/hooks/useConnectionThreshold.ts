import { useRef, useState } from 'react';

export type ConnectionThreshold = 0 | 1 | 2 | 3;

export function useConnectionThreshold() {
  const resolverRef = useRef<((value: ConnectionThreshold) => void) | null>(null);
  const [filterPromptVisible, setFilterPromptVisible] = useState(false);
  const [filterInfo, setFilterInfo] = useState({ count: 0, eligibleCount: 0 });

  const askConnectionThreshold = (count: number, eligibleCount: number): Promise<ConnectionThreshold> => {
    setFilterInfo({ count, eligibleCount });
    setFilterPromptVisible(true);
    return new Promise<ConnectionThreshold>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleFilterChoose = (threshold: 1 | 2 | 3) => {
    setFilterPromptVisible(false);
    resolverRef.current?.(threshold);
  };

  const handleFilterCancel = () => {
    setFilterPromptVisible(false);
    resolverRef.current?.(0);
  };

  return {
    filterPromptVisible,
    filterInfo,
    askConnectionThreshold,
    handleFilterChoose,
    handleFilterCancel,
  };
}
