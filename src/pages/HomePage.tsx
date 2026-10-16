import { ArrowRight, Backpack, BriefcaseBusiness, CakeSlice, Gift, Heart, NotebookTabs, PackageOpen, PartyPopper, PenLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, demoProducts } from '../data/demoCatalog';
import { getProductsByCollection } from '../features/catalog/catalog.service';
import { ProductCard } from '../features/catalog/ProductCard';
import { Reveal } from '../components/ui/Reveal';

const iconMap = { Backpack, BriefcaseBusiness, NotebookTabs, PenLine, CakeSlice, Gift, PackageOpen, PartyPopper, Sparkles, Heart };

function ProductSection({ title, eyebrow, products }: { title: string; eyebrow: string; products: typeof demoProducts }) {
  return <section className="home-section"><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><Link to="/produtos">Ver todos <ArrowRight size={16} /></Link></div><div className="product-rail">{products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>;
}

export function HomePage() {
  return (
    <>
      <section className="hero-premium">
        <div className="hero-premium__content"><span className="hero-kicker"><Sparkles size={15} /> Criatividade que vira carinho</span><h1>Papelaria e personalizados com a delicadeza da <em>Amor em Papel</em>.</h1><p>Explore ideias para escola, organização, presentes e festas. Os produtos abaixo são modelos demonstrativos até o cadastro do catálogo real.</p><div className="hero-actions"><Link to="/produtos" className="primary-link">Explorar produtos <ArrowRight size={17} /></Link><Link to="/personalizados" className="secondary-link">Quero personalizar</Link></div></div>
        <div className="hero-premium__art"><div className="hero-logo-card"><img src="/logo-amor-em-papel.jpg" alt="Amor em Papel" /></div><span className="floating-pill floating-pill--one">Topos de bolo</span><span className="floating-pill floating-pill--two">Papelaria criativa</span><span className="floating-pill floating-pill--three">Presentes</span></div>
      </section>
      <Reveal><section className="category-section"><div className="section-heading"><div><span className="eyebrow">Explore por categoria</span><h2>Encontre seu próximo detalhe favorito</h2></div><Link to="/categorias">Todas as categorias <ArrowRight size={16} /></Link></div><div className="category-rail">{categories.map((category) => { const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Sparkles; return <Link key={category.id} to={`/categoria/${category.slug}`} className={`category-bubble category-bubble--${category.accent}`}><span><Icon size={25} /></span><strong>{category.name}</strong></Link>; })}</div></section></Reveal>
      <Reveal><ProductSection title="Escolhas para começar" eyebrow="Destaques demonstrativos" products={getProductsByCollection(demoProducts, 'featured')} /></Reveal>
      <Reveal><section className="personal-banner"><div><span className="eyebrow">Feito para sua história</span><h2>Um personalizado começa com uma ideia.</h2><p>Nome, idade, tema, cores e observações entram no pedido para a loja conferir antes da produção.</p><Link className="primary-link" to="/personalizados">Ver personalizados <ArrowRight size={17} /></Link></div><div className="personal-banner__hearts"><Heart /><Sparkles /><CakeSlice /></div></section></Reveal>
      <Reveal><ProductSection title="Novidades para inspirar" eyebrow="Modelos de demonstração" products={getProductsByCollection(demoProducts, 'new')} /></Reveal>
      <Reveal><ProductSection title="Recomendados para você" eyebrow="Seleção demonstrativa" products={demoProducts.slice(2,8)} /></Reveal>
      <Reveal><ProductSection title="Inspirações criativas" eyebrow="Ideias para personalizar" products={getProductsByCollection(demoProducts, 'inspiration')} /></Reveal>
      <Reveal><section className="benefit-strip"><div><span>01</span><strong>Escolha</strong><p>Encontre um modelo ou ideia.</p></div><div><span>02</span><strong>Personalize</strong><p>Informe nome, tema e detalhes.</p></div><div><span>03</span><strong>Confira</strong><p>Revise seu pedido antes de enviar.</p></div><div><span>04</span><strong>WhatsApp</strong><p>A loja confirma prazo e produção.</p></div></section></Reveal>
    </>
  );
}
