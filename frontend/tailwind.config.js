/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#8B1A1A',
          dark: '#6B1212',
          light: '#FDF2F2',
        },
        charcoal: '#1A1A1A',
        warm: '#F5F5F5',
      }
    },
  },
  plugins: [],
}
