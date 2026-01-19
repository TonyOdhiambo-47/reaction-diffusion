import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Syncs state with localStorage with error handling.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn(`localStorage quota exceeded for key "${key}"`);
        } else {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Debounced localStorage writes for frequently changing values.
 */
export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  delay: number = 500
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as T;
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    isInitialMountRef.current = false;
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn(`localStorage quota exceeded for key "${key}"`);
          } else {
            console.warn(`Error setting localStorage key "${key}":`, error);
          }
        }
      }, delay);
    },
    [key, storedValue, delay]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return [storedValue, setValue];
}
