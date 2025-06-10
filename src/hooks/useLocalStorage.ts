import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Добиј вредност из localStorage или користи почетну вредност
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Грешка при читању localStorage кључа "${key}":`, error);
      return initialValue;
    }
  });

  // Функција за чување вредности
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Дозволи да value буде функција за ажурирање као што useState ради
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Сачувај у localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Грешка при чувању у localStorage кључ "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}