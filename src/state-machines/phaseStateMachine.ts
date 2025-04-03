import { createMachine, assign } from 'xstate';
import { PhaseType } from '../types/PhaseType';
import { ErrorType } from '../error/ErrorTypes';
import { createError } from '../error/ErrorHandler';

// Define the context and events for the state machine
export interface PhaseContext {
  currentPhase: PhaseType;
  issueStatement: string | null;
  issueAgreedByUserA: boolean;
  issueAgreedByUserB: boolean;
  steelManningAByB: string | null; // User B's summary of User A's perspective
  steelManningBByA: string | null; // User A's summary of User B's perspective
  steelManningAgreedByA: boolean;
  steelManningAgreedByB: boolean;
  statementA: string | null;
  statementB: string | null;
  statementLockedByA: boolean;
  statementLockedByB: boolean;
  resolutionStatement: string | null;
  resolutionAgreedByA: boolean;
  resolutionAgreedByB: boolean;
  perspectiveUpdateA: string | null;
  perspectiveUpdateB: string | null;
  feedbackSubmittedByA: boolean;
  feedbackSubmittedByB: boolean;
  error: Error | null;
}

export type PhaseEvent =
  | { type: 'PROPOSE_ISSUE'; userId: string; issueStatement: string }
  | { type: 'AGREE_ISSUE'; userId: string }
  | { type: 'REJECT_ISSUE'; userId: string }
  | { type: 'SUBMIT_STEEL_MANNING'; userId: string; targetUserId: string; content: string }
  | { type: 'AGREE_STEEL_MANNING'; userId: string }
  | { type: 'REJECT_STEEL_MANNING'; userId: string }
  | { type: 'LOCK_STATEMENT'; userId: string; statement: string }
  | { type: 'PROPOSE_RESOLUTION'; userId: string; resolution: string }
  | { type: 'AGREE_RESOLUTION'; userId: string }
  | { type: 'REJECT_RESOLUTION'; userId: string }
  | { type: 'SUBMIT_PERSPECTIVE_UPDATE'; userId: string; update: string }
  | { type: 'SUBMIT_FEEDBACK'; userId: string }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET' };

// Initial context
const initialContext: PhaseContext = {
  currentPhase: PhaseType.INITIALIZATION,
  issueStatement: null,
  issueAgreedByUserA: false,
  issueAgreedByUserB: false,
  steelManningAByB: null,
  steelManningBByA: null,
  steelManningAgreedByA: false,
  steelManningAgreedByB: false,
  statementA: null,
  statementB: null,
  statementLockedByA: false,
  statementLockedByB: false,
  resolutionStatement: null,
  resolutionAgreedByA: false,
  resolutionAgreedByB: false,
  perspectiveUpdateA: null,
  perspectiveUpdateB: null,
  feedbackSubmittedByA: false,
  feedbackSubmittedByB: false,
  error: null
};

// Create the state machine
export const phaseMachine = createMachine<PhaseContext, PhaseEvent>({
  id: 'phase',
  initial: PhaseType.INITIALIZATION,
  context: initialContext,
  states: {
    [PhaseType.INITIALIZATION]: {
      on: {
        PROPOSE_ISSUE: {
          target: PhaseType.ISSUE_AGREEMENT,
          actions: assign({
            currentPhase: PhaseType.ISSUE_AGREEMENT,
            issueStatement: (_, event) => event.issueStatement,
            issueAgreedByUserA: (_, event) => event.userId === 'userA',
            issueAgreedByUserB: (_, event) => event.userId === 'userB'
          })
        }
      }
    },
    [PhaseType.ISSUE_AGREEMENT]: {
      on: {
        PROPOSE_ISSUE: {
          actions: assign({
            issueStatement: (_, event) => event.issueStatement,
            issueAgreedByUserA: (_, event) => event.userId === 'userA',
            issueAgreedByUserB: (_, event) => event.userId === 'userB'
          })
        },
        AGREE_ISSUE: {
          actions: assign({
            issueAgreedByUserA: (_, event) => event.userId === 'userA' ? true : (context) => context.issueAgreedByUserA,
            issueAgreedByUserB: (_, event) => event.userId === 'userB' ? true : (context) => context.issueAgreedByUserB
          }),
          target: PhaseType.STEEL_MANNING,
          cond: (context, event) => {
            const userAAgrees = event.userId === 'userA' ? true : context.issueAgreedByUserA;
            const userBAgrees = event.userId === 'userB' ? true : context.issueAgreedByUserB;
            return userAAgrees && userBAgrees;
          }
        },
        REJECT_ISSUE: {
          actions: assign({
            issueAgreedByUserA: (_, event) => event.userId === 'userA' ? false : (context) => context.issueAgreedByUserA,
            issueAgreedByUserB: (_, event) => event.userId === 'userB' ? false : (context) => context.issueAgreedByUserB
          })
        }
      }
    },
    [PhaseType.STEEL_MANNING]: {
      entry: assign({
        currentPhase: PhaseType.STEEL_MANNING
      }),
      on: {
        SUBMIT_STEEL_MANNING: {
          actions: assign({
            steelManningAByB: (_, event) => event.targetUserId === 'userA' ? event.content : (context) => context.steelManningAByB,
            steelManningBByA: (_, event) => event.targetUserId === 'userB' ? event.content : (context) => context.steelManningBByA
          })
        },
        AGREE_STEEL_MANNING: {
          actions: assign({
            steelManningAgreedByA: (_, event) => event.userId === 'userA' ? true : (context) => context.steelManningAgreedByA,
            steelManningAgreedByB: (_, event) => event.userId === 'userB' ? true : (context) => context.steelManningAgreedByB
          }),
          target: PhaseType.STATEMENT_LOCKING,
          cond: (context, event) => {
            const userAAgrees = event.userId === 'userA' ? true : context.steelManningAgreedByA;
            const userBAgrees = event.userId === 'userB' ? true : context.steelManningAgreedByB;
            return userAAgrees && userBAgrees && context.steelManningAByB !== null && context.steelManningBByA !== null;
          }
        },
        REJECT_STEEL_MANNING: {
          actions: assign({
            steelManningAgreedByA: (_, event) => event.userId === 'userA' ? false : (context) => context.steelManningAgreedByA,
            steelManningAgreedByB: (_, event) => event.userId === 'userB' ? false : (context) => context.steelManningAgreedByB
          })
        }
      }
    },
    [PhaseType.STATEMENT_LOCKING]: {
      entry: assign({
        currentPhase: PhaseType.STATEMENT_LOCKING
      }),
      on: {
        LOCK_STATEMENT: {
          actions: assign({
            statementA: (_, event) => event.userId === 'userA' ? event.statement : (context) => context.statementA,
            statementB: (_, event) => event.userId === 'userB' ? event.statement : (context) => context.statementB,
            statementLockedByA: (_, event) => event.userId === 'userA' ? true : (context) => context.statementLockedByA,
            statementLockedByB: (_, event) => event.userId === 'userB' ? true : (context) => context.statementLockedByB
          }),
          target: PhaseType.DISCUSSION,
          cond: (context, event) => {
            const userALocked = event.userId === 'userA' ? true : context.statementLockedByA;
            const userBLocked = event.userId === 'userB' ? true : context.statementLockedByB;
            return userALocked && userBLocked;
          }
        }
      }
    },
    [PhaseType.DISCUSSION]: {
      entry: assign({
        currentPhase: PhaseType.DISCUSSION
      }),
      on: {
        PROPOSE_RESOLUTION: {
          target: PhaseType.RESOLUTION,
          actions: assign({
            currentPhase: PhaseType.RESOLUTION,
            resolutionStatement: (_, event) => event.resolution,
            resolutionAgreedByA: (_, event) => event.userId === 'userA',
            resolutionAgreedByB: (_, event) => event.userId === 'userB'
          })
        }
      }
    },
    [PhaseType.RESOLUTION]: {
      on: {
        PROPOSE_RESOLUTION: {
          actions: assign({
            resolutionStatement: (_, event) => event.resolution,
            resolutionAgreedByA: (_, event) => event.userId === 'userA',
            resolutionAgreedByB: (_, event) => event.userId === 'userB'
          })
        },
        AGREE_RESOLUTION: {
          actions: assign({
            resolutionAgreedByA: (_, event) => event.userId === 'userA' ? true : (context) => context.resolutionAgreedByA,
            resolutionAgreedByB: (_, event) => event.userId === 'userB' ? true : (context) => context.resolutionAgreedByB
          }),
          target: PhaseType.SUMMARY,
          cond: (context, event) => {
            const userAAgrees = event.userId === 'userA' ? true : context.resolutionAgreedByA;
            const userBAgrees = event.userId === 'userB' ? true : context.resolutionAgreedByB;
            return userAAgrees && userBAgrees;
          }
        },
        REJECT_RESOLUTION: {
          actions: assign({
            resolutionAgreedByA: (_, event) => event.userId === 'userA' ? false : (context) => context.resolutionAgreedByA,
            resolutionAgreedByB: (_, event) => event.userId === 'userB' ? false : (context) => context.resolutionAgreedByB
          })
        }
      }
    },
    [PhaseType.SUMMARY]: {
      entry: assign({
        currentPhase: PhaseType.SUMMARY
      }),
      on: {
        SUBMIT_PERSPECTIVE_UPDATE: {
          target: PhaseType.PERSPECTIVE_UPDATE,
          actions: assign({
            currentPhase: PhaseType.PERSPECTIVE_UPDATE,
            perspectiveUpdateA: (_, event) => event.userId === 'userA' ? event.update : (context) => context.perspectiveUpdateA,
            perspectiveUpdateB: (_, event) => event.userId === 'userB' ? event.update : (context) => context.perspectiveUpdateB
          })
        }
      }
    },
    [PhaseType.PERSPECTIVE_UPDATE]: {
      on: {
        SUBMIT_PERSPECTIVE_UPDATE: {
          actions: assign({
            perspectiveUpdateA: (_, event) => event.userId === 'userA' ? event.update : (context) => context.perspectiveUpdateA,
            perspectiveUpdateB: (_, event) => event.userId === 'userB' ? event.update : (context) => context.perspectiveUpdateB
          })
        },
        SUBMIT_FEEDBACK: {
          actions: assign({
            feedbackSubmittedByA: (_, event) => event.userId === 'userA' ? true : (context) => context.feedbackSubmittedByA,
            feedbackSubmittedByB: (_, event) => event.userId === 'userB' ? true : (context) => context.feedbackSubmittedByB
          }),
          target: PhaseType.CLOSURE,
          cond: (context, event) => {
            const userASubmitted = event.userId === 'userA' ? true : context.feedbackSubmittedByA;
            const userBSubmitted = event.userId === 'userB' ? true : context.feedbackSubmittedByB;
            return userASubmitted && userBSubmitted;
          }
        }
      }
    },
    [PhaseType.CLOSURE]: {
      entry: assign({
        currentPhase: PhaseType.CLOSURE
      }),
      on: {
        COMPLETE_SESSION: {
          target: PhaseType.INITIALIZATION,
          actions: assign(() => initialContext)
        }
      }
    }
  },
  on: {
    RESET: {
      target: PhaseType.INITIALIZATION,
      actions: assign(() => initialContext)
    }
  }
});

/**
 * Validate a phase transition
 * This function checks if a transition is valid based on the current phase and context
 */
export const validatePhaseTransition = (
  currentPhase: PhaseType,
  targetPhase: PhaseType,
  context: Partial<PhaseContext>
): { valid: boolean; error?: Error } => {
  // Define valid transitions and their conditions
  const validTransitions: Record<PhaseType, { targets: PhaseType[]; conditions?: (context: Partial<PhaseContext>) => boolean }> = {
    [PhaseType.INITIALIZATION]: {
      targets: [PhaseType.ISSUE_AGREEMENT]
    },
    [PhaseType.ISSUE_AGREEMENT]: {
      targets: [PhaseType.STEEL_MANNING],
      conditions: (ctx) => !!ctx.issueStatement && ctx.issueAgreedByUserA && ctx.issueAgreedByUserB
    },
    [PhaseType.STEEL_MANNING]: {
      targets: [PhaseType.STATEMENT_LOCKING],
      conditions: (ctx) => 
        !!ctx.steelManningAByB && 
        !!ctx.steelManningBByA && 
        ctx.steelManningAgreedByA && 
        ctx.steelManningAgreedByB
    },
    [PhaseType.STATEMENT_LOCKING]: {
      targets: [PhaseType.DISCUSSION],
      conditions: (ctx) => 
        !!ctx.statementA && 
        !!ctx.statementB && 
        ctx.statementLockedByA && 
        ctx.statementLockedByB
    },
    [PhaseType.DISCUSSION]: {
      targets: [PhaseType.RESOLUTION]
    },
    [PhaseType.RESOLUTION]: {
      targets: [PhaseType.SUMMARY],
      conditions: (ctx) => 
        !!ctx.resolutionStatement && 
        ctx.resolutionAgreedByA && 
        ctx.resolutionAgreedByB
    },
    [PhaseType.SUMMARY]: {
      targets: [PhaseType.PERSPECTIVE_UPDATE]
    },
    [PhaseType.PERSPECTIVE_UPDATE]: {
      targets: [PhaseType.CLOSURE],
      conditions: (ctx) => ctx.feedbackSubmittedByA && ctx.feedbackSubmittedByB
    },
    [PhaseType.CLOSURE]: {
      targets: [PhaseType.INITIALIZATION]
    }
  };

  // Check if the target phase is a valid transition from the current phase
  const validTransition = validTransitions[currentPhase];
  if (!validTransition || !validTransition.targets.includes(targetPhase)) {
    return {
      valid: false,
      error: createError(
        ErrorType.PHASE_TRANSITION_ERROR,
        `Invalid phase transition from ${currentPhase} to ${targetPhase}`
      )
    };
  }

  // Check if the conditions for the transition are met
  if (validTransition.conditions && !validTransition.conditions(context)) {
    return {
      valid: false,
      error: createError(
        ErrorType.PHASE_TRANSITION_ERROR,
        `Conditions not met for transition from ${currentPhase} to ${targetPhase}`
      )
    };
  }

  return { valid: true };
};

export default {
  phaseMachine,
  validatePhaseTransition
};
