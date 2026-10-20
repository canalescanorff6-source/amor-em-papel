import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../features/catalog/catalog.store';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { Badge } from '../components/ui/Badge';
import type { Product } from '../features/catalog/types';

function Showcase({ eyebrow, title, products, href, emptyText }: {
  eyebrow: string;
  title: string;
  products: Product[];
  href: string;
  emptyText?: string;
}) {
  return <section className="section-block showcase-section">
    <div className="section-heading">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      <Link to={href}>Ver todos <ArrowRight size={16}/></Link>
    </div>
    {products.length ? <ProductGrid products={products.slice(0, 4)} /> : <div className="merch-empty">{emptyText}</div>}
  </section>;
}

export function HomePage() {
  const { categories, products, source } = useCatalog();
  const featured = products.filter((product) => product.isFeatured);
  const bestSellers = products.filter((product) => product.isBestSeller);
  const newProducts = products.filter((product) => product.isNew);
  const customized = products.filter((product) => product.isPersonalizable);
  const offers = products.filter((product) => product.price !== null && product.compareAtPrice !== null && product.compareAtPrice > product.price);
  const recommended = [...products]
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isBestSeller) - Number(a.isBestSeller))
    .slice(0, 4);

  return <div className="home-page">
    <section className="hero">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
        <Badge tone="yellow">Papelaria & personalizados</Badge>
        <h1>Ideias que viram <em>memórias bonitas</em>.</h1>
        <p>Topos de bolo, papelaria criativa, lembrancinhas e presentes personalizados com uma experiência simples e delicada.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/produtos">Explorar produtos <ArrowRight size={18}/></Link>
          <Link className="btn btn-secondary" to="/personalizados">Quero personalizar <Sparkles size={18}/></Link>
        </div>
        <div className="hero-trust">
          <span>{source === 'demo' ? '✓ Modelos demonstrativos identificados' : '✓ Catálogo atualizado pela loja'}</span>
          <span>✓ Pedido revisado antes do WhatsApp</span>
        </div>
      </motion.div>
      <div className="hero-art">
        <div className="hero-orbit orbit-one">♡</div><div className="hero-orbit orbit-two">✦</div>
        <img src="/brand/logo-amor-em-papel.webp" alt="Amor em Papel — Papelaria Personalizada"/>
        <div className="hero-mini-card"><strong>Feito do seu jeito</strong><span>Nome • tema • idade • ocasião</span></div>
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">Explore por categoria</span><h2>Um cantinho para cada ideia</h2></div><Link to="/categorias">Ver todas <ArrowRight size={16}/></Link></div>
      <div className="category-rail">{categories.map((category) => <Link className="category-pill" key={category.id} to={`/categoria/${category.slug}`}><span>{category.icon}</span><strong>{category.shortName}</strong></Link>)}</div>
    </section>

    <Showcase eyebrow={source === 'demo' ? 'Curadoria demonstrativa' : 'Curadoria da loja'} title="Produtos em destaque" products={featured} href="/produtos" />
    <Showcase eyebrow="Preferidos da vitrine" title="Mais vendidos" products={bestSellers} href="/mais-vendidos" emptyText="A loja ainda não marcou produtos como mais vendidos." />
    <Showcase eyebrow="Acabaram de chegar" title="Novidades" products={newProducts} href="/novidades" emptyText="As novidades cadastradas pela loja aparecerão aqui." />
    <Showcase eyebrow="Feitos para cada história" title="Personalizados" products={customized} href="/personalizados" emptyText="Os produtos personalizáveis cadastrados pela loja aparecerão aqui." />
    <Showcase eyebrow="Seleção inteligente" title="Recomendados para você" products={recommended} href="/produtos" />
    <Showcase eyebrow="Preço especial" title="Ofertas especiais" products={offers} href="/promocoes" emptyText="Nenhuma promoção comercial foi inventada. Ofertas reais aparecerão aqui quando forem cadastradas pela loja." />

    <section className="story-grid">
      <article className="story-card pink"><div><span className="eyebrow">Personalizados</span><h2>Conte sua ideia. A gente organiza o pedido.</h2><p>Escolha seus itens, informe tema, nome, idade e data. Antes de enviar, você confere a mensagem completa.</p><Link className="btn btn-primary" to="/checkout">Montar solicitação</Link></div><Sparkles/></article>
      <article className="story-card blue"><div><span className="eyebrow">Atendimento</span><h2>Quer conversar antes?</h2><p>Solicite um horário. O pedido fica pendente até a profissional confirmar a disponibilidade.</p><Link className="btn btn-secondary" to="/agendamento"><CalendarDays size={18}/> Solicitar atendimento</Link></div><MessageCircle/></article>
    </section>

    <section className="section-block inspiration-home">
      <div className="section-heading"><div><span className="eyebrow">Crie sem pressa</span><h2>Inspirações criativas</h2></div><Link to="/inspiracoes">Abrir galeria <ArrowRight size={16}/></Link></div>
      <div className="inspiration-strip">
        <Link to="/inspiracoes"><img src="/placeholders/inspiracao-1.svg" alt="Inspiração demonstrativa de papelaria personalizada"/><span>Combinações delicadas</span></Link>
        <Link to="/inspiracoes"><img src="/placeholders/inspiracao-2.svg" alt="Inspiração demonstrativa de festa personalizada"/><span>Festas com identidade</span></Link>
        <Link to="/inspiracoes"><img src="/placeholders/inspiracao-3.svg" alt="Inspiração demonstrativa de presente personalizado"/><span>Presentes afetivos</span></Link>
      </div>
      {source === 'demo' && <small className="demo-caption">Imagens demonstrativas até a cliente cadastrar o portfólio real.</small>}
    </section>

    <section className="how-it-works">
      <div className="section-heading"><div><span className="eyebrow">Como funciona</span><h2>Do desejo ao pedido em quatro passos</h2></div></div>
      <div className="steps">{[['01','Escolha','Navegue por produtos e inspirações.'],['02','Personalize','Informe tema, nome, idade e detalhes.'],['03','Confira','Revise carrinho, data e recebimento.'],['04','Envie','O WhatsApp abre com tudo organizado.']].map(([number,title,description]) => <article key={number}><b>{number}</b><strong>{title}</strong><p>{description}</p></article>)}</div>
    </section>
  </div>;
}
