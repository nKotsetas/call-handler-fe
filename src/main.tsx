import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { AuthGate } from './components/AuthGate'
import { AuthProvider } from './context/AuthProvider'
import { CallSelectionProvider } from './context/CallSelectionProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <AuthGate>
            <CallSelectionProvider>
              <App />
            </CallSelectionProvider>
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
