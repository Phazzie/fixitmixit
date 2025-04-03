import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { auth } from '../services/SupabaseService';
import { handleError } from '../error/ErrorHandler';
import { ErrorType } from '../error/ErrorTypes';

// Define the context type
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load the current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const user = await auth.getCurrentUser();
        
        if (user) {
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            createdAt: new Date(user.created_at || ''),
            updatedAt: new Date()
          });
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setError(handleError(err as Error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Sign in a user
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user } = await auth.signIn(email, password);
      
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          createdAt: new Date(user.created_at || ''),
          updatedAt: new Date()
        });
      }
    } catch (err) {
      setError(handleError(err as Error));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up a new user
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user } = await auth.signUp(email, password);
      
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          createdAt: new Date(user.created_at || ''),
          updatedAt: new Date()
        });
      }
    } catch (err) {
      setError(handleError(err as Error));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out the current user
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      setError(handleError(err as Error));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear any errors
  const clearError = () => {
    setError(null);
  };
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        clearError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

export default UserContext;
