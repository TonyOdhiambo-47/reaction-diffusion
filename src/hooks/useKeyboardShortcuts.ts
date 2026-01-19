import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onRandomSeed: () => void;
  onExport: () => void;
}

/**
 * Handles keyboard shortcuts for simulation control.
 * Shortcuts are disabled when input fields are focused.
 */
export function useKeyboardShortcuts({
  onPlayPause,
  onStep,
  onReset,
  onRandomSeed,
  onExport,
}: KeyboardShortcuts) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.getAttribute('contenteditable') === 'true';

      if (isInputFocused) {
        return;
      }

      const key = event.key.toLowerCase();
      const isShift = event.shiftKey;
      const isCtrl = event.ctrlKey || event.metaKey;

      if (key === ' ' && !isCtrl) {
        event.preventDefault();
        onPlayPause();
        return;
      }

      if (key === 's' && !isCtrl && !isShift) {
        event.preventDefault();
        onStep();
        return;
      }

      if (key === 'r' && !isCtrl && !isShift) {
        event.preventDefault();
        onReset();
        return;
      }

      if (key === 'r' && !isCtrl && isShift) {
        event.preventDefault();
        onRandomSeed();
        return;
      }

      if (key === 'e' && !isCtrl && !isShift) {
        event.preventDefault();
        onExport();
        return;
      }

      if (key === 'escape') {
        event.preventDefault();
        onPlayPause();
        return;
      }
    },
    [onPlayPause, onStep, onReset, onRandomSeed, onExport]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
