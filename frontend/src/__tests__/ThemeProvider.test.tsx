import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeProvider, useTheme } from '../providers/ThemeProvider'

// A dummy component to consume the hook
const ThemeConsumer = () => {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark', 'light')
  })

  it('provides system theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
  })

  it('allows toggling themes and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText('Set Dark'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(localStorage.getItem('vite-ui-theme')).toBe('dark')
    
    // Check if class was applied to document
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    fireEvent.click(screen.getByText('Set Light'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    expect(localStorage.getItem('vite-ui-theme')).toBe('light')
    
    // Check if class was updated
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
