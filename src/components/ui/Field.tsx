import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type Props = {
  label: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
} & (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Field({ label, error, hint, textarea = false, id, ...props }: Props) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field__label">{label}</span>
      {textarea ? <textarea id={fieldId} className="field__control field__textarea" {...props as TextareaHTMLAttributes<HTMLTextAreaElement>} /> : <input id={fieldId} className="field__control" {...props as InputHTMLAttributes<HTMLInputElement>} />}
      {hint && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error" role="alert">{error}</span>}
    </label>
  );
}
