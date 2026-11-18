import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './themeContext'

const STORAGE_KEY = 'call-handler:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function subscribeToSystemTheme(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function loadStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function saveStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this session.
  }
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme)
  // null means "follow the system". It only becomes a theme once the user picks one.
  const [preference, setPreference] = useState<Theme | null>(loadStoredTheme)
  const theme = preference ?? systemTheme

  useLayoutEffect(() => {
    const root = document.documentElement
    if (preference) {
      root.dataset.theme = preference
    } else {
      // Without the attribute, the CSS follows the OS setting on its own.
      delete root.dataset.theme
    }
  }, [preference])

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setPreference(nextTheme)
    saveStoredTheme(nextTheme)
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
