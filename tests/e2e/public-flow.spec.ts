import { expect, test } from '@playwright/test';

const cartKey = 'amor-em-papel:cart:v1';

async function waitForPersistedCart(page: import('@playwright/test').Page) {
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), cartKey))
    .toContain('topo-infantil-camadas');
}

test('home, catalog and persisted cart work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Ideias que viram/i })).toBeVisible();

  await page.getByRole('link', { name: /Explorar produtos/i }).click();
  await expect(page).toHaveURL(/produtos/);

  await page.getByRole('button', { name: /^Adicionar$/i }).first().click();
  await waitForPersistedCart(page);

  await page.reload();
  await page.goto('/carrinho');
  await expect(page.getByText(/Topo infantil em camadas/i)).toBeVisible();
});

test('mobile has no horizontal overflow', async ({ page }) => {
  for (const width of [360, 390, 430, 768, 1024, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const layout = await page.evaluate(() => {
      const client = document.documentElement.clientWidth;
      const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: element.className?.toString().slice(0, 120) ?? '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        })
        .filter((item) => item.left < -1 || item.right > client + 1)
        .slice(0, 12);

      return {
        scroll: document.documentElement.scrollWidth,
        client,
        offenders,
      };
    });

    expect(
      layout.scroll,
      `overflow at ${width}px: ${JSON.stringify(layout.offenders)}`,
    ).toBeLessThanOrEqual(layout.client + 1);
  }
});

test('checkout requires review before WhatsApp', async ({ page }) => {
  await page.goto('/produtos');
  await page.getByRole('button', { name: /^Adicionar$/i }).first().click();
  await waitForPersistedCart(page);

  await page.goto('/checkout');
  await page.getByLabel('Nome completo').fill('Maria da Silva');
  await page.getByLabel('Telefone com DDD').fill('98999998888');
  await page.getByLabel('Data desejada').fill('2026-12-20');
  await page.getByRole('button', { name: /Revisar pedido/i }).click();

  await expect(page.getByRole('heading', { name: /Confira antes de enviar/i })).toBeVisible();
  await expect(page.getByText(/pendente de confirmação/i)).toBeVisible();
});
