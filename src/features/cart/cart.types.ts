import type { Product } from '../catalog/types';
export type CartCustomization={summary:string;theme?:string;name?:string;age?:string};
export type CartItem={id:string;product:Product;quantity:number;customization?:CartCustomization};
export type StoredCart={version:1;items:CartItem[]};
