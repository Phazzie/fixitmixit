import { AppError, ErrorType } from './ErrorTypes';

/**
 * Centralized error handling utility
 * This can be expanded to include logging to a service, showing notifications, etc.
 */
export const handleError = (error: Error | AppError): AppError => {
  // If it's already an AppError, just return it
  if ((error as AppError).type) {
    const appError = error as AppError;
    
    // Log the error (in production, this would go to a logging service)
    console.error(`[${appError.type}] ${appError.message}`, appError.context);
    
    return appError;
  }
  
  // Convert standard Error to AppError
  const appError: AppError = {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message || 'An unknown error occurred',
    originalError: error
  };
  
  // Determine error type based on the error message or instance
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    appError.type = ErrorType.NETWORK_ERROR;
  } else if (error.message?.includes('auth') || error.message?.includes('login') || error.message?.includes('password')) {
    appError.type = ErrorType.AUTH_ERROR;
  } else if (error.message?.includes('validation') || error.message?.includes('required')) {
    appError.type = ErrorType.VALIDATION_ERROR;
  }
  
  // Log the error (in production, this would go to a logging service)
  console.error(`[${appError.type}] ${appError.message}`);
  
  return appError;
};

/**
 * Create a new AppError
 */
export const createError = (
  type: ErrorType,
  message: string,
  originalError?: Error,
  context?: Record<string, unknown>
): AppError => {
  const appError: AppError = {
    type,
    message,
    originalError,
    context
  };
  
  // Log the error (in production, this would go to a logging service)
  console.error(`[${type}] ${message}`, context);
  
  return appError;
};

export default {
  handleError,
  createError
};
