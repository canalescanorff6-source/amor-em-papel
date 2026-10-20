import { expect, test } from '@playwright/test';

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};

test('solicitação inválida mostra campos que precisam ser corrigidos', async ({ page }) => {
  await page.goto('/agendamento');
  await page.getByLabel('Nome', { exact: true }).fill('Maria da Silva');
  await page.getByLabel('Telefone com DDD').fill('0000000000');
  await page.getByLabel('Data desejada').fill(yesterday());
  await page.getByRole('button', { name: '09:00' }).click();
  await page.getByRole('button', { name: /Revisar solicitação/ }).click();

  await expect(page.getByText('Informe um telefone com DDD válido.')).toBeVisible();
  await expect(page.getByText('Escolha uma data válida de hoje em diante.')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Confira sua solicitação/ })).toHaveCount(0);
});
