import type { StoredCart } from './cart.types';
const KEY='amor-em-papel:cart:v1';
export function loadCart():StoredCart{
 try{const raw=localStorage.getItem(KEY); if(!raw) return {version:1,items:[]}; const parsed=JSON.parse(raw) as StoredCart; if(parsed.version!==1||!Array.isArray(parsed.items)) return {version:1,items:[]}; return parsed;}catch{return {version:1,items:[]}}
}
export function saveCart(cart:StoredCart){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch{/* private mode/quota: keep in-memory state */}}
export const CART_STORAGE_KEY=KEY;
