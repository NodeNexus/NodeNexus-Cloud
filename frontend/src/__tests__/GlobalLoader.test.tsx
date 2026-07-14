import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GlobalLoader } from '../components/GlobalLoader'

describe('GlobalLoader', () => {
  it('renders a loading spinner and core app structure without crashing', () => {
    render(<GlobalLoader />)
    
    // Check if the logo is present
    expect(screen.getByRole('banner')).toBeInTheDocument()
    
    // Check if a spinner (svg) is rendered
    const spinner = screen.getByRole('status', { hidden: true }) 
    // In our implementation it doesn't have role="status", but let's check for the spinning div.
    // Instead we can look for the specific animated div.
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
