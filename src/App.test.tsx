import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome screen when portfolio is empty', () => {
  render(<App />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
