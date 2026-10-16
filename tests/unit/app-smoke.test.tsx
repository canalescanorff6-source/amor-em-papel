import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/app/App';

test('renders Amor em Papel brand', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getAllByText(/Amor em Papel/i).length).toBeGreaterThan(0);
});
