import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  id?: string;
};

type InputFieldProps = BaseFieldProps & {
  textarea?: false;
} & Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseFieldProps | 'textarea'>;

type TextareaFieldProps = BaseFieldProps & {
  textarea: true;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseFieldProps | 'textarea'>;

export type FieldProps = InputFieldProps | TextareaFieldProps;

export function Field(props: FieldProps) {
  const fieldId = props.id ?? `field-${props.label.toLowerCase().replace(/\W+/g, '-')}`;

  if (props.textarea) {
    const { label, error, hint, textarea: _textarea, id: _id, ...controlProps } = props;
    return (
      <label className="field" htmlFor={fieldId}>
        <span className="field__label">{label}</span>
        <textarea id={fieldId} className="field__control field__textarea" {...controlProps} />
        {hint && <span className="field__hint">{hint}</span>}
        {error && <span className="field__error" role="alert">{error}</span>}
      </label>
    );
  }

  const { label, error, hint, textarea: _textarea, id: _id, ...controlProps } = props;
  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field__label">{label}</span>
      <input id={fieldId} className="field__control" {...controlProps} />
      {hint && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error" role="alert">{error}</span>}
    </label>
  );
}
