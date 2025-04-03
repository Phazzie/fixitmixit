import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from './error/ErrorBoundary';

// Import context providers
import { A11yProvider } from './components/accessibility/A11yProvider';
import { ContentProvider } from './contexts/ContentContext';
import { FlagProvider } from './contexts/FlagContext';
import { PhaseProvider } from './contexts/PhaseContext';
import { UserProvider } from './contexts/UserContext';

// Import services
import { initializeSupabase } from './services/SupabaseService';

// Import pages
import HomePage from './components/pages/HomePage';

// Initialize Supabase
try {
  initializeSupabase();
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

function App() {
  return (
    <ErrorBoundary>
      <A11yProvider>
        <UserProvider>
          <PhaseProvider>
            <ContentProvider>
              <FlagProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* Additional routes will be added here */}
                  </Routes>
                </Router>
              </FlagProvider>
            </ContentProvider>
          </PhaseProvider>
        </UserProvider>
      </A11yProvider>
    </ErrorBoundary>
  );
}

export default App;
