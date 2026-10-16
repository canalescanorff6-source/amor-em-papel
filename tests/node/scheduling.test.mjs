import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAppointmentPayload, getSlotsForDate } from '../../src/features/scheduling/scheduling.logic.ts';

test('appointment payload is always pending regardless of caller input', () => {
  const payload=buildAppointmentPayload({customerName:'Ana',customerPhone:'98912345678',serviceType:'Orçamento',date:'2026-10-19',time:'09:00',notes:'Oi',userId:null});
  assert.equal(payload.status,'pending');
});

test('availability matches specific date first or weekday recurring slots', () => {
  const rows=[{id:'a',specific_date:'2026-10-19',weekday:null,start_time:'10:00',end_time:'11:00',service_type:'Especial',capacity:1,is_active:true},{id:'b',specific_date:null,weekday:1,start_time:'09:00',end_time:'10:00',service_type:'Geral',capacity:1,is_active:true},{id:'c',specific_date:null,weekday:2,start_time:'13:00',end_time:'14:00',service_type:'Outro',capacity:1,is_active:true}];
  const slots=getSlotsForDate(rows,'2026-10-19');
  assert.deepEqual(slots.map((s)=>s.id),['a','b']);
});
