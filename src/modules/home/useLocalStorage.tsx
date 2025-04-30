import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>();

  // need this effect to correctly change value when the key changes
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    } else {
      setValue(defaultValue);
    }
  }, [key]);

  const changeValue = (v: T) => {
    localStorage.setItem(key, JSON.stringify(v));
    setValue(v);
  };

  return { value, changeValue };
}
