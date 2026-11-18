import { useTheme } from '../context/themeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button type="button" className="button" onClick={toggleTheme} aria-pressed={isDark}>
      <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span> Dark mode
    </button>
  )
}
