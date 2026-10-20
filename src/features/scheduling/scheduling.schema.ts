import { z } from 'zod';
import { normalizeBrazilPhone } from '../../lib/whatsapp/normalizePhone';
import { isRequestedDateValid } from '../../lib/validation/requestedDate';

export const appointmentSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome.'),
  phone: z.string().refine(phone => Boolean(normalizeBrazilPhone(phone)), 'Informe um telefone com DDD válido.'),
  service: z.string().trim().min(2, 'Informe o serviço.'),
  date: z.string().refine(isRequestedDateValid, 'Escolha uma data válida de hoje em diante.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Escolha um horário válido.'),
  notes: z.string().optional(),
});
export type AppointmentData = z.infer<typeof appointmentSchema>;
export type AppointmentRequest = AppointmentData & { status: 'pending' };
export const createPendingAppointment = (data: AppointmentData): AppointmentRequest => ({ ...data, status: 'pending' });
