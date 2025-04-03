# FixItMixit Architecture

## File Structure

```
/src
|-- /assets # Static assets
|-- /components
| |-- /common # Highly reusable, simple UI units (Button, TextInput, Modal) (DRY)
| |-- /layout # Structural components (AppShell, PhaseGateContainer) (Separation of Concerns)
| |-- /accessibility # Accessibility-focused components (WCAG 2.1 Level AA compliance)
| | |-- A11yProvider.jsx # Context provider for accessibility settings
| | |-- ScreenReaderText.jsx # Hidden text for screen readers
| | |-- KeyboardNavigation.jsx # Keyboard navigation utilities
|-- /constants # App-wide constant values (phase keys, AI flag types, thresholds) (DRY)
|-- /contexts # Modular state management (SOLID - SRP per context)
| |-- PhaseContext.jsx # Manages current phase and transitions
| |-- UserContext.jsx # Handles user authentication state
| |-- ContentContext.jsx # Manages issue, statements, contentions, rebuttals
| |-- FlagContext.jsx # Manages AI flags and challenges
|-- /error # Error handling infrastructure
| |-- ErrorBoundary.jsx # React error boundary component
| |-- ErrorTypes.js # Enumeration of possible error types
| |-- ErrorHandler.js # Centralized error handling utility
|-- /features # Encapsulated feature logic & components (Modularity)
| |-- /auth # Authentication UI/logic
| |-- /session_setup # Initial session joining/creation logic
| |-- /phases # Phase-specific UI controllers/components (SRP per phase)
| | |-- 01_IssueAgreement.jsx
| | |-- 02_SteelManning.jsx # Aligned with PRD terminology
| | |-- 03_StatementLocking.jsx
| | |-- 04_Discussion.jsx # Aligned with PRD terminology
| | |-- 05_ResolutionAgreement.jsx
| | |-- 06_SessionSummary.jsx
| | |-- 07_PerspectiveUpdate.jsx
| | |-- 08_SessionClosure.jsx
| |-- /argumentation # Components specific to the Contention/Rebuttal System
| | |-- ArgumentColumn.jsx
| | |-- ContentionCard.jsx
| | |-- ContentionEntryForm.jsx
| | |-- RebuttalDisplay.jsx
| | |-- RebuttalEntryForm.jsx
| |-- /ai_pattern_detection # Components and logic for AI flag display and challenge
| | |-- FlagNotificationInline.jsx # Inline, contextual flags
| | |-- FlagNotificationSidebar.jsx # Summary view of all flags
| | |-- FlagNotificationModal.jsx # For critical flags requiring immediate attention
| | |-- ChallengeFlagInteraction.jsx
|-- /hooks # Reusable logic abstractions (DRY)
| |-- usePhaseState.js # Access to PhaseContext
| |-- useUserState.js # Access to UserContext
| |-- useContentState.js # Access to ContentContext
| |-- useFlagState.js # Access to FlagContext
| |-- useA11y.js # Hook for accessibility settings
|-- /api # API infrastructure
| |-- endpoints.js # API endpoint definitions
| |-- apiClient.js # Centralized API client
| |-- apiTypes.ts # TypeScript interfaces for API requests/responses
|-- /services # External interaction modules (API, Storage, Payments) (SRP)
| |-- AuthService.js
| |-- SupabaseService.js # Direct Supabase integration from the start
| |-- PatternDetectionService.js # Handles Gemini API calls for AI Flags
| |-- ManualReviewService.js # Coordinates review requests
| |-- PaymentService.js # Payment provider integration
|-- /state-machines # State machine definitions
| |-- phaseStateMachine.js # Defines valid phase transitions
| |-- usePhaseStateMachine.js # Hook for interacting with the state machine
|-- /styles # Global styles, theming
| |-- themes
| | |-- default.js
| | |-- highContrast.js # Accessibility theme
|-- /utils # Generic helper functions (formatters, validators) (DRY)
|-- /locales # Internationalization structure (for future use)
| |-- en # English translations
|-- /future_mechanisms # Placeholder for potential V2+ concepts
|-- App.jsx # Main router & context provider setup
|-- index.jsx # App entry point
```

## Core Principles

### SOLID
- **Single Responsibility Principle**: Each component, service, and context has a clearly defined, single responsibility
- **Open/Closed Principle**: The modular structure allows for extension without modification
- **Liskov Substitution Principle**: Components maintain consistent behavior through clear interfaces
- **Interface Segregation**: Contexts are broken down into focused interfaces rather than one monolithic context
- **Dependency Inversion**: Service layer abstracts external dependencies, hooks provide context access

### DRY (Don't Repeat Yourself)
- Reusable components in `/components/common`
- Custom hooks for consistent context access
- Centralized constants in `/constants`
- Utility functions in `/utils`
- Layout components for reusable structure

### KISS (Keep It Simple, Stupid)
- Clear, intuitive directory structure
- Direct API integration
- Focused components with limited purposes
- Balanced complexity for necessary features

### TDD (Test-Driven Development)
- Comprehensive test plan for all components
- Unit, integration, and E2E testing
- Accessibility and security testing
- Edge case and "challenging assumption" tests

## Build Order

1. **Secure Foundation**
2. **Core User Flow (Early Phases)**
3. **AI Integration**
4. **Discussion Engine**
5. **Resolution and Closure**
6. **Payment Integration**
7. **Polish & Harden**

## Implementation Checklist

- [ ] Project Setup with Modular Structure
- [ ] Reusable Base UI Components with Accessibility Support
- [ ] Modular Context Structure Implemented
- [ ] Supabase Integration for Secure Data Storage
- [ ] Error Handling Infrastructure
- [ ] State Machine for Phase Transitions
- [ ] Authentication Flow with Supabase Auth
- [ ] Accessibility Provider and Utilities
- [ ] API Infrastructure with Secure Communication
- [ ] Issue Agreement Phase Logic Complete
- [ ] Steel-Manning Phase Logic Complete
- [ ] Statement Locking Phase Logic Complete
- [ ] Pattern Detection Service with Gemini API Integration
- [ ] Flag Notification Components
- [ ] Discussion Phase with AI Integration
- [ ] Contention/Rebuttal System with Validation
- [ ] Manual Review Service with Payment Integration
- [ ] Flag Challenge UI Flow Implemented
- [ ] Resolution Agreement Phase Logic Complete
- [ ] Session Summary Generation/Display Complete
- [ ] Perspective Update Phase Complete
- [ ] Session Closure & Feedback Complete
- [ ] Payment Integration Complete
- [ ] Comprehensive Test Suite
- [ ] Performance Optimization
- [ ] Documentation Updates
