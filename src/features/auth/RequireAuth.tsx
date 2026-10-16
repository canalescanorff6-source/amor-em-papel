import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
export function RequireAuth({ children }: PropsWithChildren) { const auth=useAuth(); const location=useLocation(); if(auth.loading) return <div className="route-loading" role="status">Carregando sua conta…</div>; if(!auth.user) return <Navigate to="/conta?login=1" replace state={{from:location.pathname}}/>; return <>{children}</>; }
