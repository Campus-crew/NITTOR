import { useEffect, useRef, useCallback } from 'react';
import { AUTO_SAVE_DELAY } from '@/lib/constants';

/**
 * Auto-save hook with debouncing
 * Automatically saves data after changes with a delay
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  options: {
    delay?: number;
    enabled?: boolean;
  } = {}
) {
  const { delay = AUTO_SAVE_DELAY, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      await onSave(data);
      console.log('💾 Auto-saved at', new Date().toLocaleTimeString(undefined, {}));
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Check if data changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        save();
      }, delay);

      previousDataRef.current = data;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  return { save };
}
