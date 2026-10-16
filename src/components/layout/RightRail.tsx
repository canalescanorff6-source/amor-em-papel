import { CalendarClock, MessageCircleMore, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../lib/config/siteConfig';

export function RightRail() {
  return (
    <aside className="right-rail" aria-label="Atalhos e informações">
      <section className="rail-card rail-card--pink"><Sparkles size={24} /><span className="eyebrow">Personalizados</span><h2>Transforme sua ideia em papel</h2><p>Escolha um modelo e conte como você imagina o seu personalizado.</p><Link className="rail-link" to="/personalizados">Explorar personalizados</Link></section>
      <section className="rail-card"><h3>Seu pedido com cuidado</h3><ul className="benefit-list"><li><MessageCircleMore size={18} />Atendimento pelo WhatsApp</li><li><PackageCheck size={18} />Pedido conferido antes da produção</li><li><CalendarClock size={18} />Data solicitada sujeita à confirmação</li><li><ShieldCheck size={18} />Dados protegidos</li></ul></section>
      <section className="rail-card rail-card--compact"><strong>Atendimento</strong><span>{siteConfig.serviceRegion || 'Região a confirmar'}</span><Link to="/atendimento">Falar com a loja</Link></section>
    </aside>
  );
}
