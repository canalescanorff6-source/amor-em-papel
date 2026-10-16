import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { AppShell } from '../../src/components/layout/AppShell';
test('renders premium commerce navigation and accessible search', () => { render(<MemoryRouter><AppProviders><AppShell><div>Conteúdo</div></AppShell></AppProviders></MemoryRouter>); expect(screen.getAllByText('Categorias').length).toBeGreaterThan(0); expect(screen.getAllByText('Personalizados').length).toBeGreaterThan(0); expect(screen.getAllByLabelText('Buscar produtos').length).toBeGreaterThan(0); expect(screen.getAllByLabelText('Abrir carrinho').length).toBeGreaterThan(0); });
