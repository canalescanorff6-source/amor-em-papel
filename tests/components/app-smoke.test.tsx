import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { App } from '../../src/app/App';

it('renders Amor em Papel brand experience', () => {
  render(<MemoryRouter><AppProviders><App /></AppProviders></MemoryRouter>);
  expect(screen.getAllByRole('img', { name: /Amor em Papel/i }).length).toBeGreaterThan(0);
  expect(screen.getByText(/Ideias que viram/i)).toBeInTheDocument();
});
