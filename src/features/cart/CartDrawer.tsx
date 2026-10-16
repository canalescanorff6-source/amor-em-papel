import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Drawer } from '../../components/ui/Drawer';
import { useCart } from './cart.store';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  return <Drawer open={open} onClose={onClose} title="Seu carrinho">{cart.items.length === 0 ? <div className="mini-empty"><p>Seu carrinho está vazio.</p><Link to="/produtos" onClick={onClose}>Explorar produtos</Link></div> : <div className="cart-list">{cart.items.map((item) => <div className="cart-line" key={item.key}><img src={item.imageUrl} alt="" /><div><strong>{item.productName}</strong><span>{item.unitPrice === null ? 'Valor sob consulta' : item.unitPrice.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span><div className="quantity-control"><button aria-label={`Diminuir ${item.productName}`} onClick={() => cart.updateQuantity(item.key,item.quantity-1)}><Minus size={14}/></button><span>{item.quantity}</span><button aria-label={`Aumentar ${item.productName}`} onClick={() => cart.updateQuantity(item.key,item.quantity+1)}><Plus size={14}/></button><button className="remove-line" aria-label={`Remover ${item.productName}`} onClick={() => cart.remove(item.key)}><Trash2 size={14}/></button></div></div></div>)}<div className="cart-drawer__footer"><div><span>Subtotal conhecido</span><strong>{cart.subtotal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div><p>Itens sob consulta serão confirmados pela loja.</p><Link className="primary-link" to="/carrinho" onClick={onClose}>Revisar carrinho</Link></div></div>}</Drawer>;
}
