import { ArrowLeft, MessageCircleMore, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from './types';
import { Badge } from '../../components/ui/Badge';
import { Field } from '../../components/ui/Field';
import { useCart } from '../cart/cart.store';

const fieldLabels = {
  name: 'Nome',
  age: 'Idade',
  theme: 'Tema',
  colors: 'Cores preferidas',
  notes: 'Observações'
} as const;

export function ProductDetail({ product }: { product: Product }) {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');

  function updateCustomization(field: string, value: string) {
    setCustomization((current) => ({ ...current, [field]: value }));
    setFeedback('');
  }

  function addToCart() {
    cart.add(product, quantity, customization);
    setFeedback('Adicionado ao carrinho. Você poderá revisar tudo antes de enviar pelo WhatsApp.');
  }

  return (
    <article className="product-detail">
      <div className="product-detail__media"><img src={product.imageUrl} alt={product.imageAlt} /><span>Imagem {product.isDemo ? 'demonstrativa' : 'do produto'}</span></div>
      <div className="product-detail__content">
        <Link to="/produtos" className="back-link"><ArrowLeft size={16} /> Voltar ao catálogo</Link>
        <div className="product-detail__badges">{product.isDemo && <Badge>Demonstração</Badge>}{product.personalizable && <Badge tone="blue"><Sparkles size={12} /> Personalizável</Badge>}</div>
        <h1>{product.name}</h1><p className="product-detail__lead">{product.description}</p>
        <div className="product-detail__price"><span>Valor</span><strong>{product.price === null ? 'Sob consulta' : product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>

        {product.personalizable && Boolean(product.customizationFields?.length) && (
          <section className="customization-form" aria-labelledby="customization-title">
            <h2 id="customization-title">Personalize este produto</h2>
            <p>Preencha o que já souber. Os detalhes finais ainda serão conferidos pela loja.</p>
            <div className="customization-form__grid">
              {product.customizationFields?.map((field) =>
                field === 'notes' ? (
                  <Field
                    key={field}
                    textarea
                    label={fieldLabels[field]}
                    value={customization[field] ?? ''}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateCustomization(field, event.target.value)}
                  />
                ) : (
                  <Field
                    key={field}
                    label={fieldLabels[field]}
                    inputMode={field === 'age' ? 'numeric' : undefined}
                    value={customization[field] ?? ''}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => updateCustomization(field, event.target.value)}
                  />
                )
              )}
            </div>
          </section>
        )}

        <label className="product-quantity">
          <span>Quantidade</span>
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))}
          />
        </label>

        {product.isDemo && <div className="product-detail__notice"><ShieldCheck size={20} /><p>Em itens demonstrativos, preço, estoque, acabamento e prazo só serão exibidos depois do cadastro real da loja.</p></div>}

        <div className="product-detail__actions">
          <button type="button" className="primary-link button-link" onClick={addToCart}>Adicionar ao carrinho</button>
          <Link to="/atendimento" className="secondary-link"><MessageCircleMore size={18} /> Tirar dúvida</Link>
        </div>
        {feedback && <p className="cart-feedback" role="status">{feedback}</p>}
      </div>
    </article>
  );
}
