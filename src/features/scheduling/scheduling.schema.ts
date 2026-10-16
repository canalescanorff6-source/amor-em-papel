import { z } from 'zod';
import { normalizeBrazilPhone } from '../../lib/whatsapp/normalizePhone';
export const appointmentSchema=z.object({ customerName:z.string().trim().min(3,'Informe seu nome.'), customerPhone:z.string().trim().refine((value)=>{try{normalizeBrazilPhone(value);return true}catch{return false}},'Telefone com DDD inválido.'), serviceType:z.string().trim().min(2,'Escolha o tipo de atendimento.'), date:z.string().min(1,'Escolha uma data.'), time:z.string().min(1,'Escolha um horário.'), availabilityId:z.string().nullable().optional(), notes:z.string().trim().max(800) });
export type AppointmentFormData=z.infer<typeof appointmentSchema>;
