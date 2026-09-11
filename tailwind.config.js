/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        space: {
          950: '#030307',
          900: '#070712',
          800: '#0d0d1e',
          700: '#17172f',
        }
      }
    },
  },
  plugins: [],
}
