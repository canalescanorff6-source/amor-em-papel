import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Drawer({ open, onClose, title, children }: PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  if (!open) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer__header"><h2>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label={`Fechar ${title}`}><X size={20} /></button></div>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>
  );
}
