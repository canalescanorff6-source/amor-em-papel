import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Modal({ open, onClose, title, children }: PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  if (!open) return null;
  return (
    <div className="modal-layer" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header"><h2 id="modal-title">{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label="Fechar janela"><X size={20} /></button></div>
        {children}
      </section>
    </div>
  );
}
