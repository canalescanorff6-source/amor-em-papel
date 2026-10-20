import type { Category, Product } from '../features/catalog/types';

export const categories: Category[] = [
  ['escolar','Papelaria escolar','Escolar','✏️','Materiais criativos para rotina escolar.'],
  ['escritorio','Materiais de escritório','Escritório','📎','Organização bonita para trabalho e estudo.'],
  ['cadernos','Cadernos e agendas','Cadernos','📒','Cadernos, planners e agendas personalizáveis.'],
  ['canetas','Canetas e marcadores','Canetas','🖊️','Canetas, marca-textos e escrita criativa.'],
  ['topos','Topos de bolo','Topos','🎂','Topos personalizados para celebrar momentos únicos.'],
  ['lembrancinhas','Lembrancinhas personalizadas','Lembranças','🎁','Mimos personalizados para festas e eventos.'],
  ['caixas','Caixas e embalagens','Caixas','📦','Embalagens personalizadas e caixas especiais.'],
  ['decoracao','Decoração de festas','Decoração','🎈','Peças coordenadas para mesas e cenários.'],
  ['personalizados','Produtos personalizados','Personalizados','💖','Criações feitas com nome, tema e detalhes especiais.'],
  ['presentes','Presentes criativos','Presentes','✨','Ideias afetivas para presentear com personalidade.'],
].map(([slug,name,shortName,icon,description], index) => ({ id: String(index+1), slug, name, shortName, icon, description }));

const ph = (name: string) => `/placeholders/${name}.svg`;
export const demoProducts: Product[] = [
  { id:'p1', slug:'topo-infantil-camadas', name:'Topo infantil em camadas', description:'Modelo demonstrativo para visualizar composição em camadas, nome e idade.', categoryId:'5', image:ph('topo-infantil'), images:[ph('topo-infantil')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:true, isFeatured:true, isBestSeller:false, stock:null, tags:['topo','infantil','camadas'] },
  { id:'p2', slug:'topo-classico-personalizado', name:'Topo clássico personalizado', description:'Modelo demonstrativo com personalização de nome, idade e tema.', categoryId:'5', image:ph('topo-classico'), images:[ph('topo-classico')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:false, isFeatured:true, isBestSeller:true, stock:null, tags:['topo','classico','personalizado'] },
  { id:'p3', slug:'topo-elegante-festa', name:'Topo elegante para festa', description:'Modelo demonstrativo com acabamento delicado e composição sofisticada.', categoryId:'8', image:ph('topo-elegante'), images:[ph('topo-elegante')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:false, isFeatured:true, isBestSeller:false, stock:null, tags:['festa','elegante','decoracao'] },
  { id:'p4', slug:'kit-personalizado-festa', name:'Kit personalizado para festa', description:'Modelo demonstrativo de kit com peças coordenadas para mesa e lembranças.', categoryId:'9', image:ph('kit-personalizado'), images:[ph('kit-personalizado')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:true, isFeatured:true, isBestSeller:true, stock:null, tags:['kit','festa','personalizado'] },
  { id:'p5', slug:'caderno-personalizado', name:'Caderno personalizado', description:'Modelo demonstrativo de caderno com capa personalizada.', categoryId:'3', image:ph('papelaria'), images:[ph('papelaria')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:true, isFeatured:false, isBestSeller:false, stock:null, tags:['caderno','agenda','papelaria'] },
  { id:'p6', slug:'caixa-afetiva-personalizada', name:'Caixa afetiva personalizada', description:'Modelo demonstrativo para presentes e lembranças especiais.', categoryId:'7', image:ph('inspiracao-1'), images:[ph('inspiracao-1')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:false, isFeatured:true, isBestSeller:false, stock:null, tags:['caixa','presente','afetiva'] },
  { id:'p7', slug:'lembrancinha-tematica', name:'Lembrancinha temática', description:'Modelo demonstrativo para aniversários e comemorações.', categoryId:'6', image:ph('inspiracao-2'), images:[ph('inspiracao-2')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:false, isFeatured:false, isBestSeller:true, stock:null, tags:['lembrancinha','tema','festa'] },
  { id:'p8', slug:'presente-criativo', name:'Presente criativo personalizado', description:'Modelo demonstrativo para presente afetivo e exclusivo.', categoryId:'10', image:ph('inspiracao-3'), images:[ph('inspiracao-3')], price:null, compareAtPrice:null, isDemo:true, isActive:true, isPersonalizable:true, isNew:true, isFeatured:false, isBestSeller:false, stock:null, tags:['presente','criativo','personalizado'] },
];
