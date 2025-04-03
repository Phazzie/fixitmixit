import { useInterpret, useSelector } from '@xstate/react';
import { phaseMachine, PhaseContext, PhaseEvent } from './phaseStateMachine';
import { PhaseType } from '../types/PhaseType';
import { InterpreterFrom } from 'xstate';

/**
 * Hook to interact with the phase state machine
 */
export const usePhaseStateMachine = () => {
  // Create and interpret the machine
  const phaseService = useInterpret(phaseMachine);
  
  // Select the current phase from the state
  const currentPhase = useSelector(
    phaseService,
    (state) => state.context.currentPhase
  );
  
  // Select the full context from the state
  const context = useSelector(
    phaseService,
    (state) => state.context
  );
  
  // Send an event to the state machine
  const send = (event: PhaseEvent) => {
    phaseService.send(event);
  };
  
  // Check if a transition to a specific phase is possible
  const canTransitionTo = (phase: PhaseType): boolean => {
    return phaseService.state.can({ type: 'TRANSITION', phase });
  };
  
  // Reset the state machine
  const reset = () => {
    phaseService.send({ type: 'RESET' });
  };
  
  return {
    currentPhase,
    context,
    send,
    canTransitionTo,
    reset,
    service: phaseService
  };
};

// Export the service type for TypeScript
export type PhaseService = InterpreterFrom<typeof phaseMachine>;

export default usePhaseStateMachine;
