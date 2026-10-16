import { supabase } from '../../lib/supabase/client';
import type { CartItem } from '../cart/cart.types';
import type { CheckoutFormData } from '../checkout/checkout.schema';

export interface OrderRecord { id:string; user_id:string|null; status:string; customer_name:string; desired_date:string|null; subtotal:number; has_quote_items:boolean; created_at:string; order_items?: Array<{id:string;product_name:string;quantity:number;unit_price:number|null;customization:Record<string,string>;is_demo:boolean}>; }

export async function listOwnOrders(userId: string): Promise<OrderRecord[]> {
  if(!supabase) return [];
  const {data,error}=await supabase.from('orders').select('id,user_id,status,customer_name,desired_date,subtotal,has_quote_items,created_at,order_items(id,product_name,quantity,unit_price,customization,is_demo)').eq('user_id',userId).order('created_at',{ascending:false});
  if(error) throw error;
  return (data??[]) as OrderRecord[];
}

export async function createCustomerOrder(data: CheckoutFormData, items: CartItem[], message: string): Promise<string | null> {
  if(!supabase) return null;
  const subtotal=items.reduce((sum,item)=>sum+(item.unitPrice??0)*item.quantity,0);
  const {data:orderId,error}=await supabase.rpc('create_customer_order',{ order_input:{customer_name:data.fullName,customer_phone:data.phone,receive_type:data.receiveType,delivery_address:data.address,desired_date:data.desiredDate,notes:data.notes,subtotal,has_quote_items:items.some((item)=>item.unitPrice===null),whatsapp_message:message}, items_input:items.map((item)=>({product_id:item.productId,product_name:item.productName,quantity:item.quantity,unit_price:item.unitPrice,customization:item.customization,is_demo:item.isDemo})) });
  if(error) throw error;
  return orderId as string;
}
