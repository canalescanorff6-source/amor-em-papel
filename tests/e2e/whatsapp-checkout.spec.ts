import { test, expect } from '@playwright/test';

test('checkout cria link WhatsApp válido durante o gesto do usuário', async ({ page }) => {
  await page.goto('/produtos');
  await page.getByRole('button', { name: /^Adicionar$/i }).first().click();
  await page.goto('/checkout');

  await page.getByLabel('Nome completo').fill('Maria da Silva');
  await page.getByLabel('Telefone com DDD').fill('98999998888');
  await page.getByLabel('Tipo de personalização').fill('Coração rosa 💗 e laço');
  await page.getByLabel('Data desejada').fill('2026-12-20');
  await page.getByRole('button', { name: 'Revisar pedido' }).click();

  const link = page.getByRole('link', { name: /Enviar pedido organizado no WhatsApp/i });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  const href = await link.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/5598999998888\?text=/);
  const message = new URL(href!).searchParams.get('text');
  expect(message).toContain('Coração rosa 💗 e laço');
  expect(message).toContain('Maria da Silva');
  expect(message).not.toContain('�');
});
