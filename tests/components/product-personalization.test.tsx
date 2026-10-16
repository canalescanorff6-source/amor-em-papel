import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { ProductDetail } from '../../src/features/catalog/ProductDetail';
import { demoProducts } from '../../src/data/demoCatalog';

test('personalization is captured in the cart snapshot before checkout', async () => {
  window.localStorage.clear();
  const user = userEvent.setup();
  const product = demoProducts.find((item) => item.slug === 'topo-de-bolo-jardim')!;

  render(
    <MemoryRouter>
      <AppProviders>
        <ProductDetail product={product} />
      </AppProviders>
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText('Nome'), 'Lívia');
  await user.type(screen.getByLabelText('Idade'), '6');
  await user.type(screen.getByLabelText('Tema'), 'Jardim das flores');
  await user.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));

  await waitFor(() => {
    const stored = window.localStorage.getItem('amor-em-papel:cart:v2') ?? '';
    expect(stored).toContain('Lívia');
    expect(stored).toContain('Jardim das flores');
  });

  expect(screen.getByRole('status')).toHaveTextContent('Adicionado ao carrinho');
});
