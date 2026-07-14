import { useEffect } from 'react';

export const useKeyboardShortcut = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Very basic implementation: check if all modifiers and the key match
      const isCtrl = keys.includes('ctrl') ? event.ctrlKey : true;
      const isAlt = keys.includes('alt') ? event.altKey : true;
      const isShift = keys.includes('shift') ? event.shiftKey : true;
      const isMeta = keys.includes('meta') ? event.metaKey : true;
      
      const keyString = keys.find(k => !['ctrl', 'alt', 'shift', 'meta'].includes(k));
      
      if (isCtrl && isAlt && isShift && isMeta && event.key.toLowerCase() === keyString) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback]);
};
