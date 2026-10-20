import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const good = {
  VITE_SITE_BASE_URL: 'https://amor-em-papel.example.com',
  VITE_WHATSAPP_NUMBER: '+55 (98) 99876-5432',
  VITE_SUPABASE_URL: 'https://sample-project.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'sb_publishable_testplaceholder',
  VITE_ENABLE_DEMO_FALLBACK: 'false',
};

function runRelease(overrides: Record<string, string> = {}) {
  const env = { ...process.env, ...good, ...overrides };
  return spawnSync(process.execPath, ['scripts/release-check.mjs'], { env, encoding: 'utf8' });
}

describe('release CLI validates configuration, not merely nonempty fields', () => {
  it('rejects a malformed HTTPS origin', () => {
    const result = runRelease({ VITE_SITE_BASE_URL: 'https://' });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/VITE_SITE_BASE_URL/);
  });

  it('rejects invalid and fake repetitive WhatsApp contacts', () => {
    for (const value of ['0000000000', '5598999999999']) {
      const result = runRelease({ VITE_WHATSAPP_NUMBER: value });
      expect(result.status, value).not.toBe(0);
      expect(result.stderr).toMatch(/VITE_WHATSAPP_NUMBER/);
    }
  });

  it('requires demonstration mode off', () => {
    const result = runRelease({ VITE_ENABLE_DEMO_FALLBACK: 'true' });
    expect(result.status).not.toBe(0);
  });

  it('passes well-formed configuration only as a preflight', () => {
    const result = runRelease();
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/configura/i);
  });
});
