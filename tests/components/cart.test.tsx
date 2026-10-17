import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { ProductCard } from '../../src/features/catalog/ProductCard';
import { demoProducts } from '../../src/data/demoCatalog';

it('adds a product, persists it and gives visible feedback', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><AppProviders><ProductCard product={demoProducts[0]} /></AppProviders></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: /^adicionar$/i }));
  expect(localStorage.getItem('amor-em-papel:cart:v1')).toContain('topo-infantil-camadas');
  expect(screen.getByRole('button', { name: /adicionado/i })).toBeInTheDocument();
  expect(screen.getByText(/produto adicionado ao carrinho/i)).toBeInTheDocument();
});
