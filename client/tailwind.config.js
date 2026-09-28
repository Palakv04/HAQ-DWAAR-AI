/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#581c87',
          900: '#3b0764',
          950: '#230340',
        },
        haq: {
          purple: '#240b49',
          dark: '#1e0a3c',
          surface: '#fbf9fe',
          border: '#e9e1f5',
          accent: '#ea580c',
          green: '#059669',
          gold: '#f59e0b',
          blue: '#2563eb',
          vermilion: '#c2410c',
          slate: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'haq': '0 4px 20px -2px rgba(43, 15, 76, 0.08), 0 2px 6px -1px rgba(43, 15, 76, 0.04)',
        'haq-lg': '0 10px 25px -3px rgba(43, 15, 76, 0.12), 0 4px 10px -2px rgba(43, 15, 76, 0.06)',
        'mic-glow': '0 0 35px rgba(249, 115, 22, 0.45)',
      }
    },
  },
  plugins: [],
}
