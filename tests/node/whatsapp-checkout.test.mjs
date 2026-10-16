import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBrazilPhone } from '../../src/lib/whatsapp/normalizePhone.ts';
import { buildOrderMessage } from '../../src/lib/whatsapp/buildMessage.ts';
import { buildWhatsAppUrl } from '../../src/lib/whatsapp/buildWaUrl.ts';

const cart = [{ key:'x', productId:'p1', productSlug:'topo', productName:'Topo Jardim 🌸', imageUrl:'/x.jpg', unitPrice:null, quantity:2, isDemo:true, personalizable:true, customization:{ name:'Lívia', theme:'Jardim & flores' } }];
const checkout = { fullName:'João Ávila', phone:'(98) 9 1234-5678', productService:'Topos e personalizados', quantity:2, customizationType:'Nome e idade', theme:'Jardim 🌸', personalizedName:'Lívia', age:'6', desiredDate:'2026-12-20', receiveType:'pickup', address:'', notes:'Quero 100% rosa\nSem dourado.' };

test('normalizes Brazilian numbers with or without country code', () => {
  assert.equal(normalizeBrazilPhone('(98) 9 1234-5678'), '5598912345678');
  assert.equal(normalizeBrazilPhone('+55 (98) 91234-5678'), '5598912345678');
  assert.throws(() => normalizeBrazilPhone('12345'), /inválido/i);
});

test('order message preserves accents emoji newlines percent and cart content', () => {
  const message = buildOrderMessage(checkout, cart, 'https://amorempapel.com.br/checkout');
  assert.match(message, /João Ávila/);
  assert.match(message, /Jardim 🌸/);
  assert.match(message, /100% rosa/);
  assert.match(message, /Topo Jardim 🌸/);
  assert.match(message, /Lívia/);
  assert.match(message, /\n/);
});

test('WhatsApp URL encodes payload exactly once and round-trips without replacement characters', () => {
  const message = buildOrderMessage(checkout, cart, 'https://amorempapel.com.br/checkout');
  const url = buildWhatsAppUrl('98912345678', message);
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'wa.me');
  assert.equal(parsed.pathname, '/5598912345678');
  assert.equal(parsed.searchParams.get('text'), message);
  assert.equal(parsed.searchParams.get('text').includes('�'), false);
  assert.equal(decodeURIComponent(parsed.search.slice(6)), message);
});
