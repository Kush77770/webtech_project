import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  });

  // Keep a ref to storedValue so setValue doesn't re-create every render
  const storedValueRef = useRef(storedValue);
  useEffect(() => { storedValueRef.current = storedValue; }, [storedValue]);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValueRef.current) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`localStorage error for key "${key}":`, error);
    }
  }, [key]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
