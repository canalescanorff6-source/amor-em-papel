import { useState, type FormEvent } from 'react';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { checkoutSchema, type CheckoutFormData } from './checkout.schema';

const initial: CheckoutFormData = { fullName:'', phone:'', productService:'Papelaria e personalizados', quantity:1, customizationType:'', theme:'', personalizedName:'', age:'', desiredDate:'', receiveType:'pickup', address:'', notes:'' };

export function CheckoutForm({ onReview }: { onReview: (data: CheckoutFormData) => void }) {
  const [data,setData]=useState<CheckoutFormData>(initial); const [errors,setErrors]=useState<Record<string,string>>({});
  const set = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => setData((current)=>({ ...current, [key]:value }));
  function submit(event:FormEvent){ event.preventDefault(); const parsed=checkoutSchema.safeParse(data); if(!parsed.success){ const next:Record<string,string>={}; parsed.error.issues.forEach((issue)=>{ const key=String(issue.path[0]??'form'); if(!next[key]) next[key]=issue.message; }); setErrors(next); return; } setErrors({}); onReview(parsed.data); }
  return <form className="checkout-form" onSubmit={submit} noValidate>
    <div className="form-grid"><Field label="Nome completo" value={data.fullName} onChange={(e)=>set('fullName',(e.target as HTMLInputElement).value)} error={errors.fullName}/><Field label="Telefone com DDD" inputMode="tel" value={data.phone} onChange={(e)=>set('phone',(e.target as HTMLInputElement).value)} error={errors.phone}/><Field label="Produto ou serviço desejado" value={data.productService} onChange={(e)=>set('productService',(e.target as HTMLInputElement).value)} error={errors.productService}/><Field label="Quantidade" type="number" min={1} max={99} value={data.quantity} onChange={(e)=>set('quantity',Number((e.target as HTMLInputElement).value))} error={errors.quantity}/><Field label="Tipo de personalização" value={data.customizationType} onChange={(e)=>set('customizationType',(e.target as HTMLInputElement).value)} placeholder="Ex.: nome, idade e tema"/><Field label="Tema da decoração" value={data.theme} onChange={(e)=>set('theme',(e.target as HTMLInputElement).value)}/><Field label="Nome para personalizado" value={data.personalizedName} onChange={(e)=>set('personalizedName',(e.target as HTMLInputElement).value)}/><Field label="Idade" value={data.age} onChange={(e)=>set('age',(e.target as HTMLInputElement).value)}/><Field label="Data desejada" type="date" value={data.desiredDate} onChange={(e)=>set('desiredDate',(e.target as HTMLInputElement).value)} error={errors.desiredDate}/></div>
    <fieldset className="choice-field"><legend>Tipo de recebimento</legend><label><input type="radio" name="receive" checked={data.receiveType==='pickup'} onChange={()=>set('receiveType','pickup')}/> Retirada a combinar</label><label><input type="radio" name="receive" checked={data.receiveType==='delivery'} onChange={()=>set('receiveType','delivery')}/> Entrega</label></fieldset>
    {data.receiveType==='delivery'&&<Field label="Endereço de entrega" value={data.address} onChange={(e)=>set('address',(e.target as HTMLInputElement).value)} error={errors.address}/>}<Field label="Observações adicionais" textarea value={data.notes} onChange={(e)=>set('notes',(e.target as HTMLTextAreaElement).value)} />
    <Button type="submit">Conferir pedido</Button>
  </form>;
}
