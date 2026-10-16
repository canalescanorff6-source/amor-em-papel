export interface AvailabilityRow {
  id: string;
  specific_date: string | null;
  weekday: number | null;
  start_time: string;
  end_time: string;
  service_type: string;
  capacity: number;
  is_active: boolean;
}

export interface AppointmentDraft {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
  userId: string | null;
  availabilityId?: string | null;
}

export function getSlotsForDate(rows: AvailabilityRow[], date: string): AvailabilityRow[] {
  if (!date) return [];
  const weekday = new Date(`${date}T12:00:00`).getDay();
  return rows
    .filter((row) => row.is_active && (row.specific_date === date || (row.specific_date === null && row.weekday === weekday)))
    .sort((a, b) => Number(Boolean(b.specific_date)) - Number(Boolean(a.specific_date)) || a.start_time.localeCompare(b.start_time));
}

export function buildAppointmentPayload(draft: AppointmentDraft) {
  return {
    user_id: draft.userId,
    availability_id: draft.availabilityId ?? null,
    status: 'pending' as const,
    customer_name: draft.customerName.trim(),
    customer_phone: draft.customerPhone.trim(),
    service_type: draft.serviceType.trim(),
    requested_date: draft.date,
    requested_time: draft.time,
    notes: draft.notes.trim()
  };
}

export function buildAppointmentMessage(draft: AppointmentDraft): string {
  return [
    'Olá! Quero solicitar um horário de atendimento na Amor em Papel. 💗',
    '',
    `Nome: ${draft.customerName}`,
    `Telefone: ${draft.customerPhone}`,
    `Serviço: ${draft.serviceType}`,
    `Data desejada: ${draft.date}`,
    `Horário desejado: ${draft.time}`,
    `Observações: ${draft.notes || 'Nenhuma'}`,
    '',
    'Entendo que este horário é apenas uma solicitação PENDENTE e só fica confirmado após resposta da loja.'
  ].join('\n');
}
