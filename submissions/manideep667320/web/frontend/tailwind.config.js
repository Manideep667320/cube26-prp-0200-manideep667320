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
        station: {
          bg: '#080c14',
          surface: '#0f1726',
          panel: '#131d31',
          border: '#1e2d47',
          hover: '#18243d',
        },
        pass: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
        },
        fail: {
          DEFAULT: '#f43f5e',
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.35)',
        },
        uncertain: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
        },
        cobalt: {
          DEFAULT: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.35)',
        }
      },
      fontFamily: {
        display: ['Outfit', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Geist', 'Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
