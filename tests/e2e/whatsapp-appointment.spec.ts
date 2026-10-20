import { test, expect } from '@playwright/test';

test('solicitação de horário usa link direto para WhatsApp, sem pop-up após await', async ({ page }) => {
  await page.goto('/agendamento');
  await page.getByLabel('Nome', { exact: true }).fill('Maria da Silva');
  await page.getByLabel('Telefone com DDD').fill('98999998888');
  await page.getByLabel('Data desejada').fill('2026-12-20');
  await page.getByRole('button', { name: '09:00' }).click();
  await page.getByRole('button', { name: 'Revisar solicitação' }).click();

  const link = page.getByRole('link', { name: 'Enviar pelo WhatsApp' });
  await expect(link).toHaveAttribute('target', '_blank');
  const url = await link.getAttribute('href');
  expect(url).toMatch(/^https:\/\/wa\.me\/5598999998888\?text=/);
  const message = new URL(url!).searchParams.get('text') ?? '';
  expect(message).toContain('Maria da Silva');
  expect(message).toContain('2026-12-20');
  expect(message).toContain('solicitação pendente de confirmação');
});
