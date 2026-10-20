import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
afterEach(() => { localStorage.clear(); document.head.querySelectorAll('meta[data-test-seo]').forEach((node) => node.remove()); });
