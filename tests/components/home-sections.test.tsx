import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { HomePage } from '../../src/pages/HomePage';

it('exposes the full premium merchandising sections without inventing promotions', () => {
  render(<MemoryRouter><AppProviders><HomePage /></AppProviders></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /produtos em destaque/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /mais vendidos/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /novidades/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /personalizados/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /recomendados para você/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /ofertas especiais/i })).toBeInTheDocument();
  expect(screen.getByText(/nenhuma promoção comercial foi inventada/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /inspirações criativas/i })).toBeInTheDocument();
});
