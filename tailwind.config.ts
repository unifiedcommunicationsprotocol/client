import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // Semantic color palette from origin.css
        bg: 'var(--r-bg, #ffffff)',
        sf: 'var(--r-sf, #f9fafb)',
        sf2: 'var(--r-sf2, #f3f4f6)',
        bd: 'var(--r-bd, #e5e7eb)',
        bd2: 'var(--r-bd2, #d1d5db)',
        t1: 'var(--r-t1, #1f2937)',
        t2: 'var(--r-t2, #6b7280)',
        t3: 'var(--r-t3, #9ca3af)',
        acc: 'var(--r-acc, #6366f1)',
        accd: 'var(--r-accd, #d1d5f0)',
        safe: 'var(--r-safe, #22c55e)',
        danger: 'var(--r-danger, #ef4444)',
        hov: 'var(--r-hov, #f5f5f5)',
        sel: 'var(--r-sel, #eef2ff)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          to: {
            opacity: '1',
            transform: 'none',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.3s ease',
        fadeIn: 'fadeIn 0.3s ease',
      },
      transitionDuration: {
        200: '0.2s',
      },
    },
  },
  plugins: [],
} satisfies Config;
