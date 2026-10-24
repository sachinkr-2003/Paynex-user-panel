/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paynex: {
          gold: '#f59e0b',
          amber: '#fbbf24',
          darkGold: '#d97706',
          cyan: '#06b6d4',
          sky: '#38bdf8',
          green: '#10b981',
          red: '#ef4444',
          bg: '#080a11',
          card: '#0e111c',
          border: 'rgba(245, 158, 11, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
