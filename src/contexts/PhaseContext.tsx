import React, { createContext, useContext, ReactNode } from 'react';
import { PhaseType } from '../types/PhaseType';
import { usePhaseStateMachine, PhaseService } from '../state-machines/usePhaseStateMachine';
import { PhaseContext as PhaseStateContext, PhaseEvent } from '../state-machines/phaseStateMachine';

// Define the context type
interface PhaseContextType {
  currentPhase: PhaseType;
  context: PhaseStateContext;
  send: (event: PhaseEvent) => void;
  canTransitionTo: (phase: PhaseType) => boolean;
  reset: () => void;
  service: PhaseService;
}

// Create the context with a default value
const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

// Provider component
export const PhaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const phaseStateMachine = usePhaseStateMachine();
  
  return (
    <PhaseContext.Provider value={phaseStateMachine}>
      {children}
    </PhaseContext.Provider>
  );
};

// Hook to use the phase context
export const usePhase = (): PhaseContextType => {
  const context = useContext(PhaseContext);
  
  if (context === undefined) {
    throw new Error('usePhase must be used within a PhaseProvider');
  }
  
  return context;
};

export default PhaseContext;
