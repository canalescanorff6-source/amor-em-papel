import { useMemo, useState } from 'react';
import { ArrowLeft, MessageCircleMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { siteConfig } from '../../lib/config/siteConfig';
import { buildOrderMessage } from '../../lib/whatsapp/buildMessage';
import { buildWhatsAppUrl } from '../../lib/whatsapp/buildWaUrl';
import { useCart } from '../cart/cart.store';
import { useAuth } from '../auth/AuthProvider';
import { createCustomerOrder } from '../orders/orders.service';
import { CheckoutForm } from './CheckoutForm';
import { CheckoutReview } from './CheckoutReview';
import type { CheckoutFormData } from './checkout.schema';

export function CheckoutPage() {
  const cart=useCart(); const auth=useAuth(); const [review,setReview]=useState<CheckoutFormData|null>(null); const [saveState,setSaveState]=useState('');
  const message=useMemo(()=>review?buildOrderMessage(review,cart.items,siteConfig.siteUrl?`${siteConfig.siteUrl}/checkout`:''): '',[review,cart.items]);
  const whatsappReady = Boolean(siteConfig.whatsappNumber);
  async function openWhatsApp(){ if(!review||!whatsappReady) return; if(auth.user&&auth.enabled){ try{ setSaveState('Salvando pedido na sua conta…'); await createCustomerOrder(review,cart.items,message); setSaveState('Pedido salvo na sua conta.'); }catch{ setSaveState('Não foi possível salvar no histórico, mas você ainda pode enviar pelo WhatsApp.'); } } const url=buildWhatsAppUrl(siteConfig.whatsappNumber,message); window.open(url,'_blank','noopener,noreferrer'); }
  if(!cart.items.length) return <><header className="page-header"><span className="eyebrow">Checkout</span><h1>Seu carrinho está vazio</h1></header><Link className="primary-link" to="/produtos">Escolher produtos</Link></>;
  return <div><header className="page-header"><span className="eyebrow">Conferência e WhatsApp</span><h1>{review?'Confira antes de enviar':'Complete os dados do pedido'}</h1><p>O atendimento é feito por um profissional responsável. Data, preço e disponibilidade só ficam confirmados após resposta da loja.</p></header>{!review?<CheckoutForm onReview={setReview}/>:<div className="checkout-review-layout"><CheckoutReview data={review} items={cart.items}/><aside className="checkout-send"><span>Mensagem preparada</span><pre>{message}</pre>{!whatsappReady&&<p className="checkout-blocker">WhatsApp oficial ainda não configurado. O botão de envio fica bloqueado até o número real ser cadastrado.</p>}{saveState&&<p className="save-state" role="status">{saveState}</p>}<Button fullWidth onClick={openWhatsApp} disabled={!whatsappReady}><MessageCircleMore size={18}/> Abrir WhatsApp</Button><button className="text-button" onClick={()=>setReview(null)}><ArrowLeft size={14}/> Editar dados</button></aside></div>}</div>;
}
