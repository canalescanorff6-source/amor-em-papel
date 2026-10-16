import { Search } from 'lucide-react';

export function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="catalog-search"><Search size={18} /><span className="sr-only">Pesquisar catálogo</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Buscar por nome, tema ou categoria" aria-label="Pesquisar catálogo" /></label>;
}
