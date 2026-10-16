import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../../src/app/providers';
import { ProductCard } from '../../src/features/catalog/ProductCard';
import { demoProducts } from '../../src/data/demoCatalog';
test('demo product card labels non-real commerce data clearly', () => { render(<MemoryRouter><AppProviders><ProductCard product={demoProducts[0]} /></AppProviders></MemoryRouter>); expect(screen.getByText('Demonstração')).toBeInTheDocument(); expect(screen.getByText('Sob consulta')).toBeInTheDocument(); });
