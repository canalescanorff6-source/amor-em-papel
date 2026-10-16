import type { PropsWithChildren } from 'react';

export function Badge({ children, tone = 'pink' }: PropsWithChildren<{ tone?: 'pink' | 'blue' | 'yellow' | 'neutral' }>) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
