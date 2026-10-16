import { ArrowLeft, MessageCircleMore, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from './types';
import { Badge } from '../../components/ui/Badge';
import { useCart } from '../cart/cart.store';

export function ProductDetail({ product }: { product: Product }) {
  const cart = useCart();
  return (
    <article className="product-detail">
      <div className="product-detail__media"><img src={product.imageUrl} alt={product.imageAlt} /><span>Imagem {product.isDemo ? 'demonstrativa' : 'do produto'}</span></div>
      <div className="product-detail__content">
        <Link to="/produtos" className="back-link"><ArrowLeft size={16} /> Voltar ao catálogo</Link>
        <div className="product-detail__badges">{product.isDemo && <Badge>Demonstração</Badge>}{product.personalizable && <Badge tone="blue"><Sparkles size={12} /> Personalizável</Badge>}</div>
        <h1>{product.name}</h1><p className="product-detail__lead">{product.description}</p>
        <div className="product-detail__price"><span>Valor</span><strong>{product.price === null ? 'Sob consulta' : product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        {product.personalizable && <section className="customization-preview"><h2>O que poderá ser personalizado</h2><div>{product.customizationFields?.map((field) => <span key={field}>{({ name: 'Nome', age: 'Idade', theme: 'Tema', colors: 'Cores', notes: 'Observações' } as const)[field]}</span>)}</div></section>}
        <div className="product-detail__notice"><ShieldCheck size={20} /><p>Em itens demonstrativos, preço, estoque, acabamento e prazo só serão exibidos depois do cadastro real da loja.</p></div>
        <div className="product-detail__actions"><button type="button" className="primary-link button-link" onClick={() => cart.add(product)}>Adicionar ao carrinho</button><Link to="/atendimento" className="secondary-link"><MessageCircleMore size={18} /> Tirar dúvida</Link></div>
      </div>
    </article>
  );
}
