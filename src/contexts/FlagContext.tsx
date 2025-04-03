import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the flag types
export enum FlagType {
  G1 = 'G1', // Persistent Reality Denial
  G2_1 = 'G2_1', // Minimizing Own Action
  G2_2 = 'G2_2', // Dismissing Other's Stated Impact
  G3 = 'G3', // Consistent Blame-Shifting
  C = 'C' // Severe Language
}

// Define the flag status
export enum FlagStatus {
  ACTIVE = 'active',
  CHALLENGED = 'challenged',
  CONFIRMED = 'confirmed',
  OVERTURNED = 'overturned'
}

// Define the flag interface
export interface Flag {
  id: string;
  sessionId: string;
  targetTextType: 'contention' | 'rebuttal';
  targetTextId: string;
  flagType: FlagType;
  flaggedContent: string;
  explanation: string;
  visibleToUserId: string;
  status: FlagStatus;
  challengedAt: Date | null;
  manualReviewStatus: 'pending' | 'confirmed' | 'overturned' | null;
  manualReviewNote: string | null;
  createdAt: Date;
}

// Define the context state
interface FlagState {
  flags: Flag[];
  reviewCount: Record<string, number>; // Track review counts by issue
}

// Define the action types
type FlagAction =
  | { type: 'ADD_FLAG'; flag: Flag }
  | { type: 'UPDATE_FLAG_STATUS'; flagId: string; status: FlagStatus }
  | { type: 'CHALLENGE_FLAG'; flagId: string }
  | { type: 'SET_MANUAL_REVIEW_STATUS'; flagId: string; status: 'confirmed' | 'overturned'; note?: string }
  | { type: 'INCREMENT_REVIEW_COUNT'; issueId: string }
  | { type: 'RESET' };

// Initial state
const initialState: FlagState = {
  flags: [],
  reviewCount: {}
};

// Reducer function
const flagReducer = (state: FlagState, action: FlagAction): FlagState => {
  switch (action.type) {
    case 'ADD_FLAG':
      return {
        ...state,
        flags: [...state.flags, action.flag]
      };
    case 'UPDATE_FLAG_STATUS':
      return {
        ...state,
        flags: state.flags.map(flag =>
          flag.id === action.flagId
            ? { ...flag, status: action.status }
            : flag
        )
      };
    case 'CHALLENGE_FLAG':
      return {
        ...state,
        flags: state.flags.map(flag =>
          flag.id === action.flagId
            ? {
                ...flag,
                status: FlagStatus.CHALLENGED,
                challengedAt: new Date()
              }
            : flag
        )
      };
    case 'SET_MANUAL_REVIEW_STATUS':
      return {
        ...state,
        flags: state.flags.map(flag =>
          flag.id === action.flagId
            ? {
                ...flag,
                manualReviewStatus: action.status,
                manualReviewNote: action.note || null,
                status: action.status === 'confirmed' ? FlagStatus.CONFIRMED : FlagStatus.OVERTURNED
              }
            : flag
        )
      };
    case 'INCREMENT_REVIEW_COUNT':
      return {
        ...state,
        reviewCount: {
          ...state.reviewCount,
          [action.issueId]: (state.reviewCount[action.issueId] || 0) + 1
        }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Define the context type
interface FlagContextType {
  state: FlagState;
  addFlag: (flag: Omit<Flag, 'id' | 'status' | 'challengedAt' | 'manualReviewStatus' | 'manualReviewNote' | 'createdAt'>) => void;
  updateFlagStatus: (flagId: string, status: FlagStatus) => void;
  challengeFlag: (flagId: string, issueId: string) => void;
  setManualReviewStatus: (flagId: string, status: 'confirmed' | 'overturned', note?: string) => void;
  getFlagsByUser: (userId: string) => Flag[];
  getFlagsByTarget: (targetTextId: string) => Flag[];
  getReviewCount: (issueId: string) => number;
  reset: () => void;
}

// Create the context
const FlagContext = createContext<FlagContextType | undefined>(undefined);

// Provider component
export const FlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(flagReducer, initialState);
  
  // Add a new flag
  const addFlag = (flag: Omit<Flag, 'id' | 'status' | 'challengedAt' | 'manualReviewStatus' | 'manualReviewNote' | 'createdAt'>) => {
    const newFlag: Flag = {
      ...flag,
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: FlagStatus.ACTIVE,
      challengedAt: null,
      manualReviewStatus: null,
      manualReviewNote: null,
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_FLAG', flag: newFlag });
  };
  
  // Update a flag's status
  const updateFlagStatus = (flagId: string, status: FlagStatus) => {
    dispatch({ type: 'UPDATE_FLAG_STATUS', flagId, status });
  };
  
  // Challenge a flag
  const challengeFlag = (flagId: string, issueId: string) => {
    dispatch({ type: 'CHALLENGE_FLAG', flagId });
    dispatch({ type: 'INCREMENT_REVIEW_COUNT', issueId });
  };
  
  // Set the manual review status of a flag
  const setManualReviewStatus = (flagId: string, status: 'confirmed' | 'overturned', note?: string) => {
    dispatch({ type: 'SET_MANUAL_REVIEW_STATUS', flagId, status, note });
  };
  
  // Get flags visible to a specific user
  const getFlagsByUser = (userId: string): Flag[] => {
    return state.flags.filter(flag => flag.visibleToUserId === userId);
  };
  
  // Get flags for a specific target text
  const getFlagsByTarget = (targetTextId: string): Flag[] => {
    return state.flags.filter(flag => flag.targetTextId === targetTextId);
  };
  
  // Get the review count for an issue
  const getReviewCount = (issueId: string): number => {
    return state.reviewCount[issueId] || 0;
  };
  
  // Reset the flag state
  const reset = () => {
    dispatch({ type: 'RESET' });
  };
  
  return (
    <FlagContext.Provider
      value={{
        state,
        addFlag,
        updateFlagStatus,
        challengeFlag,
        setManualReviewStatus,
        getFlagsByUser,
        getFlagsByTarget,
        getReviewCount,
        reset
      }}
    >
      {children}
    </FlagContext.Provider>
  );
};

// Hook to use the flag context
export const useFlag = (): FlagContextType => {
  const context = useContext(FlagContext);
  
  if (context === undefined) {
    throw new Error('useFlag must be used within a FlagProvider');
  }
  
  return context;
};

export default FlagContext;
