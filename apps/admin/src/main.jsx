import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App.jsx';
import './index.css';

// Initialize theme
import { store as reduxStore } from './store/store';
// Optional: Pre-set theme class on body/html if needed, but slice handles it on load if dispatched or initial logic runs.
// The slice `getInitialTheme` is synchronous so state is correct, but we need to apply class.
// We can do it here or in a useEffect in App. 
// A quick script in index.html is best for FOUC, but let's just do it in App useEffect or ThemeProvider.
// The slice logic has `getInitialTheme` but doesn't apply side effect until action.
// Let's rely on the ThemeSlice initial state logic but we might need to apply it once on mount. 
// Actually, I'll add a small init script or logic in App.jsx.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
