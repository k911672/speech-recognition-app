import { useCallback, type RefObject } from 'react';

// リアルタイムスクロールを行うフック
export const useAutoScroll = () => {
  const scrollToBottom = useCallback((ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const container = ref.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  return { scrollToBottom };
};