'use client'

import { render, screen } from '@testing-library/react'
import Header from '@/components/common/Header'

describe('Header', () => {
  it('renders the store title and cart button', () => {
    render(<Header cartItemCount={2} onCartClick={() => undefined} />)

    expect(screen.getByText('Judaica Store')).toBeInTheDocument()
    expect(screen.getByText(/Cart \(2\)/)).toBeInTheDocument()
  })
})
