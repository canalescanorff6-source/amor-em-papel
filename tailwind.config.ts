import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { pink: '#F5619C', pinkSoft: '#F9D8E7', blue: '#87D7F6', aqua: '#B9EFF2', yellow: '#FBCB69', brown: '#472B24' },
      },
    },
  },
  plugins: [],
} satisfies Config;
