import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PhaseType } from '../types/PhaseType';
import { usePhase } from './PhaseContext';

// Define the types for contentions and rebuttals
interface Contention {
  id: string;
  userId: string;
  contentionNumber: number;
  statement: string;
  supportingText: string;
  createdAt: Date;
}

interface Rebuttal {
  id: string;
  contentionId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

// Define the context state
interface ContentState {
  sessionId: string | null;
  userA: string | null;
  userB: string | null;
  issueStatement: string | null;
  steelManningA: string | null; // User A's perspective summarized by User B
  steelManningB: string | null; // User B's perspective summarized by User A
  lockedStatementA: string | null;
  lockedStatementB: string | null;
  contentions: Contention[];
  rebuttals: Rebuttal[];
  resolutionStatement: string | null;
  perspectiveUpdateA: string | null;
  perspectiveUpdateB: string | null;
}

// Define the action types
type ContentAction =
  | { type: 'SET_SESSION'; sessionId: string; userA: string; userB: string }
  | { type: 'SET_ISSUE'; issueStatement: string }
  | { type: 'SET_STEEL_MANNING'; userId: string; content: string }
  | { type: 'SET_LOCKED_STATEMENT'; userId: string; statement: string }
  | { type: 'ADD_CONTENTION'; contention: Contention }
  | { type: 'ADD_REBUTTAL'; rebuttal: Rebuttal }
  | { type: 'SET_RESOLUTION'; resolution: string }
  | { type: 'SET_PERSPECTIVE_UPDATE'; userId: string; update: string }
  | { type: 'RESET' };

// Initial state
const initialState: ContentState = {
  sessionId: null,
  userA: null,
  userB: null,
  issueStatement: null,
  steelManningA: null,
  steelManningB: null,
  lockedStatementA: null,
  lockedStatementB: null,
  contentions: [],
  rebuttals: [],
  resolutionStatement: null,
  perspectiveUpdateA: null,
  perspectiveUpdateB: null
};

// Reducer function
const contentReducer = (state: ContentState, action: ContentAction): ContentState => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.sessionId,
        userA: action.userA,
        userB: action.userB
      };
    case 'SET_ISSUE':
      return {
        ...state,
        issueStatement: action.issueStatement
      };
    case 'SET_STEEL_MANNING':
      return {
        ...state,
        steelManningA: action.userId === 'userB' ? action.content : state.steelManningA,
        steelManningB: action.userId === 'userA' ? action.content : state.steelManningB
      };
    case 'SET_LOCKED_STATEMENT':
      return {
        ...state,
        lockedStatementA: action.userId === 'userA' ? action.statement : state.lockedStatementA,
        lockedStatementB: action.userId === 'userB' ? action.statement : state.lockedStatementB
      };
    case 'ADD_CONTENTION':
      return {
        ...state,
        contentions: [...state.contentions, action.contention]
      };
    case 'ADD_REBUTTAL':
      return {
        ...state,
        rebuttals: [...state.rebuttals, action.rebuttal]
      };
    case 'SET_RESOLUTION':
      return {
        ...state,
        resolutionStatement: action.resolution
      };
    case 'SET_PERSPECTIVE_UPDATE':
      return {
        ...state,
        perspectiveUpdateA: action.userId === 'userA' ? action.update : state.perspectiveUpdateA,
        perspectiveUpdateB: action.userId === 'userB' ? action.update : state.perspectiveUpdateB
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Define the context type
interface ContentContextType {
  state: ContentState;
  setSession: (sessionId: string, userA: string, userB: string) => void;
  setIssue: (issueStatement: string) => void;
  setSteelManning: (userId: string, content: string) => void;
  setLockedStatement: (userId: string, statement: string) => void;
  addContention: (contention: Omit<Contention, 'id' | 'createdAt'>) => void;
  addRebuttal: (rebuttal: Omit<Rebuttal, 'id' | 'createdAt'>) => void;
  setResolution: (resolution: string) => void;
  setPerspectiveUpdate: (userId: string, update: string) => void;
  reset: () => void;
  getContentionsByUser: (userId: string) => Contention[];
  getRebuttalsByContention: (contentionId: string) => Rebuttal[];
}

// Create the context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Provider component
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, initialState);
  const { currentPhase } = usePhase();
  
  // Set the session information
  const setSession = (sessionId: string, userA: string, userB: string) => {
    dispatch({ type: 'SET_SESSION', sessionId, userA, userB });
  };
  
  // Set the issue statement
  const setIssue = (issueStatement: string) => {
    if (currentPhase !== PhaseType.ISSUE_AGREEMENT) {
      console.warn('Cannot set issue statement outside of ISSUE_AGREEMENT phase');
      return;
    }
    
    dispatch({ type: 'SET_ISSUE', issueStatement });
  };
  
  // Set a steel manning summary
  const setSteelManning = (userId: string, content: string) => {
    if (currentPhase !== PhaseType.STEEL_MANNING) {
      console.warn('Cannot set steel manning outside of STEEL_MANNING phase');
      return;
    }
    
    dispatch({ type: 'SET_STEEL_MANNING', userId, content });
  };
  
  // Set a locked statement
  const setLockedStatement = (userId: string, statement: string) => {
    if (currentPhase !== PhaseType.STATEMENT_LOCKING) {
      console.warn('Cannot set locked statement outside of STATEMENT_LOCKING phase');
      return;
    }
    
    dispatch({ type: 'SET_LOCKED_STATEMENT', userId, statement });
  };
  
  // Add a contention
  const addContention = (contention: Omit<Contention, 'id' | 'createdAt'>) => {
    if (currentPhase !== PhaseType.DISCUSSION) {
      console.warn('Cannot add contention outside of DISCUSSION phase');
      return;
    }
    
    // Check if the user already has 3 contentions
    const userContentions = state.contentions.filter(c => c.userId === contention.userId);
    if (userContentions.length >= 3) {
      console.warn('User already has 3 contentions');
      return;
    }
    
    const newContention: Contention = {
      ...contention,
      id: `contention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_CONTENTION', contention: newContention });
  };
  
  // Add a rebuttal
  const addRebuttal = (rebuttal: Omit<Rebuttal, 'id' | 'createdAt'>) => {
    if (currentPhase !== PhaseType.DISCUSSION) {
      console.warn('Cannot add rebuttal outside of DISCUSSION phase');
      return;
    }
    
    const newRebuttal: Rebuttal = {
      ...rebuttal,
      id: `rebuttal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_REBUTTAL', rebuttal: newRebuttal });
  };
  
  // Set the resolution statement
  const setResolution = (resolution: string) => {
    if (currentPhase !== PhaseType.RESOLUTION) {
      console.warn('Cannot set resolution outside of RESOLUTION phase');
      return;
    }
    
    dispatch({ type: 'SET_RESOLUTION', resolution });
  };
  
  // Set a perspective update
  const setPerspectiveUpdate = (userId: string, update: string) => {
    if (currentPhase !== PhaseType.PERSPECTIVE_UPDATE) {
      console.warn('Cannot set perspective update outside of PERSPECTIVE_UPDATE phase');
      return;
    }
    
    dispatch({ type: 'SET_PERSPECTIVE_UPDATE', userId, update });
  };
  
  // Reset the content state
  const reset = () => {
    dispatch({ type: 'RESET' });
  };
  
  // Get contentions by user
  const getContentionsByUser = (userId: string): Contention[] => {
    return state.contentions.filter(contention => contention.userId === userId);
  };
  
  // Get rebuttals by contention
  const getRebuttalsByContention = (contentionId: string): Rebuttal[] => {
    return state.rebuttals.filter(rebuttal => rebuttal.contentionId === contentionId);
  };
  
  return (
    <ContentContext.Provider
      value={{
        state,
        setSession,
        setIssue,
        setSteelManning,
        setLockedStatement,
        addContention,
        addRebuttal,
        setResolution,
        setPerspectiveUpdate,
        reset,
        getContentionsByUser,
        getRebuttalsByContention
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// Hook to use the content context
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  
  return context;
};

export default ContentContext;
