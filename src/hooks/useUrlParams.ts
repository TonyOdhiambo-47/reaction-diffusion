import { useState, useEffect, useCallback } from 'react';

/**
 * Syncs state with URL search parameters. Updates URL without reload and handles navigation.
 */
export function useUrlParams<T extends Record<string, string | number | undefined>>(
  initialParams: T,
  options?: {
    /** Function to serialize params to URL-safe format */
    serialize?: (params: T) => Record<string, string>;
    /** Function to deserialize URL params to state format */
    deserialize?: (urlParams: URLSearchParams) => Partial<T>;
  }
): [T, (params: Partial<T>) => void] {
  const serialize = options?.serialize || defaultSerialize;
  const deserialize = options?.deserialize || defaultDeserialize;

  const [params, setParams] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialParams;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const deserialized = deserialize(urlParams);
      return { ...initialParams, ...deserialized };
    } catch (error) {
      console.warn('Error reading URL parameters:', error);
      return initialParams;
    }
  });

  // Update URL when params change
  const updateParams = useCallback(
    (newParams: Partial<T>) => {
      setParams((prev) => {
        const updated = { ...prev, ...newParams };
        
        try {
          if (typeof window !== 'undefined') {
            const serialized = serialize(updated);
            const urlParams = new URLSearchParams();
            
            // Only add non-empty values
            Object.entries(serialized).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                urlParams.set(key, String(value));
              }
            });

            // Update URL without reload
            const newUrl = urlParams.toString()
              ? `${window.location.pathname}?${urlParams.toString()}`
              : window.location.pathname;
            
            window.history.replaceState({}, '', newUrl);
          }
        } catch (error) {
          console.warn('Error updating URL parameters:', error);
        }

        return updated;
      });
    },
    [serialize]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const deserialized = deserialize(urlParams);
        setParams((prev) => ({ ...prev, ...deserialized }));
      } catch (error) {
        console.warn('Error reading URL parameters on navigation:', error);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [deserialize]);

  return [params, updateParams];
}

/**
 * Serializes params to URL-safe string format.
 */
function defaultSerialize<T extends Record<string, string | number | undefined>>(
  params: T
): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  });
  return result;
}

/**
 * Deserializes URL params, attempting to parse numbers.
 */
function defaultDeserialize<T extends Record<string, string | number | undefined>>(
  urlParams: URLSearchParams
): Partial<T> {
  const result: Partial<T> = {};
  urlParams.forEach((value, key) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && value.trim() !== '') {
      result[key as keyof T] = numValue as T[keyof T];
    } else {
      result[key as keyof T] = value as T[keyof T];
    }
  });
  return result;
}
