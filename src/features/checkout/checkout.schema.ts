import { z } from 'zod';
import { normalizeBrazilPhone } from '../../lib/whatsapp/normalizePhone';
import { isRequestedDateValid } from '../../lib/validation/requestedDate';

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe seu nome completo.'),
  phone: z.string().refine(phone => Boolean(normalizeBrazilPhone(phone)), 'Informe um telefone brasileiro válido com DDD.'),
  service: z.string().trim().min(2, 'Informe o produto ou serviço.'),
  quantity: z.coerce.number().int().min(1),
  customization: z.string().optional(),
  theme: z.string().optional(),
  personalizedName: z.string().optional(),
  age: z.string().optional(),
  deliveryDate: z.string().refine(isRequestedDateValid, 'Selecione uma data válida de hoje em diante.'),
  receiptType: z.enum(['retirada', 'entrega']),
  address: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, context) => {
  if (data.receiptType === 'entrega' && !data.address?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['address'],
      message: 'Informe o endereço para entrega.',
    });
  }
});
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
