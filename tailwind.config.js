/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D0D0D',
          secondary: '#1A1A1A',
          tertiary: '#242424',
          border: '#2E2E2E',
          text: '#F2F2F2',
          muted: '#9A9A9A',
          subtle: '#5A5A5A',
        },
        light: {
          bg: '#F7F7F8',
          secondary: '#FFFFFF',
          tertiary: '#EFEFEF',
          border: '#E4E4E7',
          text: '#111111',
          muted: '#666666',
        },
        accent: {
          DEFAULT: '#7C6EF6',
          hover: '#9585F8',
          light: '#6C5FF0',
        },
        cat: {
          tech: '#6366F1',
          ai: '#8B5CF6',
          programming: '#3B82F6',
          design: '#EC4899',
          career: '#F59E0B',
          courses: '#10B981',
          science: '#06B6D4',
          business: '#F97316',
          finance: '#22C55E',
          health: '#EF4444',
          productivity: '#EAB308',
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
        'card': '0 2px 12px rgba(0,0,0,0.4)',
        'sheet': '0 -4px 24px rgba(0,0,0,0.6)',
        'fab': '0 4px 20px rgba(124,110,246,0.4)',
        'glow': '0 0 20px rgba(124,110,246,0.5)',
      },
    },
  },
  plugins: [],
}
