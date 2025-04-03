export enum ErrorType {
  // Authentication errors
  AUTH_ERROR = 'auth_error',
  UNAUTHORIZED = 'unauthorized',
  
  // API errors
  API_ERROR = 'api_error',
  NETWORK_ERROR = 'network_error',
  
  // Data errors
  DATA_ERROR = 'data_error',
  VALIDATION_ERROR = 'validation_error',
  
  // Session errors
  SESSION_ERROR = 'session_error',
  PHASE_TRANSITION_ERROR = 'phase_transition_error',
  
  // UI errors
  UI_ERROR = 'ui_error',
  
  // Unknown errors
  UNKNOWN_ERROR = 'unknown_error'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  context?: Record<string, unknown>;
}
