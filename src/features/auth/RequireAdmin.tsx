import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
export function RequireAdmin({ children }: PropsWithChildren) { const auth=useAuth(); if(auth.loading) return <div className="route-loading" role="status">Validando acesso…</div>; if(!auth.user) return <Navigate to="/conta?login=1" replace/>; if(auth.role!=='admin') return <Navigate to="/conta?forbidden=admin" replace/>; return <>{children}</>; }
