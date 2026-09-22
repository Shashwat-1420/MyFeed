/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * Semantic theme tokens (Phase A) — backed by CSS variables in
       * src/index.css so dark/light mode actually repaints.
       * Use these for chrome instead of hardcoded hex:
       *   bg-canvas bg-panel bg-chip · text-ink text-muted text-dim
       *   border-edge · text-gold (readable gold in both modes)
       * Gold FILLS stay literal #F0B31C + text-black (works on both modes).
       */
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* Semantic theme tokens (Phase A) — CSS-var backed, see src/index.css */
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
          bright: '#FFCB14',
        },
        iqoo: {
          DEFAULT: '#F0B31C',
          bright: '#FFCB14',
          deep: '#C8920A',
          soft: '#FEF6DD',
          glow: 'rgba(240, 179, 28, 0.4)',
          bg: '#08080C',
          card: '#12131C',
          surface: '#1A1C2B',
          border: 'rgba(240, 179, 28, 0.25)',
          blr: '#F0B31C',
          hyd: '#7C4DDA',
          che: '#2E7CE4',
          pune: '#E8801F',
        },
        dark: {
          bg: '#08080C',
          secondary: '#12131C',
          tertiary: '#1A1C2B',
          border: 'rgba(240, 179, 28, 0.2)',
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
          DEFAULT: '#F0B31C',
          hover: '#FFCB14',
          light: '#F5C647',
        },
        cat: {
          tech: '#F0B31C',
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
        'card': '16px',
        'sheet': '24px',
        'pill': '9999px',
        'input': '12px',
        'button': '12px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.6)',
        'sheet': '0 -4px 24px rgba(0,0,0,0.8)',
        'fab': '0 4px 24px rgba(240,179,28,0.4)',
        'glow': '0 0 24px rgba(240,179,28,0.35)',
        'glow-lg': '0 0 40px rgba(240,179,28,0.5)',
      },
    },
  },
  plugins: [],
}
