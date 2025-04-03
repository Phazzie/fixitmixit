import React, { useRef, useEffect, KeyboardEvent, ReactNode } from 'react';

interface KeyboardNavigationProps {
  children: ReactNode;
  selector: string; // CSS selector for focusable elements
  onEscape?: () => void;
  loop?: boolean;
  disabled?: boolean;
}

/**
 * Component that handles keyboard navigation within a container
 * This is useful for creating accessible components like menus, dialogs, etc.
 */
const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  selector,
  onEscape,
  loop = true,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Get all focusable elements
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(selector)
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
    
    if (focusableElements.length === 0) return;
    
    // Get the currently focused element
    const focusedElement = document.activeElement as HTMLElement;
    const focusedIndex = focusableElements.indexOf(focusedElement);
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (focusedIndex === -1 || focusedIndex === focusableElements.length - 1) {
          if (loop) {
            focusableElements[0].focus();
          }
        } else {
          focusableElements[focusedIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (focusedIndex === -1 || focusedIndex === 0) {
          if (loop) {
            focusableElements[focusableElements.length - 1].focus();
          }
        } else {
          focusableElements[focusedIndex - 1].focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        focusableElements[0].focus();
        break;
      case 'End':
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
    }
  };
  
  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default KeyboardNavigation;
