import { test, expect } from '@playwright/test';
test('unauthenticated visitor cannot access admin',async({page})=>{await page.goto('/admin');await expect(page).toHaveURL(/\/conta\?login=1/);await expect(page.getByRole('heading',{name:/Entrar|Criar conta/})).toBeVisible();});
