import { Link } from 'react-router-dom';
export function NotFoundPage(){return <div className="not-found"><img src="/logo-amor-em-papel.jpg" alt="Amor em Papel"/><span className="eyebrow">Erro 404</span><h1>Essa página saiu para fazer um recorte.</h1><p>O endereço não existe ou foi movido.</p><Link className="primary-link" to="/">Voltar ao início</Link></div>}
