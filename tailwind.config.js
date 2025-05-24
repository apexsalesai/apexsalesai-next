/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00c2cb',
        primaryDark: '#00a8b3',
        secondary: '#052438',
        background: '#0d1321',
        backgroundDarker: '#091018',
        text: '#e2e8f0',
        textLight: '#cbd5e0',
        textDimmed: '#a0aec0',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
