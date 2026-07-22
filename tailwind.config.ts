import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        panelAlt: 'rgb(var(--color-panel-alt) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        lineSoft: 'rgb(var(--color-line-soft) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;