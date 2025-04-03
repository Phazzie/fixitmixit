import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the accessibility settings
interface A11ySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

// Define the context type
interface A11yContextType {
  settings: A11ySettings;
  updateSettings: (settings: Partial<A11ySettings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: A11ySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderOptimized: false
};

// Create the context
const A11yContext = createContext<A11yContextType | undefined>(undefined);

// Provider component
export const A11yProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize settings from localStorage if available
  const [settings, setSettings] = useState<A11ySettings>(() => {
    const savedSettings = localStorage.getItem('a11ySettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  // Update settings when they change
  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('a11ySettings', JSON.stringify(settings));
    
    // Apply settings to the document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
    document.documentElement.classList.toggle('screen-reader-optimized', settings.screenReaderOptimized);
    
    // Check system preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, [settings]);
  
  // Update settings
  const updateSettings = (newSettings: Partial<A11ySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  return (
    <A11yContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings
      }}
    >
      {children}
    </A11yContext.Provider>
  );
};

// Hook to use the accessibility context
export const useA11y = (): A11yContextType => {
  const context = useContext(A11yContext);
  
  if (context === undefined) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  
  return context;
};

export default A11yContext;
