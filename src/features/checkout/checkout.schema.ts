import { z } from 'zod';
import { normalizeBrazilPhone } from '../../lib/whatsapp/normalizePhone';

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe seu nome completo.'),
  phone: z.string().trim().min(10, 'Informe telefone com DDD.').refine((value) => { try { normalizeBrazilPhone(value); return true; } catch { return false; } }, 'Telefone com DDD inválido.'),
  productService: z.string().trim().min(2, 'Informe o produto ou serviço.'),
  quantity: z.coerce.number().int().min(1, 'Quantidade mínima 1.').max(99, 'Quantidade máxima 99.'),
  customizationType: z.string().trim().max(120),
  theme: z.string().trim().max(120),
  personalizedName: z.string().trim().max(100),
  age: z.string().trim().max(20),
  desiredDate: z.string().min(1, 'Informe a data desejada.'),
  receiveType: z.enum(['pickup', 'delivery']),
  address: z.string().trim().max(400),
  notes: z.string().trim().max(1000)
}).superRefine((data, ctx) => {
  if (data.receiveType === 'delivery' && data.address.length < 8) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['address'], message: 'Informe o endereço para entrega.' });
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
