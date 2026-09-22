/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.ts', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * Semantic theme tokens — backed by CSS variables supplied at runtime
       * via `vars()` in src/lib/theme.ts (dark) / (light). Use these for
       * chrome instead of hardcoded hex:
       *   bg-canvas bg-panel bg-chip · text-ink text-muted text-dim
       *   border-edge · text-gold (readable yellow in both modes)
       * Yellow FILLS use the brand literal #FFC800 + black text.
       */
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* Semantic theme tokens — CSS-var backed, see src/lib/theme.ts */
        canvas: 'rgb(var(--bg-primary) / <alpha-value>)',
        panel: 'rgb(var(--bg-secondary) / <alpha-value>)',
        chip: 'rgb(var(--bg-tertiary) / <alpha-value>)',
        edge: 'rgb(var(--border-strong) / <alpha-value>)',
        ink: 'rgb(var(--text-primary) / <alpha-value>)',
        muted: 'rgb(var(--text-secondary) / <alpha-value>)',
        dim: 'rgb(var(--text-tertiary) / <alpha-value>)',
        gold: {
          DEFAULT: 'rgb(var(--accent-ink) / <alpha-value>)',
          fill: 'rgb(var(--accent-fill) / <alpha-value>)',
          bright: '#FFE800',
        },
        iqoo: {
          DEFAULT: '#FFC800',
          bright: '#FFE800',
          deep: '#E0A800',
          soft: '#FFF7D6',
          glow: 'rgba(255, 200, 0, 0.4)',
          bg: '#08080C',
          card: '#12131C',
          surface: '#1A1C2B',
          border: 'rgba(255, 200, 0, 0.25)',
          blr: '#FFC800',
          hyd: '#7C4DDA',
          che: '#2E7CE4',
          pune: '#E8801F',
        },
        dark: {
          bg: '#08080C',
          secondary: '#12131C',
          tertiary: '#1A1C2B',
          border: 'rgba(255, 200, 0, 0.2)',
          text: '#F2F2F6',
          muted: '#A0A2B0',
          subtle: '#626478',
        },
        light: {
          bg: '#F5F5F0',
          secondary: '#FFFFFF',
          tertiary: '#EAEAE0',
          border: '#DEDECF',
          text: '#0D0E12',
          muted: '#5E606E',
        },
        accent: {
          DEFAULT: '#FFC800',
          hover: '#FFE800',
          light: '#FFD633',
        },
        cat: {
          tech: '#FFC800',
          ai: '#7C4DDA',
          programming: '#2E7CE4',
          design: '#EC4899',
          career: '#E8801F',
          courses: '#10B981',
          science: '#06B6D4',
          business: '#F97316',
          finance: '#22C55E',
          health: '#EF4444',
          productivity: '#F59E0B',
          entertainment: '#A855F7',
          news: '#64748B',
          other: '#6B7280',
        },
      },
      borderRadius: {
        card: '16px',
        sheet: '24px',
        pill: '9999px',
        input: '12px',
        button: '12px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.6)',
        sheet: '0 -4px 24px rgba(0,0,0,0.8)',
        fab: '0 4px 24px rgba(255,200,0,0.4)',
        glow: '0 0 24px rgba(255,200,0,0.35)',
        'glow-lg': '0 0 40px rgba(255,200,0,0.5)',
      },
    },
  },
  plugins: [],
};