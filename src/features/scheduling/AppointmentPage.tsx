import { useEffect, useRef, useState } from 'react';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { appointmentSchema, createPendingAppointment, type AppointmentData } from './scheduling.schema';
import { siteConfig } from '../../lib/config/siteConfig';
import { buildWhatsAppUrl } from '../../lib/whatsapp/buildWaUrl';
import { normalizeBrazilPhone } from '../../lib/whatsapp/normalizePhone';
import { localTodayISO } from '../../lib/validation/requestedDate';
import { useAuth } from '../auth/AuthProvider';
import { persistAppointment } from './scheduling.service';
import { supabase } from '../../lib/supabase/client';

const fallbackTimes = ['09:00', '10:30', '14:00', '15:30', '17:00'];
const initial: AppointmentData = {
  name: '', phone: '', service: 'Orçamento personalizado', date: '', time: '', notes: '',
};

export function AppointmentPage() {
  const auth = useAuth();
  const [data, setData] = useState<AppointmentData>(initial);
  const [times, setTimes] = useState(fallbackTimes);
  const [demoSlots, setDemoSlots] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const [saveError, setSaveError] = useState('');
  const savedRequestKey = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!supabase || !data.date) {
      setTimes(fallbackTimes);
      setDemoSlots(true);
      return;
    }

    setTimes(fallbackTimes);
    setDemoSlots(true);
    const weekday = new Date(data.date + 'T12:00:00').getDay();
    void supabase.from('availability')
      .select('time_value')
      .eq('weekday', weekday)
      .eq('is_active', true)
      .order('time_value')
      .then(({ data: rows }) => {
        if (cancelled) return;
        if (rows?.length) {
          setTimes(rows.map(row => String(row.time_value).slice(0, 5)));
          setDemoSlots(false);
        } else {
          setTimes(fallbackTimes);
          setDemoSlots(true);
        }
      });
    return () => { cancelled = true; };
  }, [data.date]);

  const update = (key: keyof AppointmentData, value: string) => {
    setData(current => ({
      ...current,
      [key]: value,
      ...(key === 'date' ? { time: '' } : {}),
    }));
    setErrors(current => ({ ...current, [key]: '' }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = appointmentSchema.safeParse(data);
    if (result.success) {
      setErrors({});
      setReview(true);
      return;
    }
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (!next[field]) next[field] = issue.message;
    }
    setErrors(next);
  };

  const saveInBackground = () => {
    if (!auth.user) return;
    const key = JSON.stringify(data);
    if (savedRequestKey.current === key) return;
    savedRequestKey.current = key;
    setSaveError('');
    void persistAppointment(auth.user.id, data)
      .then(result => {
        if (result.error) setSaveError('O histórico não foi atualizado. Você ainda pode enviar pelo WhatsApp.');
      })
      .catch(() => setSaveError('O histórico não foi atualizado. Você ainda pode enviar pelo WhatsApp.'));
  };

  const request = createPendingAppointment(data);
  const message = [
    'Olá! Gostaria de solicitar um horário de atendimento na Amor em Papel.',
    '',
    'Nome: ' + request.name,
    'Telefone: ' + request.phone,
    'Serviço: ' + request.service,
    'Data desejada: ' + request.date,
    'Horário desejado: ' + request.time,
    'Observações: ' + (request.notes || 'Nenhuma'),
    '',
    'Status: solicitação pendente de confirmação.',
  ].join('\n');

  const whatsappHref = normalizeBrazilPhone(siteConfig.whatsappNumber)
    ? buildWhatsAppUrl(siteConfig.whatsappNumber, message)
    : '';

  return (
    <section className="page-wrap">
      <div className="page-head">
        <span className="eyebrow">Atendimento personalizado</span>
        <h1>Solicitar um horário</h1>
        <p>Escolha uma preferência. O horário <strong>não fica confirmado</strong> até o retorno da profissional.</p>
      </div>
      {review ? (
        <div className="surface review-card">
          <CalendarDays size={36} />
          <h2>Confira sua solicitação</h2>
          <p><strong>{data.date}</strong> às <strong>{data.time}</strong> — {data.service}</p>
          <div className="pending-banner">Aguardando confirmação da loja.</div>
          <div className="hero-actions">
            <button className="btn btn-ghost" type="button" onClick={() => setReview(false)}>Editar</button>
            {whatsappHref ? (
              <a className="btn btn-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={saveInBackground}>
                <MessageCircle /> Enviar pelo WhatsApp
              </a>
            ) : (
              <button className="btn btn-whatsapp" disabled type="button">
                <MessageCircle /> WhatsApp não configurado
              </button>
            )}
          </div>
          {saveError && <div className="notice" role="alert">{saveError}</div>}
        </div>
      ) : (
        <form className="surface appointment-form" onSubmit={submit} noValidate>
          <label>
            Nome
            <input required value={data.name} aria-invalid={Boolean(errors.name)}
              onChange={event => update('name', event.target.value)} />
            {errors.name && <small className="error" role="alert">{errors.name}</small>}
          </label>
          <label>
            Telefone com DDD
            <input required inputMode="tel" value={data.phone} aria-invalid={Boolean(errors.phone)}
              onChange={event => update('phone', event.target.value)} />
            {errors.phone && <small className="error" role="alert">{errors.phone}</small>}
          </label>
          <label>
            Tipo de serviço
            <select value={data.service} onChange={event => update('service', event.target.value)}>
              <option>Orçamento personalizado</option>
              <option>Topo de bolo</option>
              <option>Kit de festa</option>
              <option>Papelaria personalizada</option>
              <option>Outro</option>
            </select>
          </label>
          <label>
            Data desejada
            <input required type="date" min={localTodayISO()} value={data.date} aria-invalid={Boolean(errors.date)}
              onChange={event => update('date', event.target.value)} />
            {errors.date && <small className="error" role="alert">{errors.date}</small>}
          </label>
          <fieldset className="full slot-field">
            <legend>Horário preferido</legend>
            <div className="slots">
              {times.map(time => (
                <button type="button" className={data.time === time ? 'selected' : ''}
                  aria-pressed={data.time === time} key={time} onClick={() => update('time', time)}>
                  {time}
                </button>
              ))}
            </div>
            {errors.time && <small className="error" role="alert">{errors.time}</small>}
            <small>{demoSlots ? 'Horários demonstrativos. ' : ''}A confirmação acontece no atendimento.</small>
          </fieldset>
          <label className="full">
            Observações
            <textarea rows={4} value={data.notes} onChange={event => update('notes', event.target.value)} />
          </label>
          <button className="btn btn-primary full" type="submit">Revisar solicitação</button>
        </form>
      )}
    </section>
  );
}
