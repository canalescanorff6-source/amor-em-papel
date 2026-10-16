import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth = false, className = '', children, ...props }: PropsWithChildren<ButtonProps>) {
  return <button className={`button button--${variant} ${fullWidth ? 'button--full' : ''} ${className}`} {...props}>{children}</button>;
}
