import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'gather-thyme-theme'
const ThemeContext = createContext(null)

function getInitialTheme() {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch (error) {
    console.error('Could not read the saved theme preference.', error)
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.error('Could not save the theme preference.', error)
    }
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider.')
  return context
}
